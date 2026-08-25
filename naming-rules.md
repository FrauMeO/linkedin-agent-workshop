# Naming and filing rules

## Posts

Every topic gets exactly one folder: `posts/NNN-slug/`.

- `NNN` is a zero-padded 3-digit sequence, assigned in creation order. Never reuse a number, never renumber. A topic that stops at research still keeps its number.
- `slug` is the topic in lowercase kebab-case (strip punctuation, collapse spaces/hyphens).
- Create the folder the moment work starts on a topic — at research time, not at publish time.
- Everything about that topic lives inside its own folder and nowhere else: `brief.md`, `research.md`, `post.md`, `image-prompt.md`, `images/`.
- Re-generated images version up inside that folder's `images/` (`post-image.png`, `post-image-v2.png`, ...) — never overwrite, never move outside the folder.
- Before writing any file for a topic, check `posts/` for an existing folder with that slug and reuse it rather than creating a duplicate.

## Sessions

Every working session gets exactly one handoff file: `sessions/YYYY-MM-DD.md` (use `YYYY-MM-DD-2.md` etc. if a second session happens the same day). Follow `sessions/TEMPLATE.md`. Never overwrite a previous day's handoff.

## Memory

`memory.md` is a single running log, newest entry at the top. Append — never rewrite or delete past entries, even to "clean up." If a past decision is superseded, add a new entry that says so; don't erase the old one.
