# Goal

Turn one topic into a researched LinkedIn post and matching visual.

This file is an index, not a reference manual. It stays under 200 lines on purpose — real content lives in the files below. Add a new pointer here when a new standing document is created; don't paste that document's content into this file.

## Inputs

- Topic
- Audience
- Point of view
- Desired action

## Outputs

- `research.md`
- `post.md`
- `image-prompt.md`
- final image when generation is available

## Where things live

- `business-context.md` — ICPs, competitors, platform fit, what content performs well. Read by `research` and `write-linkedin`.
- `naming-rules.md` — the folder/file naming convention for `posts/`, `sessions/`, and `memory.md`. Read before creating any file.
- `memory.md` — running log of decisions made across sessions. Append an entry each session.
- `sessions/` — one handoff file per session (`sessions/YYYY-MM-DD.md`, from `sessions/TEMPLATE.md`). Read the most recent one at the start of a session; write a new one at the end.
- `skills/research/SKILL.md`, `skills/write-linkedin/SKILL.md`, `skills/create-visual/SKILL.md`, `skills/quality-check/SKILL.md` — the four pipeline skills. `.claude/skills` is a symlink to `skills/`, so each is also usable as a slash command (`/research`, `/write-linkedin`, `/create-visual`, `/quality-check`).
- `skills/quality-check/SKILL.md` — scores a finished `post.md` + latest image against a fixed rubric; 8/10 passing bar with a 7/10 floor per criterion, drives a fix-and-rescore loop on failure. Runs after `create-visual`/`linkedin-image`, before a post is called done.
- `posts/NNN-slug/` — one folder per topic; see `naming-rules.md`.
- `app/` — the local web skin (stretch goal); a UI on top of the same files above, nothing more.

## Session protocol

- **Start:** read `memory.md` and the most recent file in `sessions/` before doing new work, so you don't repeat or contradict a prior decision.
- **End:** write `sessions/YYYY-MM-DD.md` from `sessions/TEMPLATE.md`, and append one entry to `memory.md` summarizing what changed and why. A hook enforces this — see `.claude/settings.json`.

## Rules

- The agent owns the outcome. Each skill owns one part of the work.
- Label facts, inference, and opinion separately.
- Do not silently strengthen claims.
- Human approval before publishing. This project stops at a reviewable draft.
