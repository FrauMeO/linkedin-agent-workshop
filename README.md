# LinkedIn Agent — Workshop Build

Turn one topic into a researched LinkedIn post and a matching editorial-style image, driven by a set of Claude-style skills (`skills/`) and a small local web UI (`app/`) on top of the same files.

Built live as a workshop demo for a fictional sheet-metal manufacturing client — swap `business-context.md` and `content-plan.md` for your own niche to reuse it.

## What's here

- `skills/research/`, `skills/write-linkedin/`, `skills/create-visual/`, `skills/quality-check/` — the four pipeline skills, usable as Claude Code slash commands (`.claude/skills` symlinks here) or as prompts the local web app reads directly off disk.
- `skills/linkedin-image/` — the image-generation script (`generate_image.py`) and house visual style guide the `create-visual` skill and the web app both use.
- `app/` — a dependency-free Node `http` server (`app/server.js`) plus a static UI (`app/public/`) that drives the pipeline: pick or type a topic, pick an audience/length/image orientation, run research → write → image (or all at once with a live progress stream), and browse everything you've already made.
- `posts/NNN-slug/` — one folder per topic: `brief.md`, `research.md`, `post.md`, `image-prompt.md`, `images/`.
- `business-context.md`, `content-plan.md`, `naming-rules.md` — the working context the skills read from.
- `memory.md`, `sessions/` — a running decision log and per-session handoffs (see `AGENTS.md`).

## Setup

Requires Node.js 18+ and Python 3 (for image generation) plus an OpenAI API key with `gpt-image-1` access (image generation additionally needs org verification beyond a valid key + billing).

```bash
cp .env.example .env
# edit .env and set OPENAI_API_KEY (and OPENAI_TEXT_MODEL if you want a different model)

npm run app
# open http://127.0.0.1:4322
```

Note: `.env` is git-ignored on purpose — never commit real API keys. `generate_image.py` also reads `OPENAI_API_KEY` (or `GEMINI_API_KEY` with `IMAGE_PROVIDER=gemini`) straight from the environment or this same `.env` file.

## Using it without the web UI

The same four skills work as Claude Code slash commands from inside this folder: `/research`, `/write-linkedin`, `/create-visual`, `/quality-check`, run in that order against a topic in `posts/NNN-slug/`.

## Rules this project follows

See `AGENTS.md` for the full session protocol. In short: the agent owns the outcome, each skill owns one part of the work, facts/inference/opinion are labelled separately, and this project stops at a reviewable draft — human approval before publishing anything.
