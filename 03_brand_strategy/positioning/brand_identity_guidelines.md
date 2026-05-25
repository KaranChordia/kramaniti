# Brand Identity Guidelines

**Purpose:** Establish the definitive visual and verbal identity system for Kramaniti. This document governs all creative outputs — website, social assets, pitch decks, invoices, and video thumbnails — to enforce a consistent, premium, high-ticket B2B aesthetic that separates Kramaniti from generic AI consulting brands.

**Key Findings:** The visual identity must reflect the brand's core duality: computational precision and cinematic craft. The aesthetic should feel closer to a quantitative hedge fund's research portal than a typical marketing agency's website.

**Related Files:**
*   [positioning_analysis.md](file:///Users/k.c/kramaniti/03_brand_strategy/positioning/positioning_analysis.md) — Market positioning and differentiators
*   [visual_system_palette.md](file:///Users/k.c/kramaniti/03_brand_strategy/positioning/visual_system_palette.md) — Reusable website palette, motion system, and section language
*   [brand_narrative.md](file:///Users/k.c/kramaniti/03_brand_strategy/narrative/brand_narrative.md) — Core storytelling copy
*   [company_name_ideas.md](file:///Users/k.c/kramaniti/03_brand_strategy/naming/company_name_ideas.md) — Naming etymology and strategic rationale
*   [domain_and_handles_registry.md](file:///Users/k.c/kramaniti/03_brand_strategy/naming/domain_and_handles_registry.md) — Digital asset registry

---

## 1. Color Palette

`[Recommendation]`: Deploy a dark-mode-first palette. Dark backgrounds signal technical depth and premium positioning. Light mode should be an intentional inversion, not a default afterthought.

### Primary Palette

| Role | Color Name | Hex Code | HSL | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Background — Primary** | Obsidian | `#0A0A0F` | 240° 20% 4% | Main website background, pitch deck slides, email templates |
| **Background — Elevated** | Graphite | `#141418` | 240° 12% 8% | Cards, modals, sidebar panels, elevated surfaces |
| **Background — Surface** | Charcoal | `#1E1E24` | 240° 10% 13% | Input fields, code blocks, table rows, hover states |

### Accent Palette

| Role | Color Name | Hex Code | HSL | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Accent — Primary** | Burnished Gold | `#C9A84C` | 44° 53% 54% | Primary CTAs, logo accent, key headings, icon highlights |
| **Accent — Secondary** | Aged Bronze | `#A07D3A` | 38° 48% 43% | Secondary buttons, underlines, active nav states |
| **Accent — Highlight** | Muted Amber | `#D4A843` | 43° 62% 55% | Notification badges, pricing highlights, annotation markers |

### Text Palette

| Role | Color Name | Hex Code | HSL | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Text — Primary** | Ice White | `#F0F0F5` | 240° 20% 95% | Headings (H1, H2), hero copy, primary body text |
| **Text — Secondary** | Silver Mist | `#9B9BA8` | 240° 8% 63% | Subheadings, captions, metadata, timestamps |
| **Text — Tertiary** | Slate Grey | `#6B6B78` | 240° 7% 44% | Placeholder text, disabled states, footnotes |

### Utility Colors

| Role | Color Name | Hex Code | Usage |
| :--- | :--- | :--- | :--- |
| **Success** | Verdant | `#3ECF8E` | Confirmation states, successful form submissions |
| **Warning** | Warm Amber | `#F5A623` | Warnings, pending states, draft indicators |
| **Error** | Crimson Signal | `#E54D42` | Error states, validation failures, destructive actions |
| **Info** | Cool Sapphire | `#4A90D9` | Informational banners, help tooltips, links |
| **Border — Subtle** | Smoke | `#2A2A32` | Dividers, card borders, table lines |

### Gradient Definitions

| Gradient Name | CSS Value | Usage |
| :--- | :--- | :--- |
| **Gold Horizon** | `linear-gradient(135deg, #C9A84C 0%, #A07D3A 50%, #7A5C2E 100%)` | Hero section accent bands, CTA button backgrounds |
| **Dark Depth** | `linear-gradient(180deg, #0A0A0F 0%, #141418 50%, #1E1E24 100%)` | Full-page background gradients, section transitions |
| **Ambient Glow** | `radial-gradient(ellipse at center, rgba(201,168,76,0.08) 0%, transparent 70%)` | Subtle glow behind hero headings, featured card backgrounds |

---

## 2. Typography

`[Recommendation]`: Use Google Fonts for zero licensing friction and reliable CDN delivery. The pairing below balances modern tech-forward energy (headings) with neutral high-readability (body).

### Font Stack

| Role | Font Family | Weight(s) | Fallback Stack | Google Fonts URL |
| :--- | :--- | :--- | :--- | :--- |
| **Headings (H1-H3)** | **Outfit** | 600 (Semi-Bold), 700 (Bold) | `'Outfit', 'Sora', system-ui, -apple-system, sans-serif` | `fonts.google.com/specimen/Outfit` |
| **Subheadings (H4-H6)** | **Sora** | 500 (Medium), 600 (Semi-Bold) | `'Sora', 'Outfit', system-ui, sans-serif` | `fonts.google.com/specimen/Sora` |
| **Body Text** | **Inter** | 400 (Regular), 500 (Medium) | `'Inter', 'Roboto', system-ui, -apple-system, sans-serif` | `fonts.google.com/specimen/Inter` |
| **Monospace (Code)** | **JetBrains Mono** | 400 (Regular) | `'JetBrains Mono', 'Fira Code', 'Consolas', monospace` | `fonts.google.com/specimen/JetBrains+Mono` |

### Type Scale

| Element | Font | Size (Desktop) | Size (Mobile) | Line Height | Letter Spacing | Weight |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **H1 — Hero** | Outfit | 56px / 3.5rem | 36px / 2.25rem | 1.1 | -0.02em | 700 |
| **H2 — Section** | Outfit | 40px / 2.5rem | 28px / 1.75rem | 1.2 | -0.01em | 600 |
| **H3 — Subsection** | Outfit | 28px / 1.75rem | 22px / 1.375rem | 1.3 | 0 | 600 |
| **H4 — Card Title** | Sora | 20px / 1.25rem | 18px / 1.125rem | 1.4 | 0 | 500 |
| **Body — Large** | Inter | 18px / 1.125rem | 16px / 1rem | 1.7 | 0 | 400 |
| **Body — Regular** | Inter | 16px / 1rem | 15px / 0.9375rem | 1.7 | 0 | 400 |
| **Caption** | Inter | 13px / 0.8125rem | 12px / 0.75rem | 1.5 | 0.02em | 400 |
| **Code Inline** | JetBrains Mono | 14px / 0.875rem | 13px / 0.8125rem | 1.6 | 0 | 400 |

### Typography Rules

1.  **No all-caps headings.** Use sentence case for all titles. All-caps is reserved exclusively for micro-labels (e.g., "CASE STUDY", "TIER 1") set at 11-12px with 0.08em letter-spacing.
2.  **Maximum line width:** 72 characters for body text (approximately `max-width: 680px` at 16px). Wider text blocks degrade readability.
3.  **Paragraph spacing:** Use `margin-bottom: 1.5em` between paragraphs, not double line breaks.
4.  **Font loading strategy:** Use `font-display: swap` in all `@font-face` declarations to prevent invisible text during load (`[Recommendation]`).

---

## 3. Brand Voice

### Voice Attributes

| Attribute | Description | Example | Anti-Pattern |
| :--- | :--- | :--- | :--- |
| **Direct** | Lead with the conclusion. No hedging, no filler. | *"This automation saves 18 hours per week."* | *"We believe that potentially, this could maybe help save some time."* |
| **Analytical** | Ground claims in data, metrics, and observable outcomes. | *"The pipeline processes 200 leads/day through a 3-stage Claude filter."* | *"Our revolutionary AI solution transforms your business."* |
| **Experiential** | Draw from real projects and lived professional history. | *"When I filmed the WeWork Galaxy inaugural, I learned how spatial awareness translates directly to prompt engineering."* | *"AI is changing everything."* |
| **Calibrated** | Match confidence to evidence. Don't overclaim. | *"Based on 5 months of internal tooling at Nexocean, this workflow pattern scales reliably to teams of 10-15."* | *"Our world-class solution is trusted by thousands."* |

### Banned Language (Zero Tolerance)

`[Recommendation]`: The following words and phrases must never appear in any Kramaniti output — website copy, social posts, proposals, or AI-generated content:

| Banned Term | Reason | Acceptable Alternative |
| :--- | :--- | :--- |
| *delve* | Overused AI slop marker | *examine*, *break down*, *audit* |
| *testament* | Empty rhetorical filler | *evidence of*, *proof that* |
| *revolutionary* | Unsubstantiated hyperbole | *high-impact*, *measurably faster* |
| *pioneering* | Self-congratulatory, unverifiable | *early-adopter*, *among the first to* |
| *rapidly changing landscape* | Generic filler | Name the specific shift (e.g., *"the post-GPT-4 API economy"*) |
| *leverage* (as verb) | Overused corporate jargon | *use*, *apply*, *deploy* |
| *game-changing* | Meaningless superlative | *reduces [X] by [Y]%*, *cuts [Z] from 3 days to 40 minutes* |
| *cutting-edge* | Vague, self-congratulatory | *current-generation*, *using [specific model/tool name]* |
| *synergy* | Corporate cliché | *integration*, *combined workflow* |
| *empower* | Paternalistic, vague | *enable*, *equip*, *give [person] the ability to* |

---

## 4. Visual Style Rules

### 4.1 Photography & Video Direction

`[Recommendation]`: All visual assets should evoke the same mood — a cinematographer's precision applied to technical environments. Think the visual language of a David Fincher boardroom, not a WeWork marketing brochure.

**Mandatory Standards:**

| Rule | Description |
| :--- | :--- |
| **High Contrast, Low Key Lighting** | Default to dark environments with controlled, directional light sources. Avoid flat, evenly-lit corporate photography. |
| **Spatial Awareness** | Every frame should communicate depth — foreground/midground/background separation. Use leading lines (hallways, desk edges, screen glows) to guide the viewer's eye. |
| **Clean Negative Space** | Minimum 30% negative space in any composition. Crowded frames erode premium perception. |
| **Warm-Cool Tension** | Pair warm amber/gold accents (desk lamps, screen glows) against cool blue-grey environments. This mirrors the brand palette and creates visual tension. |
| **No Generic Stock Photography** | Zero tolerance for handshake photos, fake office scenes, diverse-people-around-laptop setups, or any Shutterstock aesthetic. Every image must be custom-shot, AI-generated with controlled parameters, or sourced from high-quality editorial archives (Unsplash editorial, not Unsplash generic). |
| **No AI Aesthetic Markers** | If using AI-generated visuals (Midjourney, Flux, DALL-E), avoid the telltale AI look — over-smoothed skin, impossible reflections, symmetrical compositions, six-finger hands. Apply grain, chromatic aberration, and lens distortion in post to break the digital sterility. |

### 4.2 Cinematographic Parameters for AI Image Generation

`[Recommendation]`: When generating brand visuals using image models, always include these prompt parameters to maintain visual consistency:

```
Lens: 35mm wide-angle (environmental shots) or 85mm portrait (founder headshots)
Lighting: Chiaroscuro / Rembrandt lighting with a single dominant key light
Color Grade: Teal and orange (complementary), desaturated by 15-20%
Depth of Field: f/1.8 - f/2.8 for portraits, f/5.6 - f/8 for environmental
Film Grain: Subtle, ISO 800 equivalent
Aspect Ratio: 16:9 (website hero), 1:1 (social cards), 9:16 (reels/stories)
```

### 4.3 Iconography & Illustrations

| Rule | Description |
| :--- | :--- |
| **Style** | Line icons only. 1.5px stroke weight, rounded caps and joins. Consistent with the Inter/Outfit geometric aesthetic. |
| **Color** | Icons use `Silver Mist (#9B9BA8)` by default. Active/hover states transition to `Burnished Gold (#C9A84C)`. |
| **Source** | Prefer Lucide Icons (open-source, consistent geometry) or Phosphor Icons. Avoid Font Awesome (overused, inconsistent weights). |
| **No 3D Icons** | Flat or line-only. No gradients, shadows, or skeuomorphic icons. |

### 4.4 Logo Usage Rules

| Rule | Specification |
| :--- | :--- |
| **Primary Logo** | Logotype (wordmark) only. "KRAMANITI" set in Outfit 700, letter-spacing 0.06em, `Ice White (#F0F0F5)` on dark backgrounds. |
| **Logo Accent** | The "K" in KRAMANITI may be rendered in `Burnished Gold (#C9A84C)` as a subtle brand accent. The remainder stays in Ice White. |
| **Clear Space** | Minimum clear space around the logo = 1× the height of the letter "K" on all sides. |
| **Minimum Size** | 120px width for digital; 30mm for print. |
| **Dark Background** | Ice White logotype + optional Gold "K" accent. |
| **Light Background** | Obsidian `(#0A0A0F)` logotype + optional Bronze "K" accent `(#A07D3A)`. |
| **Forbidden Modifications** | No rotation, no drop shadows, no outline strokes, no gradient fills, no background shapes behind the logotype. |

---

## 5. Component Patterns

`[Recommendation]`: For the website and all digital touchpoints, enforce these component-level design patterns:

### Buttons

| Variant | Background | Text | Border | Border Radius | Padding |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Primary CTA** | `Gold Horizon` gradient | `Obsidian (#0A0A0F)` | None | 8px | 14px 28px |
| **Secondary** | Transparent | `Ice White (#F0F0F5)` | 1px `Smoke (#2A2A32)` | 8px | 12px 24px |
| **Ghost** | Transparent | `Silver Mist (#9B9BA8)` | None | 8px | 12px 24px |

### Cards

```
Background: Graphite (#141418)
Border: 1px solid Smoke (#2A2A32)
Border Radius: 12px
Padding: 24px
Box Shadow: 0 4px 24px rgba(0,0,0,0.3)
Hover: border-color transitions to Burnished Gold (#C9A84C) over 300ms ease
```

### Micro-Animations

| Interaction | Animation | Duration | Easing |
| :--- | :--- | :--- | :--- |
| **Button hover** | Background shifts from gradient to solid `Burnished Gold`, scale 1.02 | 200ms | ease-out |
| **Card hover** | Border color → Gold, subtle translateY(-2px) lift | 300ms | ease-in-out |
| **Section reveal** | Fade in + translateY(20px → 0px) on scroll intersection | 600ms | cubic-bezier(0.25, 0.46, 0.45, 0.94) |
| **Page transition** | Opacity crossfade | 400ms | ease |
| **Loading state** | Pulsing `Ambient Glow` gradient animation | 1500ms | infinite ease-in-out |

---

## 6. Application Matrix

| Touchpoint | Applies From This Guide |
| :--- | :--- |
| **Website** (kramaniti.com) | Full palette, typography, components, animations, visual style |
| **Pitch Decks** (Google Slides / Keynote) | Palette, typography (Outfit + Inter), logo rules, photography standards |
| **Social Media Assets** | Palette, typography, photography standards, banned language |
| **Invoices & Proposals** | Palette (simplified: Obsidian bg, Gold accents, Ice White text), logo, Inter body font |
| **Email Templates** | Palette (constrained: system fonts fallback to Arial/Helvetica), logo, voice rules |
| **YouTube Thumbnails** | Photography standards, Outfit headings, high-contrast requirements |
| **Calendly / Booking Pages** | Palette colors applied to Calendly's custom branding fields |

---

## 7. Open Questions

1.  `[Recommendation]`: Should the brand explore a monogram or icon mark (e.g., a stylized "K" glyph) for favicon, app icon, and social avatar use cases where the full logotype is too long? This would need to be designed and approved separately.
2.  `[Recommendation]`: Should the Gold accent color shift slightly warmer (toward `#D4A843` Muted Amber) for Indian market materials to resonate with cultural associations of gold/saffron, while keeping the cooler Bronze for international-facing assets?
