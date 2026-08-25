## LinkedIn post

Ask five sheet metal shops the minimum distance a hole can sit from an edge, and you'll get five different answers.

That's not because someone's wrong. It's because the "right" number depends on your material thickness, whether the hole is punched or laser-cut, and how tight your other tolerances already are.

Before a print gets to us, here are the five things worth checking yourself first:

• General tolerance — ±0.005" on anything critical-to-function, ±0.015" as a realistic default everywhere else. Tighter than that on every dimension just adds cost without adding function.

• Hole-to-edge distance — roughly 1.5–2x material thickness for punched holes. Too close and the punch tears or bulges the edge.

• Hole-to-bend distance — about 2–2.5x thickness plus the bend radius. Too close and the hole ovals out during forming.

• Minimum bend radius — 1x thickness for soft alloys, up to 2x for harder tempers. Go tighter and you risk cracking on the outside of the bend.

• Bend relief at intersecting bends — width at least material thickness, depth at least the bend radius plus material thickness. Skip it and the corner tears.

None of these are hard limits carved in stone. They're starting points — and the reason a print benefits from an actual conversation with the shop building it, not just a spec sheet.

What's the tolerance question you wish came up earlier in your design process?

#SheetMetal #DesignForManufacturing #MechanicalEngineering #ManufacturingTips

## Image concept (superseded — see ## Image below)

A single annotated technical drawing: a simple sheet metal bracket (one bend, two holes) rendered as a clean blueprint-style line drawing, with five short callout labels pointing to the five spots discussed in the post (general tolerance zone, hole-to-edge, hole-to-bend, bend radius, bend relief). One bold visual idea, no clutter, reads like an engineering sketch rather than a stock photo.

## Image prompt (superseded — see ## Image below)

Format: 4:5 vertical. Style: clean white/blueprint-blue technical line drawing, minimal flat illustration, high contrast, engineering-sketch aesthetic (not photorealistic, not 3D render). Main visual: a simple L-bracket sheet metal part with one bend and two punched holes, drawn in thin precise linework like a CAD drawing, centered on the frame with generous margin. Five small numbered callout leader-lines point from the part to five short labels placed around it: "tolerance," "edge distance," "bend distance," "bend radius," "relief." Text: only the five one or two-word labels above, no paragraph text, no logo. Color palette: white or light blueprint-blue background, dark navy or charcoal linework, one accent color (e.g. safety orange) used only for the callout leader-lines and numbers. Composition: centered part, balanced negative space, mobile-legible at small size. Avoid: photorealism, stock-photo hands/factory imagery, clutter, more than five callouts, dense text blocks, gradients, drop shadows.

## Image

**v1** — generated via the `linkedin-image` skill's earlier fixed "deadpan streetwear poster" house style (this replaced the diagram concept above, per that skill's instructions). Saved to `images/post-image.png`.

Variables used:
- **Subject:** stylised human fabricator/mechanic
- **Attitude:** calm, unbothered
- **Background:** warm safety-orange (#E67332)
- **Outfit:** navy work jacket, plain tee, black beanie, dark relaxed trousers, work boots, safety glasses pushed up on forehead
- **Gesture/prop:** holding digital calipers loosely, other hand in pocket
- **Headline:** "MEASURE TWICE, ASK FIRST"

**v2** — regenerated after the skill's house style changed to the "editorial scale-play poster system" (photorealistic/editorial, archetype-driven). Saved to `images/post-image-v2.png`. Full prompt and derivation in `image-prompt.md`.

Variables used:
- **Archetype:** scale-shift
- **Subject:** oversized brushed-steel digital caliper
- **Human role:** design engineer steadying the thumbwheel
- **Background:** concrete grey studio
- **Palette:** concrete grey, brushed steel, muted navy, safety-orange accent
- **Headline:** "Measure Twice, Ask First"
- **Supporting line:** "Five checks before it's cut"

## Final checklist

- Hook works — leads with the cross-shop disagreement, not a generic opener; under 210 characters
- One clear idea — the five tolerance checkpoints, framed as "check these before you send the print"
- Useful takeaway — concrete numbers an engineer can act on immediately
- Image supports the post — visualizes the same five checkpoints on an actual part
- Ready to publish
