# Visual System Palette

**Purpose:** Capture the live website design language as a reusable brand palette for future pages, features, decks, and marketing assets.

**Key Findings:** The current system is not just a color palette. It is a combined visual grammar made of dark-first surfaces, burnished-gold accents, soft glass panels, oversized atmospheric words, thin orbital lines, and a premium editorial type system.

**Evidence:** The implementation is currently expressed in the website styles and components under [website/src/app/globals.css](file:///Users/k.c/kramaniti/website/src/app/globals.css), [Hero.module.css](file:///Users/k.c/kramaniti/website/src/components/sections/Hero.module.css), [Services.module.css](file:///Users/k.c/kramaniti/website/src/components/sections/Services.module.css), [Credibility.module.css](file:///Users/k.c/kramaniti/website/src/components/sections/Credibility.module.css), [Workflows.module.css](file:///Users/k.c/kramaniti/website/src/components/sections/Workflows.module.css), [Story.module.css](file:///Users/k.c/kramaniti/website/src/components/sections/Story.module.css), [Contact.module.css](file:///Users/k.c/kramaniti/website/src/components/sections/Contact.module.css), [Button.module.css](file:///Users/k.c/kramaniti/website/src/components/ui/Button.module.css), and [Card.module.css](file:///Users/k.c/kramaniti/website/src/components/ui/Card.module.css).

**Interpretation:** The design should be reused as a system, not as a one-off homepage treatment. Future pages should borrow the same colors, motion, depth, typography, and section atmospheres, while allowing each page to choose its own emphasis word and layout.

**Implications:** New pages should default to the same premium dark editorial language, then adapt light mode and local composition only where needed. Avoid generic UI patterns that break the visual continuity.

**Open Questions:** Whether a lighter or more minimal sister palette should be introduced later for transactional pages like invoices, forms, or dashboards.

**Next Steps:** Use this document as the source of truth when building new pages, sections, social templates, and pitch materials.

---

## 1. Design Principles

1. Dark-first by default.
1. Gold is the primary accent, not a decorative afterthought.
1. Glass surfaces should feel soft, not shiny or futuristic in a loud way.
1. Motion should be slow, scroll-linked, and atmospheric.
1. Copy blocks should feel editorial and centered when used as lead content.
1. Large background words should reinforce the section meaning, not compete with it.

---

## 2. Core Palette

### Base Surfaces

| Token | Hex | Use |
| --- | --- | --- |
| `Obsidian` | `#0A0A0F` | Primary dark background |
| `Graphite` | `#141418` | Elevated panels, card bodies |
| `Charcoal` | `#1E1E24` | Surfaces, inputs, hover layers |

### Accent Colors

| Token | Hex | Use |
| --- | --- | --- |
| `Burnished Gold` | `#C9A84C` | Primary highlight, CTAs, lines, emphasis words |
| `Aged Bronze` | `#A07D3A` | Secondary accent, hover depth, gradient support |
| `Muted Amber` | `#D4A843` | Warm highlight, badges, subtle emphasis |

### Text Colors

| Token | Hex | Use |
| --- | --- | --- |
| `Ice White` | `#F0F0F5` | Headings, primary copy on dark backgrounds |
| `Silver Mist` | `#9B9BA8` | Supporting text, metadata, captions |
| `Slate Grey` | `#6B6B78` | Tertiary text, placeholders, muted labels |

### Utility Colors

| Token | Hex | Use |
| --- | --- | --- |
| `Smoke` | `#2A2A32` | Borders, dividers, subtle UI lines |
| `Success` | `#3ECF8E` | Success states |
| `Warning` | `#F5A623` | Caution states |
| `Error` | `#E54D42` | Error states |
| `Info` | `#4A90D9` | Informational states |

---

## 3. Gradients And Atmospherics

| Token | CSS Value | Use |
| --- | --- | --- |
| `Gold Horizon` | `linear-gradient(135deg, #C9A84C 0%, #A07D3A 50%, #7A5C2E 100%)` | Premium CTA and highlight bands |
| `Dark Depth` | `linear-gradient(180deg, #0A0A0F 0%, #141418 50%, #1E1E24 100%)` | Hero background and dark section transitions |
| `Ambient Glow` | `radial-gradient(ellipse at center, rgba(201,168,76,0.08) 0%, transparent 70%)` | Soft atmosphere behind copy or cards |

Additional atmospheric motifs currently used on the site:
- oversized line-based words in the background
- thin gold horizontal and vertical lines
- soft circular glow orbs
- subtle scanline sweeps
- low-contrast grid overlays

These should be treated as a reusable motif set for future sections.

---

## 4. Typography System

### Font Pairing

| Role | Font | Use |
| --- | --- | --- |
| Headings | `Outfit` | Hero titles, section titles, oversized background words |
| Subheads / Card Titles | `Sora` | Medium-weight supporting titles |
| Body | `Inter` | Paragraphs, descriptions, form labels, captions |
| Mono | `JetBrains Mono` | Numeric markers, stage numbers, code-like chips |

### Type Behavior

| Element | Style |
| --- | --- |
| Hero headings | Large, tight, editorial, usually centered |
| Section lead lines | Inter, centered, medium size, max width around 680px |
| Card copy | Inter caption sizing, more compact and practical |
| Micro labels | Uppercase, letter-spaced, 11-12px |
| Background words | Outfit, huge scale, transparent fill with gold stroke |

### Typography Rule

If a line sits directly under a section title and describes the section, it should use the same `Inter` body treatment and centered alignment unless the section is intentionally layout-led.

---

## 5. Surface Language

### Cards

- Rounded corners, generally `18px` to `28px`
- Glass or elevated fill
- Soft shadows rather than hard shadows
- Gold border or glow only on hover or focus
- Content density should be moderate, not cramped

### Buttons

- Pill-shaped
- Transparent or glassy at rest
- Gold glow on hover
- Dark mode and light mode should both feel dimensional
- Primary actions should remain visually strong without becoming loud

### Inputs

- Soft glass enclosure when grouped
- Clear padding and breathing room
- Rounded corners that match buttons and cards
- Light mode should still have depth through shadow, not just border

---

## 6. Motion System

### Motion Principles

1. Motion should guide attention, not decorate empty space.
1. Use slow parallax and ambient drift, not fast animation.
1. Text should fade and settle into place rather than snap in.
1. Scroll response should be visible but restrained.

### Current Motion Vocabulary

| Pattern | Use |
| --- | --- |
| Soft intro reveal | Hero titles and section copy |
| Scroll-linked parallax | Background words, rings, and line motifs |
| Hover lift | Cards and buttons |
| Light pulse | Markers, glows, and section accents |
| Rail sweep | Story and workflow line treatments |

### Reduced Motion

If `prefers-reduced-motion` is enabled, the layout should stay fully legible and static without breaking hierarchy.

---

## 7. Section Template

Use this as the default structure for future page sections:

1. Small label or eyebrow
1. Main title
1. One centered lead line
1. One atmosphere layer behind content
1. One primary content block or card system

Recommended section roles:
- Hero
- Services / Offer Ladder
- Proof / Credibility
- Story / Origin System
- Delivery / Workflow
- Contact / Conversion

---

## 8. Reusable Background Words

The oversized words now serve as section anchors. New pages should choose only one or two words per section.

Examples:
- `Offer`
- `Proof`
- `Flow`
- `Connect`
- `Capture`
- `Build`
- `Run`
- `Trust`
- `Start`

Rules:
- Keep them short.
- Keep them semantically tied to the section.
- Use them as background atmosphere only, not as readable headlines.

---

## 9. Recommended CSS Tokens

If the system is extended, keep these as shared variables:

| Token | Recommended Value |
| --- | --- |
| Section padding | `120px 0` |
| Container width | `1200px` max |
| Card radius | `18px` to `28px` |
| Pill radius | `999px` |
| Border strength | `1px` subtle, `2px` for emphasis |
| Shadow depth | `0 16px 36px rgba(0,0,0,0.12)` baseline |
| Lead line width | `max-width: 680px` |
| Gold opacity for atmospherics | `0.08` to `0.34` |

---

## 10. What To Keep Consistent

- Dark-first visual mood
- Gold as the primary accent
- Centered lead copy
- Premium glass card surfaces
- Editorial typography
- Section-specific atmosphere words
- Soft motion and scroll response

---

## 11. What To Avoid

- Generic white SaaS layouts
- Flat rectangular buttons
- Neon gradients
- Busy particle systems
- Too many competing highlights
- Mixed font treatment inside lead section copy
- Full-width paragraphs without a max line length

