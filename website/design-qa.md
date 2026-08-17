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

historical result: passed

---

# Spatial Experience - Design QA

## Comparison target

- Source visual truth: `design-references/kramaniti-signal-corridor-selected.png`
- Threshold implementation: `tmp/experience-qa/final-threshold-1440x900.png`
- Services implementation: `tmp/experience-qa/final-services-1440x900.png`
- Insights implementation: `tmp/experience-qa/final-insights-1440x900.png`
- Audit implementation: `tmp/experience-qa/final-audit-1440x900.png`
- Mobile implementation: `tmp/experience-qa/final-mobile-threshold-390x844.png`, `tmp/experience-qa/final-mobile-services-390x844.png`, `tmp/experience-qa/final-mobile-insights-390x844.png`, and `tmp/experience-qa/final-mobile-audit-390x844.png`
- Full-view comparison: `tmp/experience-qa/final-full-comparison.png`
- Focused Insights comparison: `tmp/experience-qa/final-insights-comparison.png`
- Desktop viewport and CSS size: 1440 x 900
- Mobile viewport and CSS size: 390 x 844
- Source pixels: 866 x 1817
- Desktop implementation pixels: 1440 x 900 per chapter capture
- Mobile implementation pixels: 390 x 844 per capture
- Device pixel ratio: 1 for final desktop and mobile captures
- Density normalization: the source was proportionally fitted into an 866 x 1800 comparison column; four 1440 x 900 implementation captures were proportionally reduced to 720 x 450 and stacked. The focused comparison crops the source Insights region and normalizes both sides to 720px high.
- Compared state: dark theme, journey entered, first service/insight in focus, and final audit handoff

## Browser evidence

- The entry form accepted optional name and intent values, mounted the journey without account creation, and moved to Services.
- The skip path entered the same journey without personalisation.
- The continuous journey signal changed from 24.24% to 35.80% during a mobile Services scroll and reached 98.24% at the desktop audit handoff.
- Mobile Services advanced from Foundation Strategy to Systems Engineering from normal scroll position; the previous node changed to Complete and the current node changed to In focus.
- Mobile Insights advanced from the second article to the third article during normal scroll, while direct button selection remained functional.
- The Services and Insights buttons also responded to direct click/focus/pointer input and exposed `aria-pressed` state.
- The AI Workflow Audit CTA resolves to `/#contact`; the information-led website and Insights library remain directly available.
- No horizontal overflow was present at 1440px or 390px.
- Browser console errors and warnings checked: none.

## Required fidelity surfaces

### Fonts and typography

Passed. The implementation preserves the Outfit display hierarchy and JetBrains Mono coordinate/state treatment. The larger responsive headings retain the source's assertive scale without truncation; body copy remains readable and consistently weighted on desktop and mobile.

### Spacing and layout rhythm

Passed. The source's left narrative/right system composition is retained at desktop. Mobile deliberately becomes a sequential editorial flow: section premise, spatial system, then operable steps. Section height is longer than the compressed concept board because the implementation keeps service explanations and touch targets readable rather than shrinking them to presentation scale.

### Colors and visual tokens

Passed. Obsidian, graphite, restrained burnished gold, ice-white text, dormant grey, and semantic glow states map closely to the source. Only active, handoff, and complete states receive gold illumination; unrelated rails and nodes stay dim.

### Image quality and asset fidelity

Passed. The official Kramaniti gold mark is used for visible brand assets. The rail, node, orbit, and grid geometry are functional interface structures whose states are controlled by form, focus, click, touch, and scroll behavior; they are not replacements for missing source imagery.

### Copy and content

Passed. The route uses proof-safe service language and real current Insights titles. It explicitly states that no account is created and does not invent clients, outcomes, metrics, or testimonials.

### Behavior, responsiveness, and accessibility

Passed. Native inputs, buttons, and links remain the interaction layer. The continuous rail is requestAnimationFrame-throttled and does not intercept normal scrolling. Text labels, a visible signal-state key, an assistive live chapter announcement, focus treatment, touch-safe controls, and `prefers-reduced-motion` fallbacks preserve meaning without relying on motion alone. A dedicated screen-reader session and OS-level reduced-motion emulation remain manual test coverage rather than visual-QA blockers.

## Findings

No actionable P0, P1, or P2 differences remain.

The implementation intentionally uses a responsive straight journey rail instead of reproducing every elbow from the concept board. The local service, constellation, and audit structures retain the brand-book right-angle, orbit, and evidence logic while the continuous rail remains legible across desktop and mobile.

## Comparison history

1. [P2] A dormant Insights signal was visually selectable but sat beneath the article hit area. The constellation coordinates and line geometry were separated from the reading panel. Post-fix evidence: `final-insights-1440x900.png`; all three signal buttons update `aria-pressed` and article content.
2. [P2] The first active signal label collided with the mobile article eyebrow. Mobile node positions and line angles were recomposed, and redundant tiny node labels were removed at the smallest breakpoint while accessible button names remained. Post-fix evidence: `final-mobile-insights-390x844.png`.
3. [P2] The first implementation read as composed static sections rather than a connected operating system. The discrete chapter jump was replaced with a continuous scroll-linked rail, scroll-resolved Services and Insights focus, local orbit/constellation/ring depth, a visible state key, and text-equivalent state announcements. Post-fix evidence: `final-full-comparison.png`, `final-mobile-services-390x844.png`, and `final-mobile-insights-390x844.png`.
4. The post-fix full and focused comparisons show no remaining collision, clipping, hierarchy, asset, token, or copy mismatch at P2 or above.

## Implementation checklist

- [x] Continuous scroll-linked signal rail and chapter label
- [x] Shared Dormant/Input/Handoff/Focus/Complete protocol
- [x] Scroll, pointer, touch, keyboard-focus, and click state paths
- [x] Stateful Services architecture and Insights evidence field
- [x] Visible state key and assistive chapter announcement
- [x] Reduced-motion fallback in CSS and interaction timing
- [x] 1440 x 900 desktop and 390 x 844 mobile browser checks
- [x] Source-plus-implementation full and focused comparisons
- [x] No horizontal overflow or console errors
- [x] Lint, TypeScript, production build, and diff checks passed

## Follow-up polish

No P3 refinement is required before KC's next visual review.

historical result: passed

---

# Evidence Relay and Adaptive Section Focus - Design QA

## Comparison target

- Selected source: `design-references/kramaniti-insights-evidence-relay-selected.png`
- Desktop implementation: `tmp/experience-qa/evidence-relay-desktop-1440x900.png`
- Mobile implementation: `tmp/experience-qa/evidence-relay-mobile-390x844.png`
- Source-plus-implementation comparison: `tmp/experience-qa/evidence-relay-comparison.png`
- Compared state: dark theme, journey entered, Insights in focus, with completed, active, and dormant evidence thresholds visible

## Browser evidence

- Normal scroll advanced the relay from the first to the second and third Insights without intercepting page scrolling.
- Direct pointer, focus, and click paths remained available through the same three native threshold buttons with accurate `aria-pressed` state.
- The active section exposed continuously changing opacity, brightness, and glow values derived from the traveller's distance; preceding and following sections returned to readable dormant values.
- The strengthened desktop Services focus reached 0.871 signal focus, 0.910 opacity, 1.142 brightness, and 1.078 saturation while untouched dormant sections held 0.300 opacity and 0.480 brightness.
- The mobile focus crest reached 0.940 signal focus, 0.958 opacity, 1.194 brightness, and 1.111 saturation without clipping or horizontal overflow.
- The public-header `EXP` control remained visible at 1440 x 900 and 390 x 844, exposed the accessible name “Open the Kramaniti spatial experience,” and navigated to `/experience`.
- At 1440 x 900 the premise, relay, and focused article form one left-to-right reading sequence with no horizontal overflow.
- At 390 x 844 the composition becomes one vertical evidence line followed by the focused article, also with no horizontal overflow.

## Required fidelity surfaces

### Typography, spacing, and layout rhythm

Passed. The implementation keeps the selected reference's large editorial premise, mono coordinate language, narrow central relay, and single focused reading panel. The compact breakpoint preserves the same hierarchy as a vertical sequence instead of shrinking the desktop spatial composition.

### Colors and semantic states

Passed. Gold is reserved for the active traveller, completed thresholds, focused threshold, progress segment, and active-section glow. Dormant thresholds remain graphite-grey. Section intensity rises and falls continuously with scroll proximity rather than switching as an unrelated entrance effect.

### Copy and content

Passed. The relay uses current public Insights titles and proof-safe summaries. No client proof, result, metric, or testimonial was added.

### Behavior, responsiveness, and accessibility

Passed. The implementation uses native buttons and links, visible focus treatment, textual status labels, `aria-pressed`, `aria-live`, touch-safe mobile flow, requestAnimationFrame-throttled scroll handling, and reduced-motion fallbacks. Motion does not hide required content or become the only state indicator.

## Findings and iteration history

1. [P2] The initial stage positioning used arithmetic inside a CSS custom-property expression, which is not consistently supported across browsers. Each threshold now receives an explicit percentage position from React.
2. [P2] The desktop relay needed to align with the continuous journey rail without causing mobile overlap. Desktop keeps the evidence rail on the central axis; mobile collapses both systems onto the same left rail and moves labels to the readable side.
3. [P2] Static section illumination did not express the requested relationship between traveller and content. Each section now derives brightness, opacity, glow, progress, and before/active/after phase from the traveller's live scroll position.
4. [P2] The global traveller's text label could collide with the active evidence-threshold label on the narrow breakpoint. The redundant traveller label is now suppressed only while mobile Insights is active; the live-region announcement and visible evidence labels preserve the same information.
5. [P2] The first adaptive pass changed section values correctly but the visible difference between a near-focus and full-focus state remained too quiet. The range now runs from a 0.300-opacity, 0.480-brightness dormant state to a warm-white crest above 1.14 brightness, with saturation and local gold haze rising from the same scroll-derived focus value.
6. [P2] The route was technically available but not intentionally presented as a distinct public entry. A compact `EXP` link now sits beside the audit CTA on desktop and beside the menu control on mobile, with its full destination exposed to assistive technology.
7. The post-fix desktop and mobile checks show no remaining collision, clipping, overflow, hierarchy, token, or interaction mismatch at P2 or above.

## Implementation checklist

- [x] Selected evidence-relay visual implemented
- [x] Continuous adaptive section brightness and glow
- [x] Prominent dormant-to-focus luminance range driven by one scroll value
- [x] Scroll, pointer, focus, touch, and click state paths
- [x] Three labelled evidence thresholds with focused article
- [x] Desktop and mobile responsive composition
- [x] Text-equivalent signal states and reduced-motion fallback
- [x] Source-plus-implementation comparison
- [x] Accessible public-header `EXP` entry at desktop and mobile widths
- [x] No horizontal overflow
- [x] Lint, TypeScript, production build, and diff checks passed

## Follow-up polish

No P3 refinement is required before KC's visual review.

final result: passed
