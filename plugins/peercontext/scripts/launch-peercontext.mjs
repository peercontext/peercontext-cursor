import { spawn } from 'node:child_process';
import { lstatSync, readFileSync, realpathSync, statSync } from 'node:fs';
import { homedir } from 'node:os';
import path from 'node:path';

const windows = process.platform === 'win32';

function within(root, file) {
  const relative = path.relative(root, file);
  return relative && relative !== '..' && !relative.startsWith('..' + path.sep) && !path.isAbsolute(relative);
}

function packageEntry(directory) {
  try {
    const root = realpathSync(directory);
    const manifest = path.join(root, 'package.json');
    if (!statSync(manifest).isFile()) return;
    const pkg = JSON.parse(readFileSync(manifest, 'utf8'));
    const bin = typeof pkg.bin === 'string' ? pkg.bin : pkg.bin?.peercontext;
    if (pkg.name !== 'peercontext' || typeof bin !== 'string' || path.isAbsolute(bin)) return;
    const candidate = path.resolve(root, bin);
    if (!within(root, candidate)) return;
    const entry = realpathSync(candidate);
    if (within(root, entry) && /\.[cm]?js$/i.test(entry) && statSync(entry).isFile()) return entry;
  } catch {
    // A missing or broken install may have a valid counterpart elsewhere on PATH.
  }
}

function linkedEntry(directory) {
  const shim = path.join(directory, 'peercontext');
  let target;
  try {
    if (!lstatSync(shim).isSymbolicLink()) return;
    target = realpathSync(shim);
  } catch {
    return;
  }
  if (!/\.[cm]?js$/i.test(target)) return;
  for (let root = path.dirname(target); root !== path.dirname(root); root = path.dirname(root)) {
    if (packageEntry(root) === target) return target;
  }
}

function globalPackage(prefix) {
  return windows
    ? path.join(prefix, 'node_modules', 'peercontext')
    : path.join(prefix, 'lib', 'node_modules', 'peercontext');
}

function findEntry() {
  const pathDirectories = (process.env.PATH ?? '').split(path.delimiter).filter(dir => path.isAbsolute(dir));
  for (const directory of pathDirectories) {
    const entry = (!windows && linkedEntry(directory))
      || packageEntry(globalPackage(windows ? directory : path.dirname(directory)));
    if (entry) return entry;
  }
  const nodeDirectory = path.dirname(process.execPath);
  const prefixes = [
    process.env.npm_config_prefix,
    windows ? nodeDirectory : path.dirname(nodeDirectory),
    ...windows
      ? [process.env.APPDATA && path.join(process.env.APPDATA, 'npm')]
      : [path.join(homedir(), '.local'), path.join(homedir(), '.npm-global')],
  ];
  for (const prefix of prefixes) {
    if (!prefix || !path.isAbsolute(prefix)) continue;
    const entry = packageEntry(globalPackage(prefix));
    if (entry) return entry;
  }
}

function fail(message) {
  console.error(`PeerContext: ${message}`);
  process.exitCode = 1;
}

const entry = findEntry();
if (!entry) {
  const npm = windows ? 'npm.cmd' : 'npm';
  fail(`Could not find the installed CLI. Run ${npm} install -g peercontext@0.6.0-alpha.11 with Node.js 22.22 or later, ensure the npm command directory is on Cursor's PATH, then reload Cursor.`);
} else if (!windows && typeof process.execve === 'function') {
  process.execve(process.execPath, [process.execPath, entry, 'mcp'], process.env);
} else {
  const child = spawn(process.execPath, [entry, 'mcp'], { stdio: 'inherit' });
  child.once('error', error => fail(`Could not start the CLI: ${error.message}`));
  child.once('exit', code => { process.exitCode = code ?? 1; });
}
