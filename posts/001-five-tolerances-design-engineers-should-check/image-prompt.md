# Image prompt — v2 (editorial scale-play poster system)

Regenerated after the `linkedin-image` skill's house style changed from the "deadpan streetwear poster" to the "editorial scale-play poster system." Original `post-image.png` kept for reference; this is `post-image-v2.png`.

## Derived variables

- **ARCHETYPE:** scale-shift — the post's core tension is that tiny tolerances carry outsized consequences, which scale-shift is built for (leverage/precision/a tool).
- **VISUAL_IDEA:** an improbably oversized precision caliper carefully closing its jaws around a small punched hole in a sheet metal panel, dwarfing the engineer beside it — small measurements, huge stakes.
- **SUBJECT:** an oversized brushed-steel digital caliper.
- **HUMAN_ROLE:** a design engineer, seen mostly from the side/shoulder, one hand steadying the caliper's thumbwheel.
- **ACTION_OR_RELATIONSHIP:** the engineer carefully adjusting the giant caliper's jaws as they close around a small punched hole in a flat sheet metal panel resting below.
- **COMPOSITION:** caliper placed diagonally, occupying roughly 60% of the frame, sheet metal panel with the hole in the lower third, engineer positioned to the side interacting with the thumbwheel; wide reserved negative space at the top for the headline.
- **BACKGROUND:** concrete grey studio backdrop.
- **PALETTE:** concrete grey field, brushed steel caliper, muted navy workwear on the engineer, one safety-orange accent on the caliper's digital readout.
- **HEADLINE:** "Measure Twice, Ask First"
- **SUPPORTING_LINE:** "Five checks before it's cut"
- **DISPLAY_TYPE:** bold condensed grotesk sans-serif, high contrast, white or near-white type.

## Filled prompt

Create an original portrait LinkedIn editorial poster using the editorial scale-play poster system. Visual archetype: scale-shift. Core visual idea: an improbably oversized precision digital caliper carefully closing its jaws around a small punched hole in a sheet metal panel, dwarfing the engineer beside it. Hero subject: an oversized brushed-steel digital caliper. Human role, if any: a design engineer, seen from the side/shoulder, one hand steadying the caliper's thumbwheel. Interaction or action: the engineer carefully adjusting the giant caliper's jaws as they close around a small punched hole in a flat sheet metal panel resting below. Compose it with the caliper placed diagonally and occupying roughly 60% of the frame, the panel and hole in the lower third, and the engineer to the side interacting with the thumbwheel, substantial intentional negative space at the top, and a quiet concrete grey studio backdrop. Use a concrete grey field with brushed steel, muted navy workwear, and one safety-orange accent on the caliper's digital readout, with a premium photorealistic editorial campaign finish: believable material texture, precise edges, soft directional studio lighting, grounded contact shadows, and a subtle reflection only if it supports the composition. Set the exact display text 'Measure Twice, Ask First' in a bold condensed grotesk sans-serif with an optional small exact supporting line 'Five checks before it's cut'. The text must be clean, legible, and placed away from the face and critical object details. Use one visual idea only. No logos, trademarks, copied product designs, watermarks, URLs, extra text, busy scenery, generic stock-photo posing, neon, or decorative clutter.

## Generation

```
python3 .agents/skills/linkedin-image/generate_image.py "<filled prompt above>" --output posts/001-five-tolerances-design-engineers-should-check/images/post-image-v2.png --size 1024x1536
```
