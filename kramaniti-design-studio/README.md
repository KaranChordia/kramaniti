# Kramaniti Design Studio

Welcome to the Kramaniti Design Studio.

This tool is a dedicated, local Next.js environment designed for creating cinematic, highly-animated infographic videos for the Kramaniti brand. It leverages our internal component library to render premium templates (such as orbital rings, diverging light paths, and staggered typography sequences) which can then be captured via screen recording.

## Usage Overview

The studio lives inside the main Next.js `website/` project but is accessed via the `/design-studio` route. 

It uses a data-driven scene generator. To build a new design, you simply define the content and animation parameters in `website/src/data/scenes.ts`. The `SceneRenderer` automatically maps this data to the corresponding React components.

## Available Templates

The Studio supports several templates out-of-the-box. Each has a specific data signature defined in `website/src/lib/design-studio/types.ts`:

1. **`orbit-layers`** - A 3-layer concentric orbit visualization with glowing cores and traveling light paths. Ideal for "The Method" style representations.
2. **`diverging-paths`** - A multi-path SVG animation with an origin node branching into several terminal nodes with traveling beams. Ideal for "The Problem" style representations.
3. **`insight-grid`** - A beautiful glassmorphism grid layout modeled after the Insights page, featuring "Read Essay" CTAs and background floating atmosphere text.
4. **`title-card`** - Cinematic opening titles with staggered highlighting.
5. **`quote-highlight`** - Word-by-word quote reveals.
6. **`metric-showcase`** - Giant animated tabular numbers.
7. **`comparison-flow`** - Left/Right vertical step comparisons.
8. **`process-pipeline`** - Horizontal connected steps.
9. **`capability-matrix`** - Comparative grid tables.
10. **`priority-pyramid`** - Stacked tier visualizations.
11. **`value-equation`** - A + B = C layout cards.
12. **`timeline`** - Horizontal event timeline with a drawing line.
13. **`data-breakdown`** - Horizontal percentage bar charts.

## For AI Agents
If you are an AI Coding Agent and the user prompted you with "Design", please read `AGENT_INSTRUCTIONS.md` immediately to understand your workflow.
