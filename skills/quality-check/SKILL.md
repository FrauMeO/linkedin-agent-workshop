---
name: quality-check
description: Score a finished post.md and its latest generated image against a fixed rubric before the post is considered done. Use after write-linkedin/linkedin-post and create-visual/linkedin-image have both produced output — never before both exist. Fails below 8/10 and drives a fix-and-rescore loop.
---

# Quality check

Goal: catch a weak hook, an unsupported claim, or an off-brief image before a post is called finished — not after. This is a gate, not a formality: below the passing bar, the post does not move forward until it's fixed and rescored.

Do not invoke this skill before both `post.md` and at least one generated image exist for the topic.

## Workflow

### 1. Locate inputs

For the topic's `posts/NNN-slug/` folder, read:
- `research.md` — the source of truth for every factual claim in the post
- `post.md` — the text and the `## Image` section (which variables/prompt were used)
- The **latest** generated image in `images/` (highest `-vN`, or the unsuffixed file if there's no `-v2`+)

If any of these is missing, stop and say which skill to run first.

### 2. Score the post text (1-10 each)

- **Hook** — survives the 210-character fold; specific/contrarian/numeric, not a generic opener.
- **Clarity** — one clear idea, not several competing ones.
- **Usefulness** — a concrete, actionable takeaway; save-worthy.
- **Accuracy** — every claim traces to `research.md` without being strengthened, generalized beyond what the source supports, or a hedge rounded into a fact. This is the criterion most likely to hide a real defect — check it claim by claim, not by overall impression.
- **Formatting** — short paragraphs, 3-5 hashtags at the end only, no body links, human tone (not over-decorated/AI-sounding).
- **CTA** — natural, invites real conversation, not engagement bait.

### 3. Score the image (1-10 each)

- **Concept match** — the hero subject/gesture/metaphor actually represents the post's central claim, not just its topic.
- **House-style adherence** — matches the current `style-guide.json` (archetype fit, composition, palette, typography rules) for whichever image skill generated it.
- **Mobile legibility** — headline and hero subject read clearly at small size; text doesn't overlap a face or critical detail.
- **Technical quality** — no garbled/misrendered text, no obvious AI artifacts, clean edges.
- **Compliance** — no logos, watermarks, invented brand marks, or banned elements from that style guide's `avoid` list.

### 4. Compute and gate

- **Overall score** = average of all criteria above (post + image combined, or score them as two separate averages if that's clearer to report — report both either way).
- **Floor rule** — any single criterion scoring below 7 fails the check regardless of the overall average. Accuracy and concept match are the two most common floor violations; treat them as hard gates, not just inputs to an average.
- **Passing bar: 8/10 overall, with no criterion below the floor of 7.**

### 5. On failure

- State exactly which criterion failed and why (quote the specific claim, sentence, or visual element).
- Fix the specific defect — reword the claim to match `research.md`, sharpen the hook, or regenerate the image with a corrected prompt (save as the next `-vN`, never overwrite).
- Re-run this scoring pass on the fixed output. Repeat until it clears the bar.

### 6. Report

State the final scorecard (each criterion, the overall score, pass/fail) and, if anything was fixed, what changed and why. Do not silently pass a post that needed a fix without saying so.
