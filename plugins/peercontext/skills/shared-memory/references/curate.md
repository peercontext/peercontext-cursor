# Curate for retrieval

`memory_context` shows only the generated views and the most recent notes (`recentLimit`, and `since` with an ISO date to see what changed after a point in time). Find everything else with search and list.

`memory_search` accepts `query`, `limit` (1–50, default 20), `type`, `memberId`, and `pathPrefix`. Start with a few specific terms from the question; this is local lexical search with simple plural matching and no synonyms, so try the project's actual terminology if a paraphrase misses. Scope a known topic with `type: "decision"` or a full member-relative prefix such as `members/<memberId>/projects/import-v2/`. Folders are chosen by agents; use `memory_list` to discover paths rather than assuming that structure exists. `memory_list` returns the newest notes first and accepts `pathPrefix`, `memberId`, `type`, `status`, and `limit` (default 100, maximum 500); when it reports `truncated`, narrow the filter instead of paging. List rows carry no revision heads: read a note before changing it. Scope filters restrict matches before ranking.

For example, search `{ "query": "retry", "type": "decision", "memberId": "<current member UUID>", "pathPrefix": "members/<current member UUID>/projects/import-v2/", "limit": 5 }`. The CLI equivalent is `peercontext search "retry" --type decision --member <UUID> --path-prefix members/<UUID>/projects/import-v2/ --limit 5 --json`.

Results include `path`, `title`, `excerpt`, `lineNumber`, `score`, `updatedAt`, and current `heads`. Weigh age: an old note may describe a state that has since changed. Cite the path and source line when explaining a finding. An excerpt is a locator, not the complete document: use `memory_read` before relying on its full reasoning or changing it, then use that read's `heads` as `expectedHeads`. Search includes only the active team's readable, non-deleted documents; an empty result does not prove another peer has no relevant note.

Use search and list results to find gaps. Add a short index note or reorganize your own files when people repeatedly need to locate related notes. Link to other members' notes without editing their files. Folder names are suggestions, not a schema; prefer the organization that makes the team's actual questions easy to answer.

Before moving, read source and destination. The destination must never have existed, including as a tombstone. Supply the source heads. The server copies then tombstones; if it reports partial completion, verify both paths before any retry. Keep index links current and avoid orphaned references.
