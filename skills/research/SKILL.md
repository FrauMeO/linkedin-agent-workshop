---
name: research
description: Research a LinkedIn post topic and produce a sourced, labelled research brief. Use before writing any post in session-25-live — the writing skill should never run without a research.md to read from.
---

# Research skill

Goal: turn a topic (from that post's `brief.md`) into a short, sourced research brief that the writing skill can use without guessing. This is a specialist worker — it finds, labels, and hands off. It does not write the LinkedIn post.

## Workflow

### 1. Find or create the post folder

Every topic lives in exactly one `posts/NNN-slug/` folder — see `naming-rules.md`.

- Check `posts/` for a folder whose slug matches this topic. If one exists, use it.
- Otherwise create the next folder: find the highest existing `NNN-` prefix, zero-pad the next integer to 3 digits, append the topic's kebab-case slug (e.g. `posts/002-ai-adoption-workflow-first/`).
- If a `brief.md` doesn't exist yet in that folder, write one from what you know (topic, audience, point of view, desired action) before researching — the brief is the contract, not a formality.

### 2. Clarify scope

Read `brief.md` and, if present, `business-context.md` (at the `session-25-live/` project root) for this business's ICPs, competitors, and platform fit. Identify before searching:

- Topic (as specific as possible)
- Time window — default: last 30 days, unless the topic is evergreen
- Angle: industry news, new tool/product, case study, stat/data point, expert opinion, trend — prefer an angle that speaks to one of the ICPs in `business-context.md` over a generic one

If scope is genuinely unclear, ask one short clarifying question. Otherwise proceed — don't stall on optional detail.

### 3. Search

- Use `WebSearch` to find recent, relevant sources.
- Use `WebFetch` to pull full content from the 3-6 most promising sources.
- Prioritize: primary sources (company blogs, official announcements, original research), reputable outlets, recent publish dates.
- Deprioritize: SEO content farms, undated pages, sources older than the time window (unless the topic is evergreen).

### 4. Extract and label

From each source, pull only what's usable, and label every claim:

- **fact** — directly stated by a credible source, with a number or specific detail
- **inference** — a reasonable conclusion you're drawing from facts, not stated outright anywhere
- **opinion** — a viewpoint (yours, a source's, or a common industry take) that isn't verifiable

Also capture: notable quotes, publish date, concrete examples/case studies, tools or products named, source URL.

**Do not fabricate stats.** If a number can't be traced to a source, drop it or label it clearly as unverified.

### 5. Find a counterpoint

Every brief needs at least one genuine counterpoint or complicating factor — a reason the thesis might be wrong, incomplete, or context-dependent. Don't invent a strawman; use what the research actually surfaced. If nothing conflicts, say that the thesis is broadly uncontested and why.

### 6. Synthesize

Condense into `research.md` using this structure:

```markdown
# Research Brief

**Topic:**
**Time Window:**
**Last Updated:** YYYY-MM-DD

## Summary
One paragraph: what's actually going on with this topic right now.

## Key Points
- 3-6 bullets, each tagged (fact) / (inference) / (opinion)

## Notable Statistics
A small Markdown table: stat, source, date. If nothing verifiable exists, write
"No verified stats found" — do not fill the table with guesses.

## Counterpoint
The strongest reason this thesis might be wrong, incomplete, or context-dependent.

## Possible Content Angles
1-3 angles a writer could take, each one sentence.

## Sources
| Source | URL | Date | Supports |
|---|---|---|---|
```

### 7. Save and hand off

Write `research.md` into `posts/NNN-slug/research.md`. If a `research.md` already exists for this folder, treat it as a checkpoint — either extend it with new findings or explicitly overwrite it if the user asked for a redo; don't silently discard prior sourcing without saying so.

State clearly which folder and file you wrote, and that it's ready for the writing skill. **Do not draft the post yourself.**
