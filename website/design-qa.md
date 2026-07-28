# Thinking Orbs Integration - Design QA

## Comparison target

- Source visual truth: `tmp/orbs-reference/source-desktop-listening-playground.png`
- Rendered implementation: `tmp/orbs-implementation/desktop-open-listening-dark.png`
- Full-view comparison: `tmp/orbs-implementation/qa-full-comparison.png`
- Focused orb comparison: `tmp/orbs-implementation/qa-orb-focused-comparison.png`
- Desktop viewport and CSS size: 1440 x 900
- Mobile viewport and CSS size: 390 x 844
- Source pixels: 1440 x 900
- Desktop implementation pixels: 1440 x 900
- Mobile implementation pixels: 390 x 844
- Device pixel ratio: 1
- Density normalization: none required
- Compared state: dark theme, `listening`, 64px preset

The source page itself was not the implementation target. The target was its complete six-state orb component set inside the existing Kramaniti assistant and the homepage moments where those states reinforce the narrative.

## Browser evidence

- Desktop launcher, dialog, light theme, and dark theme were rendered in the in-app browser.
- The 390 x 844 mobile dialog settled at x=8, y=104, width=374, height=726, right=382, and bottom=830, with no viewport overflow.
- The launcher opened the assistant, the close control dismissed it, the starter prompt submitted, and the local assistant returned a response.
- The rendered status system covered `shaping`, `listening`, `searching`, `working`, `solving`, and `composing`.
- The motion-heavy `/KCS` route exposed `data-assistant-mode="passive"` and its closed 64px canvas stayed pixel-identical across two captures 500ms apart.
- Console errors and warnings checked: none.

## Required fidelity surfaces

### Fonts and typography

Passed. The orb has no embedded type. Kramaniti's existing Outfit-led assistant typography remains intact, and the added status line uses the existing weight, spacing, and gold/neutral hierarchy.

### Spacing and layout rhythm

Passed. The source 64px and 20px tuned presets are used without scaling on desktop. The 64px header orb sits inside a restrained 66px Kramaniti shell. Mobile keeps the dialog inside the 390 x 844 viewport and applies one uniform 0.82 visual scale to the 64px header canvas so the tuned geometry remains intact without crowding the controls.

### Colors and visual tokens

Passed. The source animation geometry remains unchanged, while a shared presentation layer recolors the monochrome canvas to Kramaniti burnished gold. The treatment uses brighter gold in dark mode and a deeper gold in light mode, with restrained light bloom around 64px orbs. Automatic theme switching was verified in both modes.

### Image quality and asset fidelity

Passed. The implementation uses the official `thinking-orbs` canvas component rather than a CSS, SVG, or raster approximation. The focused comparison shows the same listening-orb geometry and dot treatment. Canvas device density remains capped by the source component.

### Copy and content

Passed. Existing public assistant copy and service claims were not changed. The only added text is factual UI status language tied to the active orb state.

## Findings

No actionable P0, P1, or P2 differences remain.

The Kramaniti gold treatment, frame, and status label are intentional product-context additions. They recolor the rendered orb pixels but do not alter the source animation geometry or timing.

## Comparison history

1. Initial integration replaced the liquid launcher and three-dot loader with the official orb component.
2. Light and dark theme wrappers were adjusted so the monochrome canvas retained contrast on both site themes.
3. Mobile header scaling and passive KCS behavior were verified after the desktop pass.
4. The focused side-by-side comparison confirmed asset fidelity after those adjustments.
5. The full homepage was audited at 1440 x 900 and 390 x 844 before adding homepage placements.
6. The diagnostic map, three-part method, and process summary were re-captured in light and dark modes after the gold treatment.

## Homepage audit and placement map

### Scope

- Surface: public homepage.
- User goal: understand what Kramaniti diagnoses, how it works, and how an engagement moves from input to output.
- Accessibility target: decorative motion must not replace text, create overflow, or ignore reduced-motion preferences.

### Evidence

- Desktop hero before: `tmp/orb-homepage-audit/01-home-desktop-before.png`
- Mobile hero before: `tmp/orb-homepage-audit/02-home-mobile-before.png`
- Method before: `tmp/orb-homepage-audit/03-method-desktop-before.png`
- Process before: `tmp/orb-homepage-audit/04-process-desktop-before.png`
- Desktop diagnostic map after: `tmp/orb-homepage-audit/06-problem-desktop-after.png`
- Desktop method after: `tmp/orb-homepage-audit/07-method-desktop-after.png`
- Desktop process after: `tmp/orb-homepage-audit/08-process-desktop-after.png`
- Mobile diagnostic map after: `tmp/orb-homepage-audit/09-problem-mobile-after.png`
- Mobile method rows after: `tmp/orb-homepage-audit/11-method-rows-mobile-after.png`
- Mobile process after: `tmp/orb-homepage-audit/12-process-mobile-after.png`
- Mobile dark process after: `tmp/orb-homepage-audit/13-process-mobile-dark-after.png`
- Mobile dark assistant after: `tmp/orb-homepage-audit/14-assistant-mobile-dark-after.png`

### Findings and decisions

1. Diagnostic map — healthy. The existing divergence diagram clearly shows symptoms but had a visually generic origin. A 64px `searching` orb now marks the point where Kramaniti looks for workflow friction.
2. Method — healthy. The three-layer structure was already clear and visually restrained. Compact `shaping`, `working`, and `composing` orbs now reinforce Strategy, Systems, and Communication without replacing their labels.
3. Process summary — healthy. Input, Process, and Output are the most concise place to explain state progression. `listening`, `solving`, and `composing` now make that progression visible before the detailed steps.
4. Hero and services — intentionally unchanged. Adding orbs there would compete with the primary audit CTA and service decision hierarchy.

### Accessibility evidence and limits

- The homepage orbs are decorative and hidden from assistive technology because the adjacent text already communicates the meaning.
- Every homepage orb pauses when its section is outside the intersection state; the source component also pauses when offscreen or when the tab is hidden.
- No horizontal overflow was present at 1440px or 390px.
- Reduced-motion behavior is supported by the source component and the site stylesheet.
- Screenshot review cannot prove full keyboard, screen-reader, zoom, or WCAG compliance; those require dedicated interaction and assistive-technology testing.

## Implementation checklist

- [x] Six orb states wired to meaningful assistant states
- [x] Six orb states mapped to meaningful homepage moments
- [x] Shared burnished-gold treatment in light and dark themes
- [x] 64px launcher and header variants
- [x] 20px inline response-status variant
- [x] Light and dark themes
- [x] Reduced-motion behavior
- [x] Passive KCS closed state
- [x] Desktop and mobile browser checks
- [x] No console errors
- [x] Lint, TypeScript, and production build passed

## Follow-up polish

No P3 follow-up is required before review.

final result: passed
