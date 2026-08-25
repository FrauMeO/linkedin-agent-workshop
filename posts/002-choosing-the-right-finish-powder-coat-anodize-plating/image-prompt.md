# Image prompt — v2 (editorial scale-play poster system)

Regenerated after the `linkedin-image` skill's house style changed from the "deadpan streetwear poster" to the "editorial scale-play poster system." Original `post-image.png` kept for reference; this is `post-image-v2.png`.

## Derived variables

- **ARCHETYPE:** hero-object — the post has one clear symbol (the tested finish panel) and a surprising result to reveal, which hero-object is built for.
- **VISUAL_IDEA:** one sheet metal test panel split down the middle — a glossy anodized half showing visible scuffing, a matte powder-coated half still pristine — literalizing the post's claim that the "premium-looking" finish lost the durability test.
- **SUBJECT:** a single oversized sheet-metal test panel, split vertically: left half a glossy anodized finish with visible abrasion scuffing, right half a matte powder-coated finish, clean and unmarked.
- **HUMAN_ROLE:** none — omit the person, let the object and headline carry the idea.
- **ACTION_OR_RELATIONSHIP:** a small wire abrasion wheel rests at the boundary between the two finishes, mid-test, as the implied cause of the scuffing on the anodized side.
- **COMPOSITION:** panel centered and oversized, occupying roughly 65% of the frame, the wire wheel positioned at the seam between the two finishes, wide reserved negative space above for the headline.
- **BACKGROUND:** charcoal navy studio backdrop.
- **PALETTE:** charcoal navy field, brushed silver anodized half, matte dark grey powder-coated half, one safety-orange accent on the wire wheel.
- **HEADLINE:** "Shiny Isn't Tough"
- **SUPPORTING_LINE:** "73s vs 8s under the wire wheel"
- **DISPLAY_TYPE:** bold condensed grotesk sans-serif, high contrast, white or near-white type.

## Filled prompt

Create an original portrait LinkedIn editorial poster using the editorial scale-play poster system. Visual archetype: hero-object. Core visual idea: one sheet metal test panel split down the middle — a glossy anodized half showing visible scuffing, a matte powder-coated half still pristine — showing that the "premium-looking" finish lost the durability test. Hero subject: a single oversized sheet-metal test panel, split vertically: left half a glossy anodized finish with visible abrasion scuffing, right half a matte powder-coated finish, clean and unmarked. Human role, if any: none. Interaction or action: a small wire abrasion wheel rests at the boundary between the two finishes, mid-test, as the implied cause of the scuffing on the anodized side. Compose it with the panel centered and oversized, occupying roughly 65% of the frame, the wire wheel positioned at the seam between the two finishes, and substantial intentional negative space above, and a quiet charcoal navy studio backdrop. Use a charcoal navy field with brushed silver anodized half, matte dark grey powder-coated half, and one safety-orange accent on the wire wheel, with a premium photorealistic editorial campaign finish: believable material texture, precise edges, soft directional studio lighting, grounded contact shadows, and a subtle reflection only if it supports the composition. Set the exact display text 'Shiny Isn't Tough' in a bold condensed grotesk sans-serif with an optional small exact supporting line '73s vs 8s under the wire wheel'. The text must be clean, legible, and placed away from critical object details. Use one visual idea only. No logos, trademarks, copied product designs, watermarks, URLs, extra text, busy scenery, generic stock-photo posing, neon, or decorative clutter.

## Generation

```
python3 .agents/skills/linkedin-image/generate_image.py "<filled prompt above>" --output posts/002-choosing-the-right-finish-powder-coat-anodize-plating/images/post-image-v2.png --size 1024x1536
```
