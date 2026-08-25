---
name: linkedin-image
description: Generate the actual image file for a finished LinkedIn post using the shared editorial scale-play poster system. Use only after linkedin-post has produced a complete post.md — never before research or drafting.
---

# LinkedIn Image Generation

This skill turns a finished post's central idea into an original editorial poster with a shared, flexible visual identity. The house style is the **editorial scale-play poster system**: one visual tension, a dominant subject or human-object relationship, bold negative space, premium studio finish, and concise display typography.

Do not invoke this skill to begin a post or before `post.md` exists.

## Workflow

### 1. Find the finished post

Locate `posts/<NNN>-<slug>/post.md`. If the user names a topic instead of a folder, match it to the most recent matching folder under `posts/`. If it is missing, stop and tell the user to run `linkedin-post` first.

### 2. Read the brand style guide

Read `style-guide.json` in this skill directory in full. It defines the fixed visual system. Keep its hierarchy and finish, but select the archetype and metaphor that best carry the individual post's argument.

Always preserve:

- one visual idea, not a literal summary of the whole post;
- a portrait social-poster layout with substantial intentional negative space;
- one dominant hero subject or human-object relationship, often with a purposeful scale shift;
- premium editorial photography or polished digital compositing, realistic materials, controlled light, and restrained shadows/reflections;
- one exact 1-5 word display headline, plus at most one short supporting line;
- a single controlled background field and compact 2-4 colour palette;
- original artwork only. Never copy a reference image's brand, logo, product design, wording, or exact composition.

### 3. Derive the per-post variables

Read the hook and main takeaway in `post.md`. Explicitly decide:

- **ARCHETYPE:** `scale-shift`, `hero-object`, `human-scale`, `framing-hands`, or `surreal-collage`.
- **VISUAL_IDEA:** one sentence describing the visual tension that expresses the claim.
- **SUBJECT, HUMAN_ROLE, ACTION_OR_RELATIONSHIP, COMPOSITION, BACKGROUND, PALETTE.**
- **HEADLINE:** exact 1-5 word display text drawn from the hook/thesis.
- **SUPPORTING_LINE:** optional, exact, at most 10 words, otherwise `none`.
- **DISPLAY_TYPE:** a clean condensed or grotesk sans-serif display treatment.

The visual device adapts to the argument: scale-shift for leverage/tools/constraints; hero-object for a clear symbol or outcome; human-scale for agency and performance; framing-hands for choice or collaboration; surreal-collage for a counterintuitive metaphor.

### 4. Fill the prompt template and generate

Fill `prompt_template` from `style-guide.json` with the variables. Run:

```
python3 generate_image.py "<filled prompt>" --output posts/<NNN>-<slug>/images/post-image.png --size 1024x1536
```

`1024x1536` is the standing portrait output. Build the essential subject and headline inside a centred 4:5-safe region for LinkedIn feed crops.

The script reads `OPENAI_API_KEY`, or `GEMINI_API_KEY` with `IMAGE_PROVIDER=gemini`, from the environment or the repo-root `.env`. If a key is missing, relay that plainly and stop. Never hardcode a key.

On regeneration, create `post-image-v2.png`, `post-image-v3.png`, and so on. Do not overwrite an existing image without approval.

### 5. Confirm and wire up

- Report the saved file path.
- Record the archetype, visual idea, and headline under `## Image` in `post.md`.
- Save the complete prompt and all chosen variables in `image-prompt.md` alongside the post.

## Provider setup

- Default provider: OpenAI (`gpt-image-1`), key from `OPENAI_API_KEY`.
- Alternate: Gemini (`gemini-2.5-flash-image`), set `IMAGE_PROVIDER=gemini` and `GEMINI_API_KEY`.
- Never hardcode keys in this skill or its script.
