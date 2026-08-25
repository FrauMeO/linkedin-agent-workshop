# Research: Five tolerances every design engineer should check before sending us a print

**Topic:** #1 from `content-plan.md` — capability/process post type, targeting ICP1 (Design/Mechanical Engineer) per `business-context.md`.
**Window:** evergreen technical topic, not news-driven — sources are current DFM/design-guide pages (2026 where dated), not a 30-day news scan.
**Angle:** stat/data point + expert-opinion hybrid — concrete numeric rules of thumb an engineer can act on before submitting a print.

Claims below are labelled **(fact)** — stated directly by a source, **(inference)** — a reasonable read across sources, or **(opinion)** — this brief's synthesis/judgment, matching the convention in `business-context.md`.

---

## Summary

Sheet metal design-for-manufacturability (DFM) guides converge on the same handful of dimensional risk areas — general tolerance bands, hole-to-edge distance, hole-to-bend distance, bend relief, and minimum bend radius — but the *specific numbers* differ meaningfully from source to source, mostly as a function of material thickness and process (punched vs. laser-cut holes). That variance is itself useful content: it's the reason a print needs a real DFM conversation with a shop rather than a single universal rulebook (fact/inference, synthesized across sources below).

## Key points

- **General/default tolerance:** most sources converge near **±0.005″ (±0.13mm) for critical dimensions** and **±0.015″ (±0.38mm) as a realistic general default**, widening to ±0.030–0.040″ across multiple bends (fact, MJM Manufacturing; corroborated by Protolabs). [MJM](https://mjmmfg.com/sheet-metal-dfm-guide/), [Protolabs](https://www.protolabs.com/services/sheet-metal-fabrication/design-guidelines/)
- **Hole-to-edge distance:** sources disagree on the exact multiplier — MJM and Atlas Manufacturing both cite **≥2× material thickness (2T)** as the punched-hole minimum, with 1.5T sometimes cited as a floor; Protolabs instead gives fixed thresholds (0.062″ from edge for material ≤0.036″, 0.125″ for thicker material) rather than a thickness ratio (fact, sources conflict on method — ratio vs. fixed threshold). [MJM](https://mjmmfg.com/sheet-metal-dfm-guide/), [Atlas Manufacturing](https://atlasmfg.com/blog/hole-to-edge-and-hole-to-bend-distance-sheet-metal-dfm-minimums/), [Protolabs](https://www.protolabs.com/services/sheet-metal-fabrication/design-guidelines/)
- **Hole-to-bend distance:** Atlas Manufacturing gives the clearest formula — **d = 2T + R for holes under ~1″ diameter, d = 2.5T + R for larger holes/slots** (d = distance from hole edge to bend line, T = thickness, R = inside bend radius), simplifying to roughly 3T when R = T. Protolabs' proximity rule is simpler: features within **4× material thickness of a bend** risk deformation. (fact, both sources; different framing — formula vs. flat multiplier) [Atlas Manufacturing](https://atlasmfg.com/blog/hole-to-edge-and-hole-to-bend-distance-sheet-metal-dfm-minimums/), [Protolabs](https://www.protolabs.com/services/sheet-metal-fabrication/design-guidelines/)
- **Bend relief:** MJM recommends relief **width ≥1T and depth ≥ bend radius + 1T** to prevent tearing at bend intersections; this is the one dimension where sources didn't conflict, though only one source gave hard numbers. (fact, single-sourced) [MJM](https://mjmmfg.com/sheet-metal-dfm-guide/)
- **Minimum bend radius:** roughly **1T for soft alloys, 1.5T–2T for hard tempers or thicker stock** — smaller radii risk cracking on the outer bend surface. (fact, MJM) [MJM](https://mjmmfg.com/sheet-metal-dfm-guide/)
- **Bend angle tolerance:** MJM cites **±0.5°** as a typical bend angle tolerance; no second source corroborated this number, so treat as single-sourced. (fact, single-sourced) [MJM](https://mjmmfg.com/sheet-metal-dfm-guide/)
- **Cost driver:** over-tolerancing (applying tight tolerances to non-critical dimensions) is repeatedly flagged as a cost and cycle-time driver with no functional benefit — the DFM advice across sources is to reserve tight tolerances for dimensions that are actually critical-to-function. (fact/opinion, consistent theme across MJM and general DFM literature) [MJM](https://mjmmfg.com/sheet-metal-dfm-guide/)

## Candidate "five tolerances" for the post

Synthesized selection (opinion) — the five that are (a) most consistently cited across sources and (b) most likely to actually change a print before it's submitted:

1. **General dimensional tolerance** (±0.005″ critical / ±0.015″ general default) — sets expectations before anything else is checked.
2. **Hole-to-edge distance** (≥1.5–2× material thickness, or a fixed minimum depending on thickness) — most commonly cited failure mode (tear-out/bulge).
3. **Hole-to-bend distance** (2T+R to 2.5T+R, or ~4T flat rule) — prevents ovaled/distorted holes near a bend.
4. **Minimum bend radius relative to material** (1T–2T depending on alloy/temper) — prevents cracking.
5. **Bend relief at intersecting bends** (width/depth ≥1T + radius) — prevents tearing where two bends meet.

*(Bend angle tolerance is a plausible 6th but is single-sourced here — worth a follow-up post rather than folding into this one without more corroboration.)*

## Content angles

1. **"Five numbers, no software required"** — a scannable, save-worthy checklist post format (document/carousel-style, which `business-context.md` §5 flags as a format that performs well on LinkedIn for manufacturing content).
2. **"Why the answer isn't always the same number"** — lead with the cross-source disagreement on hole-to-edge distance as the hook: even DFM guides don't agree, which is exactly why a print benefits from a real conversation with the shop building it — ties to the direct-fabricator-vs-marketplace differentiation angle in `business-context.md` §3/§5.
3. **"The tolerance that costs you money"** — lead with the over-tolerancing cost point; reframe as a design-for-cost story rather than a pure technical checklist.

## Sources

| Source | URL | Date | Supports |
|---|---|---|---|
| MJM Manufacturing — Sheet Metal DFM Guide | https://mjmmfg.com/sheet-metal-dfm-guide/ | undated | General tolerances, hole-to-edge, hole-to-bend, bend relief, min. bend radius, bend angle tolerance |
| Protolabs — Design Guidelines for Sheet Metal Fabrication | https://www.protolabs.com/services/sheet-metal-fabrication/design-guidelines/ | undated | Tolerance table by thickness, hole-to-edge fixed thresholds, bend proximity rule |
| Atlas Manufacturing — Hole-to-Edge and Hole-to-Bend Distance DFM Minimums | https://atlasmfg.com/blog/hole-to-edge-and-hole-to-bend-distance-sheet-metal-dfm-minimums/ | 2026-07-17 | Hole-to-edge and hole-to-bend formulas with worked examples |

Additional pages surfaced but not fetched in full (candidates for a follow-up/deeper post): [Fabcon — DFM Guidelines 2026](https://blog.fabcon.com/sheet-metal-fabrication/sheet-metal-dfm-guidelines-2026/), [Komaspec — Sheet Metal Design Guidelines](https://www.komaspec.com/about-us/blog/sheet-metal-design-guidelines-designing-components/), [JLC CNC — Sheet Metal Design Guidelines](https://jlccnc.com/blog/sheet-metal-design).

## Handoff

Saved to `posts/001-five-tolerances-design-engineers-should-check/research.md`. Ready as input for `write-linkedin` — recommend content angle #2 ("why the answer isn't always the same number") since it plays to this business's direct-fabricator differentiation instead of reading as a generic listicle any competitor could publish.
