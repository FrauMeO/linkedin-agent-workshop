# Bob's approval desk

A dashboard where Bob answers the open questions from `Bob_Strategy_Approval_Summary.pdf` and records his approval decision. Answers flow into this folder.

- `questions.json` — source of truth for the questions, plus the 1 Oct scan updates shown at the top of the dashboard.
- `dashboard.template.html` + `build.mjs` — run `node bob-review/build.mjs` to regenerate `dashboard.html` after editing questions.
- `dashboard.html` — the page published as a claude.ai Artifact. Bob's answers save to the artifact's shared database as he types.
- `import-answers.mjs` — copies the answers into this folder (`answers.json`, readable `answers.md`).

## Getting Bob's answers into the files

Ask Claude "import Bob's answers", or do it by hand:

1. Read the artifact database to a folder (`ArtifactData` list on `answers`, `meta/approval`, `meta/general` with `out_dir`).
2. `node bob-review/import-answers.mjs <that folder>`

Bob can also use "Save a copy of my answers" on the page and send the JSON; pass that file to the same script.

## Access

The artifact is private until shared. Bob needs Contributor or Editor access to save answers; a view-only share shows the page read-only.
