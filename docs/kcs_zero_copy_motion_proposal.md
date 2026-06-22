# KCS Zero-Copy Motion Proposal

## Metadata

- **Purpose:** Propose the next KCS video direction after the current render started feeling visually busy and copy-heavy.
- **Status:** `[Recommendation]` Pending founder approval before KCS renderer changes.
- **Lead agent:** Digital Presence Orchestrator.
- **Supporting agents:** Website Steward, Brand Identity Agent, Content Director, Proof and Governance Auditor.
- **Related files:** `docs/kcs_content_studio.md`, `website/src/components/KCS/KcsWorkbench.tsx`, `website/src/lib/KCS/sceneSequence.ts`, `website/src/components/assistant/KramanitiAssistant.tsx`.

## Diagnosis

[Fact] The current KCS render uses a headline, supporting line, beat list, visual labels, atmospheric words, captions, flow lines, scene transitions, and playback controls at the same time.

[Inference] On desktop this reads as premium but dense. On mobile, the global assistant launcher adds another animated layer on top of an already motion-heavy video surface.

[Recommendation] The next KCS direction should move from "infographic scene with copy" to "cinematic system animation with almost no on-screen copy."

## Creative Direction

Working direction: **Silent operating pipeline.**

The video should feel like a CEO-level strategic idea made visible through motion, not like a slide sequence. The copy should live outside the animation as narration, caption, or post text. The rendered scene should carry the idea through structure, pacing, and interaction.

## On-Screen Rules

- No headline block.
- No supporting paragraph.
- No bullet or beat list.
- No visible planning notes, prompts, forms, or implementation copy.
- Keep only essential brand anchors: Kramaniti mark, scene number if needed, and minimal abstract labels only when comprehension breaks without them.
- Use motion pauses so the viewer can understand the system without reading.

## Proposed Scene Sequence

1. **Scattered field**
   - Role: show too many disconnected efforts.
   - Visual: small graphite nodes drifting on separate paths.
   - Motion: paths move independently, then slow down.
   - Transition: one gold pulse identifies the first point of clarity.

2. **Signal lock**
   - Role: show the CEO-level message becoming sharper.
   - Visual: weak lines collapse into one route.
   - Motion: silver noise fades; gold route stays.
   - Transition: route becomes a spine for the next scene.

3. **Decision gates**
   - Role: show that not everything should be automated.
   - Visual: three gates: human-led, AI-assisted, automated.
   - Motion: each input chooses a gate; rejected routes dim.
   - Transition: approved paths merge into one operating line.

4. **Connected growth system**
   - Role: show strategy, systems, and content working together.
   - Visual: three stacked layers connected by vertical handoffs.
   - Motion: movement begins in strategy, passes through systems, then outputs into content.
   - Transition: the layers rotate into a single loop.

5. **Repeatable rhythm**
   - Role: close with the brand promise.
   - Visual: one calm loop with a Kramaniti gold pulse.
   - Motion: the loop completes once, then holds.
   - Transition: final frame stays quiet for screen recording or export.

## Interaction Proposal

[Recommendation] Keep interaction passive by default. The video should autoplay as a finished motion piece, but the viewer can tap once to pause or scrub scenes. Avoid hover-only behavior because mobile review matters.

Optional later interaction:

- Drag across the route to scrub the gold signal.
- Tap a gate to isolate human-led, AI-assisted, or automated work.
- Press-and-hold to freeze a final poster frame.

## Mobile Performance Proposal

[Recommendation] On mobile, KCS should use a lower-motion profile:

- Freeze atmospheric background words.
- Reduce simultaneous line sweeps.
- Avoid blur-heavy overlays.
- Keep the assistant launcher in passive mode while the video route is active.
- Use one active route animation at a time instead of many independent infinite loops.

## Approval Gate

If approved, implement in two passes:

1. Convert the global assistant launcher to passive behavior on the KCS route and mobile.
2. Redesign the KCS renderer into a zero-copy motion mode by removing the current copy block and rebuilding scenes around the five-part visual sequence above.
