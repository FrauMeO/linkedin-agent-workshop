---
name: create-visual
description: Generate the image for a finished session-25-live LinkedIn post using the shared editorial scale-play poster system. Use only after write-linkedin has produced a post.md — never before research or drafting.
---

# Visual skill

Turn the post's *same idea* into one original, high-impact portrait poster. The fixed house style is the **editorial scale-play poster system**: bold negative space, one memorable hero subject or human-object relationship, controlled studio colour, and concise editorial typography.

The system is consistent, not repetitive. It must adapt the visual metaphor and composition to the topic. Do not force every post into a streetwear illustration, a human character, or a product shot.

Do not invoke this skill before `post.md` exists. If it is missing, stop and say to run the writing skill first.

## Workflow

### 1. Find the finished post

Locate `posts/NNN-slug/post.md` for this topic. If it is missing, stop.

### 2. Read the house style guide

Read `../linkedin-image/style-guide.json` in full. It is the standing visual system for every post in this project. Follow it; do not fall back to the old deadpan-streetwear illustration rules.

Non-negotiables:

- **Core idea:** reduce the post to one visual tension or metaphor. Do not make an infographic, a collection of generic symbols, or an illustration of every paragraph.
- **Composition:** use a portrait social-poster frame, intentional negative space, and one dominant hero subject or relationship. Make the image readable at phone size.
- **Scale:** prefer a deliberately oversized, staged, or otherwise surprising hero object when it helps explain the idea. The scale shift must feel purposeful and physically grounded.
- **Finish:** premium editorial photography or polished digital compositing, with convincing materials, simple studio light, contact shadows, and restrained reflections. Illustration is an exception, not the default.
- **Typography:** one exact 1-5 word display word/headline; optionally one short exact supporting line. Treat text as a large compositional element, not a caption.
- **Colour:** one dominant field plus 2-4 supporting colours. Backgrounds are quiet and controlled, never decorative.
- **Originality:** abstract principles from reference images; never reproduce their brands, logo marks, product designs, text, or exact compositions.

### 3. Derive the post variables

Read `post.md`'s hook and takeaway. Ignore older image concepts from another style. Before generating, write out:

- **ARCHETYPE** — choose one: `scale-shift`, `hero-object`, `human-scale`, `framing-hands`, or `surreal-collage`.
- **VISUAL_IDEA** — the one-sentence visual tension that embodies the post's claim.
- **SUBJECT** — the dominant object, figure, or pairing.
- **HUMAN_ROLE** — the human's function in the composition, if one is needed. Use `none` when the object carries the idea alone.
- **ACTION_OR_RELATIONSHIP** — how the figure and object interact, or what creates the visual tension.
- **COMPOSITION** — subject placement, type placement, scale, and negative-space allocation.
- **BACKGROUND** and **PALETTE** — draw from the guide's background options and colour rule.
- **HEADLINE** — exact 1-5 word display text, adapted from the post's hook or thesis. It must make sense without the post.
- **SUPPORTING_LINE** — optional exact line, maximum 10 words; otherwise use `none`.
- **DISPLAY_TYPE** — clean condensed/grotesk sans-serif display type, with contrast and placement that do not obscure the hero.

Choose the archetype based on the argument, not habit:

- Leverage, systems, constraints, tools, or difficult choices → `scale-shift`.
- One product, outcome, or symbolic object → `hero-object`.
- Agency, capability, leadership, craft, or action → `human-scale`.
- Options, comparison, curation, or collaboration → `framing-hands`.
- A counterintuitive or conceptual point → `surreal-collage`.

### 4. Fill the template and generate

Fill `prompt_template` from the style guide with every variable above, then run:

```
python3 ../linkedin-image/generate_image.py "<filled prompt>" --output posts/NNN-slug/images/post-image.png --size 1024x1536
```

Run from inside `session-25-live/`, or adjust paths. The current provider supports `1024x1536` as the standing portrait output. Compose within a centred 4:5-safe region, so the artwork remains strong when cropped for a LinkedIn feed.

The script reads its key from `OPENAI_API_KEY` (or `GEMINI_API_KEY` if `IMAGE_PROVIDER=gemini`), sourced from the environment or a `.env` file three directories above the script — the workshop root `.env`, not `session-25-live/.env`. If the key is missing, relay that message plainly and stop. Do not fabricate an image.

If regenerating a post that already has an image, save `post-image-v2.png`, `post-image-v3.png`, and so on. Never overwrite without the user's confirmation.

### 5. Write the prompt file and confirm

Save the chosen variables and full prompt to `posts/NNN-slug/image-prompt.md`, so another tool can reproduce the decision:

```markdown
# Image prompt

- Archetype:
- Visual idea:
- Subject:
- Human role:
- Action/relationship:
- Composition:
- Background and palette:
- Headline: "..."
- Supporting line: "..." or none

## Prompt

[the fully filled prompt_template]
```

Report the saved image path and the archetype, visual idea, and headline. Add a short `## Image` section to `post.md` with those choices so future regenerations stay consistent.

## Provider setup

- Default: OpenAI `gpt-image-1`, key from `OPENAI_API_KEY`.
- Alternate: Gemini `gemini-2.5-flash-image`, set `IMAGE_PROVIDER=gemini` and `GEMINI_API_KEY`.
- Never hardcode a key in this skill or the script.
