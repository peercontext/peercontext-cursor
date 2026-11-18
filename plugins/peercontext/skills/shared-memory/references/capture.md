# Capture useful work

Publish when a teammate, or you in a later session, would need something and could not cheaply rediscover it. Skip routine steps. One short, well-titled note beats a long one nobody opens.

Name the actual source: issue, file path, commit, observation or who said it. Separate observed facts, proposals and pending actions. State dates and owners only when known, and write dates in full (`2026-11-15`, not "Friday"). Do not infer or report another member's progress; link to their note instead.

## Frontmatter

Start each note with frontmatter. It is what search filters, the generated views and `memory_context` read:

```markdown
---
type: decision
title: Retry imports at the batch boundary
summary: Rows retry per batch of 50, not per row; avoids duplicate briefs after a timeout.
tags: [import-v2, reliability]
---
```

Recognized fields are `type`, `title`, `summary`, `status` and `tags` (inline list or `- item` lines). Other keys are allowed and ignored. Keep `summary` to one line.

| type | Use for | Notes |
| --- | --- | --- |
| `now` | What you are working on right now | Keep one and replace its content as the focus changes. Shown in the Now view, marked stale after 24 hours and dropped from it after 14 days. |
| `task` | An actionable follow-up | `status: open`, then `status: completed` once verified done. Open tasks appear in the To do view. |
| `decision` | A choice that was made and why | Include the alternatives rejected and who decided. |
| `handoff` | State someone else needs to continue | What is done, what is next, where the work lives, known traps. |
| `project` | A lasting overview or index for an effort | Link the related notes. |
| `reference` | Durable facts: conventions, constraints, how-tos | Say how you know. |

Types are free text, so a team may add its own; use the ones above when they fit so `memory_search` with `type` finds them.

## Where it goes

Update the existing note when one already covers the topic: search first. Otherwise choose a descriptive lowercase path in your namespace, such as `members/<memberId>/decisions/retry-boundary.md` or `members/<memberId>/projects/import-v2/handoff.md`. Segments may use lowercase letters, digits, `-`, `_` and `.`; at most eight segments.

If publishing returns `advice`, fix the note in the same session.
