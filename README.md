# PeerContext for Cursor

Read and contribute to your team's shared Markdown memory in Cursor. The plugin connects Cursor to the PeerContext daemon on your computer and includes the Shared Memory skill.

You need Node.js 22.22 or later and npm. Run Cursor and PeerContext as the same user.

## First-time setup

Install the PeerContext CLI and start the daemon. On macOS, `peercontext setup` also installs a separate Cursor integration, so start the daemon directly when you are using this plugin:

```sh
npm install -g peercontext@0.6.0-alpha.11
peercontext start
```

In Windows PowerShell, use `npm.cmd install -g peercontext@0.6.0-alpha.11` and `peercontext.cmd start`. Use the `.cmd` suffix for the other PeerContext and npm commands below as well.

In a second terminal, run `peercontext open`. Sign in in the local dashboard, then create a team or open an invitation from a trusted teammate. For an existing team, follow its device approval flow. Enter email codes, invitations, tokens, and keys only in the local dashboard or CLI. Keep them out of chat.

If npm's default global prefix isn't writable, try `npm install -g --prefix "$HOME/.local" peercontext@0.6.0-alpha.11` on macOS or Linux and add `$HOME/.local/bin` to PATH. On Windows, use `npm.cmd install -g --prefix "$env:LOCALAPPDATA\PeerContext" peercontext@0.6.0-alpha.11` and add that prefix to your user Path. With any custom prefix, make the npm command directory visible to Cursor as well as your terminal. That directory is `<prefix>/bin` on macOS and Linux and `<prefix>` on Windows. Check the default prefix with `npm prefix -g`.

### Optional macOS background service

If you want the daemon to run automatically when you sign in, stop the foreground daemon with Ctrl+C and register the owned per-user service:

```sh
peercontext service install
launchctl bootstrap "gui/$(id -u)" "$HOME/Library/LaunchAgents/com.shared-memory.agents.plist"
peercontext status
```

If an existing PeerContext service is already running, keep using it.

## Install the Cursor plugin

Cursor does not install an arbitrary GitHub URL until the plugin is listed on the [Cursor Marketplace](https://cursor.com/marketplace/publish). Until then, load this checkout locally:

```sh
mkdir -p "$HOME/.cursor/plugins/local"
rm -rf "$HOME/.cursor/plugins/local/peercontext"
cp -R plugins/peercontext "$HOME/.cursor/plugins/local/peercontext"
```

Reload Cursor. The manifest must be at `~/.cursor/plugins/local/peercontext/.cursor-plugin/plugin.json`.

On a Teams or Enterprise plan, a team admin can import `https://github.com/peercontext/peercontext-cursor` from Dashboard → Settings → Plugins → Team Marketplaces. Cursor reads `.cursor-plugin/marketplace.json`.

Bind the project to your active team:

```sh
peercontext init --workspace "/absolute/path/to/project"
```

When invoking memory tools that take a workspace, pass the project's absolute path.

## Migrate an existing standalone Cursor integration

If you used `peercontext setup` or `peercontext install-agent cursor`, install the plugin first. Preview removal of the standalone MCP entry and skill:

```sh
peercontext install-agent cursor --uninstall --dry-run
```

Review the listed actions. If they match the old PeerContext integration, run `peercontext install-agent cursor --uninstall`. The CLI removes owned files and the owned MCP entry. If it reports a changed file or configuration, review those changes before removing any custom configuration. The migration keeps your daemon, team, project binding, and other agents' integrations. Reload Cursor.

## Update or remove

Pull this repository and copy `plugins/peercontext` into `~/.cursor/plugins/local/peercontext` again, then reload Cursor. Update the CLI with the npm install command and prefix used originally. Restart the foreground daemon or, for the macOS service, run `launchctl kickstart -k "gui/$(id -u)/com.shared-memory.agents"`.

Remove the local plugin with:

```sh
rm -rf "$HOME/.cursor/plugins/local/peercontext"
```

Your PeerContext CLI, daemon, and team data stay on this computer.
