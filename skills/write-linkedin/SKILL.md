---
name: write-linkedin
description: Turn a finished research.md into a ready-to-post LinkedIn post inside that topic's posts/NNN-slug/ folder. Use only after the research skill has produced a research.md — never invent facts to skip research.
---

# Writing skill

Goal: turn the brief and research into one LinkedIn post. The writer may simplify the research. It may not silently strengthen it — no upgrading "may" into "will," no rounding a hedge into a fact.

## Workflow

### 1. Locate the folder and required inputs

Find the topic's `posts/NNN-slug/` folder (see `naming-rules.md`). Require:

- `brief.md` — topic, audience, point of view, desired action, and the **length knob** (short / medium / long)
- `research.md` — if missing, stop and say so; do not write from memory or invented facts
- `business-context.md` (at the `session-25-live/` project root, if present) — use it to pick a post type that matches an actual ICP (capability, reliability/track-record, case study, or shop-floor/people post — see its section 5) rather than a generic angle

### 2. Read, don't add

Read `research.md` in full before writing anything. Every claim in the post must trace back to something in the research, labelled fact or clearly-hedged inference. Opinions from the research may become the post's point of view, but don't present them as settled fact.

### 3. Choose one angle

Select a single clear angle — don't stack two ideas hoping one lands. Good shapes:

- "Most people think X, but actually Y"
- "Here is a simple way to do X"
- "The mistake people make with X"
- "A framework for understanding X"
- "Why X matters now"

### 4. Write the post

**Hook (first two lines / ~210 characters before the "see more" fold):** this decides whether anyone reads past it. Use a specific claim, a concrete number, or a real tension from the research — not a scene-setter. Never open with "I'm excited to share..." or "I've been thinking about...". No emoji in the hook.

**Length**, from the brief's length knob:
- short: ~600-900 characters
- medium: ~1,200-1,500 characters (default if unset)
- long: ~1,800-2,200 characters

**Formatting:**
- 1-2 sentences per paragraph, blank line between paragraphs
- Bullets only for lists of 3+ items
- 0-2 emoji total, used as visual breaks, never one per line
- No bold-every-line, no checkmark-per-bullet — that reads as AI-generated and gets scrolled past

**Hashtags and links:**
- 3-5 hashtags maximum, at the very end only
- No links in the body; if a link matters, note in the post that it's "in the comments" (don't fabricate the comment itself)

**Close:** one useful, concrete takeaway plus one question that invites a real reply — not generic engagement bait ("Thoughts?").

### 5. Self-review before saving

Check against this list; revise once if anything fails:

- [ ] Hook survives the fold — would a reader tap "see more"?
- [ ] One idea only, not two stitched together
- [ ] Every claim traces to `research.md`
- [ ] No unsourced numbers
- [ ] Formatting is human, not over-decorated
- [ ] Hashtags ≤5, end only; no body links
- [ ] Ends with a takeaway + a real question

### 6. Save

Write to `posts/NNN-slug/post.md`:

```markdown
# LinkedIn Post

## Post
[final post text, ready to copy-paste]

## Notes
[1-2 lines: what was simplified or left out from the research, and why]
```

Do not publish. Do not generate or describe the image — that is the `create-visual` skill's job, and it runs after this one.
