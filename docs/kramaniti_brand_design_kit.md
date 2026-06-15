# Kramaniti Brand Design Kit

**Version:** 1.0 (June 2026)  
**Purpose:** A unified design system and visual asset guide for Kramaniti’s public-facing presence across the website, content creation, social graphics, slide decks, and brand materials.

---

## 1. Core Visual Concept: The Duality

Kramaniti's identity is anchored in a deliberate contrast:
*   **Computational Precision**: Clean grids, structured data lines, and monospace typography reflecting first-principles systems engineering.
*   **Cinematic Craft**: Low-key lighting, warm gold highlights, high-contrast scenes, and smooth micro-animations conveying cinematic storytelling and human depth.

The aesthetic should feel closer to a **quantitative research portal** or an **independent film studio** than a generic AI marketing agency.

---

## 2. Color System

Deploy a **dark-mode-first** color system. Dark backgrounds communicate premium technical depth and B2B gravity. Light mode transitions should be applied intentionally, maintaining geometric borders and depth through soft shadows rather than flat lines.

### 2.1 Base Surfaces
Used for backgrounds, layouts, cards, and input modules.

| Surface Name | Hex Code | HSL | Usage |
| :--- | :--- | :--- | :--- |
| **Obsidian** | `#0A0A0F` | `240° 20% 4%` | Default full-page background |
| **Graphite** | `#141418` | `240° 12% 8%` | Elevated panels, cards, modules |
| **Charcoal** | `#1E1E24` | `240° 10% 13%` | Hover states, active input fills, code blocks |

### 2.2 Accent Colors
Used sparingly for CTAs, active states, key focal points, and indicator elements.

| Accent Name | Hex Code | HSL | Usage |
| :--- | :--- | :--- | :--- |
| **Burnished Gold** | `#C9A84C` | `44° 53% 54%` | Primary CTAs, brand highlights, active line traces |
| **Aged Bronze** | `#A07D3A` | `38° 48% 43%` | Secondary buttons, borders, hover transitions |
| **Muted Amber** | `#D4A843` | `43° 62% 55%` | Badges, warning states, annotation markers |

### 2.3 Text Hierarchy

| Text Role | Hex Code | HSL | Usage |
| :--- | :--- | :--- | :--- |
| **Primary (Ice White)** | `#F0F0F5` | `240° 20% 95%` | Headings, hero copies, primary body text |
| **Secondary (Silver Mist)** | `#9B9BA8` | `240° 8% 63%` | Subheadings, supporting paragraphs, captions |
| **Tertiary (Slate Grey)** | `#6B6B78` | `240° 7% 44%` | Disabled buttons, placeholders, footnotes |

### 2.4 Gradients

*   **Gold Horizon** (`linear-gradient(135deg, #C9A84C 0%, #A07D3A 50%, #7A5C2E 100%)`): Primary buttons, high-impact CTA wrappers, and gradient text accents.
*   **Dark Depth** (`linear-gradient(180deg, #0A0A0F 0%, #141418 50%, #1E1E24 100%)`): Subtle top-to-bottom page layout fades.
*   **Ambient Glow** (`radial-gradient(ellipse at center, rgba(201, 168, 76, 0.08) 0%, transparent 70%)`): Backdrop overlay placed behind main headings or cards.

---

## 3. Typography System

### 3.1 Font Stack

*   **Headings (H1 - H3)**: **Outfit** (`var(--font-outfit), system-ui, sans-serif`) — Clean, geometric sans-serif with a technical yet modern feel.
*   **Subheadings & Cards (H4 - H6)**: **Outfit** (`var(--font-outfit), system-ui, sans-serif`) — Consistent brand typography across section and card headings.
*   **Body Copy**: **Outfit** (`var(--font-outfit), system-ui, -apple-system, sans-serif`) — Live website body and interface text currently resolve to Outfit for a unified brand feel.
*   **Monospace**: **JetBrains Mono** (`var(--font-jetbrains-mono), monospace`) — Used for status labels, numbers, and technical annotation accents.

Implementation note: the live website imports **Outfit** and **JetBrains Mono** from `next/font/google` in `website/src/app/layout.tsx`. Legacy token names such as `--font-inter`, `--font-sora`, and `--font-geist-sans` are mapped back to `--font-outfit` in `website/src/app/globals.css`.

### 3.2 Type Scale (Desktop & Mobile)

| Element | Font | Size (Desktop) | Size (Mobile) | Line Height | Letter Spacing | Weight |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **H1 — Hero Headline** | Outfit | `56px` / `3.5rem` | `36px` / `2.25rem` | `1.1` | `-0.02em` | `700` |
| **H2 — Section Title** | Outfit | `40px` / `2.5rem` | `28px` / `1.75rem` | `1.2` | `-0.01em` | `600` |
| **H3 — Subsection** | Outfit | `28px` / `1.75rem` | `22px` / `1.375rem` | `1.3` | `0` | `600` |
| **H4 — Card Heading** | Outfit | `20px` / `1.25rem` | `18px` / `1.125rem` | `1.4` | `0` | `500` |
| **Body Large** | Outfit | `18px` / `1.125rem` | `16px` / `1rem` | `1.7` | `0` | `400` |
| **Body Regular** | Outfit | `16px` / `1rem` | `15px` / `0.9375rem` | `1.7` | `0` | `400` |
| **Caption** | Outfit | `13px` / `0.8125rem` | `12px` / `0.75rem` | `1.5` | `0.02em` | `400` |
| **Micro-labels** | JetBrains Mono | `11px` | `10px` | `1.5` | `0.18em` | `700` |

### 3.3 Typography Rules
1.  **No all-caps in core headlines.** Reserve uppercase text strictly for micro-labels (e.g., `CASE STUDY`, `METHODOLOGY`) set at `11px` with `0.18em` letter spacing.
2.  **Paragraph Spacing**: Use `margin-bottom: 1.5em` between paragraphs. Avoid double line breaks.
3.  **Maximum line width**: Enforce a maximum line width of **72 characters** (approx. `640px` width) for long body copy blocks to maximize reading comfort.

---

## 4. Visual Atmosphere & Motion (The Flow Line System)

The trademark background design element of Kramaniti is its dynamic flow line (scanline) system. This gives layouts computational movement without adding heavy graphics.

```
+-----------------------------------------------------------+
|               |                                           |
|     - - - - - o - - - - [Horizontal Flow Line] - - - - -  |
|               |                                           |
|               | [Vertical Flow Line]                      |
|               o                                           |
|               |                                           |
+-----------------------------------------------------------+
```

### 4.1 Design Logic for Flow Lines
1.  **Varying Velocities**: Lines should never flow at the same speed. Use prime-number durations (e.g., `5s`, `5.8s`, `7s`, `8.5s`, `9.4s`) to avoid synchronous movement.
2.  **Delay Offsets**: Always assign negative animation delays (`-1.2s`, `-3.8s`) to ensure lines are already moving when the page loads, rather than fading in from static positions.
3.  **Subtle Opacity**: Lines must hover in the background. Maintain opacities between `0.3` and `0.45` on dark backgrounds.
4.  **Flow Direction**: 
    *   **Horizontal lines** flow from left to right.
    *   **Vertical lines** flow from top to bottom.

### 4.2 CSS Implementation Guide (For Developers)

Include this CSS module block to implement the flow lines system on secondary pages or web widgets:

```css
/* Container enclosing the background network */
.atmosphere {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}

/* Base line properties */
.flowLine {
  position: absolute;
  pointer-events: none;
}

/* Horizontal scanline styling */
.flowHorizontal {
  left: 5%;
  right: 5%;
  height: 1px;
  background-color: rgba(201, 168, 76, 0.12);
  background-image: linear-gradient(
    90deg, 
    transparent, 
    rgba(201, 168, 76, 0.72), 
    rgba(255, 255, 255, 0.85), 
    rgba(201, 168, 76, 0.72), 
    transparent
  );
  background-size: 300px 100%;
  background-repeat: no-repeat;
  animation: flowHorizontal 7s linear infinite;
}

/* Vertical scanline styling */
.flowVertical {
  top: 5%;
  bottom: 5%;
  width: 1px;
  background-color: rgba(255, 255, 255, 0.04);
  background-image: linear-gradient(
    180deg, 
    transparent, 
    rgba(201, 168, 76, 0.54), 
    rgba(255, 255, 255, 0.8), 
    rgba(201, 168, 76, 0.54), 
    transparent
  );
  background-size: 100% 300px;
  background-repeat: no-repeat;
  animation: flowVertical 8s linear infinite;
}

/* Animation Keyframes */
@keyframes flowHorizontal {
  0% { background-position: -300px 0; }
  100% { background-position: calc(100% + 300px) 0; }
}

@keyframes flowVertical {
  0% { background-position: 0 -300px; }
  100% { background-position: 0 calc(100% + 300px); }
}

/* Accessibility: Stop motion if prefers-reduced-motion is active */
@media (prefers-reduced-motion: reduce) {
  .flowLine {
    animation: none !important;
  }
}
```

---

## 5. Brand Voice & Copywriting

### 5.1 The Sequence Rule
Every piece of copy must be framed in accordance with Kramaniti's core sequence:
1.  **Strategy before tools**: Diagnose the workflow before deploying software.
2.  **Systems before scale**: Establish reliable internal processes before buying traffic.
3.  **Content after clarity**: Polish public messaging only after operational clarity is achieved.

### 5.2 Voice Attributes
*   **Direct & Unhedged**: Avoid empty fluff and conditional modifiers. Ground copy in direct verbs.
    *   *Correct*: "We build practical systems that organize scattered data."
    *   *Incorrect*: "We hope to help you potentially align your workflow options."
*   **Analytical**: Speak in concrete steps, parameters, and layouts.
    *   *Correct*: "Diagnose bottlenecks, design the routed blueprint, build custom node bridges, and train."
    *   *Incorrect*: "Experience the magic of complete workflow revolution."
*   **Calibrated Proof**: Never invent metrics, testimonials, or results. Use category-level facts when specific numbers are unverified.

### 5.3 Banned Language (Zero Hype Policy)

The following terms are banned across all Kramaniti materials to keep visual credibility intact:

| Banned Term | Alternative | Rationale |
| :--- | :--- | :--- |
| *delve* | *examine*, *audit*, *explore* | Heavy indicator of low-quality AI copy. |
| *revolutionary* / *next-gen* | *measured*, *systematic* | Overused consulting buzzwords. |
| *cutting-edge* / *state-of-the-art* | *current-generation*, *reliable* | Meaningless, non-specific claims. |
| *automate everything* | *connected workflows*, *assisted tasks* | Unrealistic; Kramaniti values human-led overrides. |
| *leverage* (as a verb) | *deploy*, *apply*, *use* | Overused corporate jargon. |
| *game-changing* | *reduces time-to-output* | Cliché. Replace with specific timeline indicators. |

---

## 6. Content Creation & Asset Kit (For Socials, Decks, & Thumbnails)

To use Kramaniti's visual language in static formats (LinkedIn posts, pitch decks, PDFs, YouTube thumbnails), translate the CSS effects into static design assets.

### 6.1 Color Usage in Graphics
*   **Backgrounds**: Set slide/artboard backgrounds to Charcoal (`#1E1E24`) or Obsidian (`#0A0A0F`).
*   **Text**: Use Ice White (`#F0F0F5`) for headlines. Highlight key nouns or action verbs in Burnished Gold (`#C9A84C`).
*   **Grid Overlays**: Use a very faint coordinate grid (1.5px lines, color set to white or gold at 5% opacity) as the base design layer.

### 6.2 Designing Flow Lines in Static Layouts
In static slide decks or social media cards, flow lines become thin "dividers" or coordinate tracks that frame text:
*   Add a **1px horizontal line** in Aged Bronze (`#A07D3A`) at 30% opacity directly above or below text paragraphs.
*   Place a small **glowing coordinate node** (a 6px circle with a subtle gold glow filter) at the intersection of a vertical and horizontal line to anchor list elements.

### 6.3 Photographic Direction (Warm-Cool Tension)
When sourcing or generating visual images (e.g. founder portraits, office scenes):
*   **Low-Key Contrast**: Dominated by shadows and single directional key lights (Rembrandt lighting).
*   **Warm-Cool Tension**: Neutral cold background colors paired with warm amber/gold key glows.
*   **Negative Space**: Maintain a minimum of **30% negative space** in all layout graphics.

### 6.4 Cinematographic Prompting Parameters (For Midjourney/Flux)
Use these parameters at the end of image prompts to create custom brand imagery:

```text
Rembrandt lighting, high contrast, warm amber key glow against a cool slate grey background, 
shot on 85mm lens, depth of field f/1.8, cinematic color grade, subtle film grain ISO 800, 
cinematographic realism, wide aspect ratio --ar 16:9
```
