# KCS - Kramaniti Content Studio

## Metadata

- **Purpose:** Define how Kramaniti agents and the founder should use KCS for chat-first infographic-video planning and local scene rendering.
- **Key Findings:** [Fact] The active KCS implementation lives inside the website app at `website/src/app/KCS/`.
- **Evidence:** [Fact] KCS renders approved scene sequences from `website/src/lib/KCS/sceneSequence.ts`.
- **Interpretation:** [Fact] KCS is a browser scene-output surface; planning happens in Codex chat through the reusable skill.
- **Implications:** [Recommendation] Do not use the older `/design-studio` prototype for KCS work.
- **Open Questions:** [Recommendation] Decide later whether automated MP4 export should use browser frame capture plus `ffmpeg`, Playwright capture plus `ffmpeg`, or a dedicated rendering library.
- **Next Steps:** [Recommendation] Add a fixed-FPS capture pipeline after the approved-scene renderer stabilizes.

## Lead And Supporting Agents

- **Lead agent:** Digital Presence Orchestrator.
- **Supporting agents:** Website Steward, Brand Identity Agent, Content Director, Proof and Governance Auditor.

## Route

[Fact] Local preview route:

```text
http://localhost:3000/KCS
```

[Fact] Source files:

- `website/src/app/KCS/page.tsx`
- `website/src/components/KCS/KcsWorkbench.tsx`
- `website/src/components/KCS/KcsWorkbench.module.css`
- `website/src/lib/KCS/sceneSequence.ts`

## Operating Model

[Recommendation] Treat KCS as an IDE-assisted content rendering workflow.

1. The founder opens Codex in this repository and says `Design`.
2. The founder provides the idea, message, reel topic, script, or content direction.
3. The agent reads the brand/context documentation and drafts a scene-by-scene strategy in Codex chat.
4. The founder approves or revises the scene plan in chat.
5. After approval, the agent updates the KCS renderer with the approved sequence.
6. The founder previews the local `/KCS` route and records the output until automated MP4 export exists.

The KCS browser page should not show briefing forms, strategy notes, scene-planning cards, implementation checklists, copied IDE prompts, or capture instructions. It should show only the rendered motion-graphic scene output with minimal playback/navigation controls.

## Skill

[Fact] The reusable Codex skill is installed at:

```text
/Users/karanchordia/.codex/skills/kramaniti-content-studio
```

[Recommendation] Use `$kramaniti-content-studio` whenever the founder provides an idea for a Kramaniti infographic video. The skill requires the agent to understand the video query, build a scene-by-scene strategy, and choose diverse premium visual grammar based on the idea instead of repeating one template.

[Recommendation] The skill must ask for explicit approval before writing scene code unless the founder already gave clear approval to proceed.

## Visual Grammar

[Recommendation] KCS should choose visual forms based on communication need:

- Contradiction split
- Workflow route map
- Signal extraction
- Operating loop
- Layered system
- Decision gates
- Architecture shift
- Narrative timeline
- Claim ladder
- Constellation map

[Recommendation] The renderer should behave like a motion-graphic composition, not like a slideshow:

- full-scene composition first, not a left-copy/right-diagram presentation split
- text enters after structure is visible
- one continuity system should connect scenes so the output feels like a single video
- infographic layers should borrow the homepage language of `The Problem`, `The Method`, and the desktop hero stack without reusing their exact copy or diagram
- controls should stay minimal and secondary to the rendered sequence

## Scene Authoring Rules

- [Recommendation] Start from the belief shift, not the animation.
- [Recommendation] Keep scenes short enough for video.
- [Recommendation] Make every scene visually distinct when the query allows it.
- [Recommendation] Connect scenes through recurring motion lines, routes, pulses, orbit beams, or spatial handoffs so the sequence feels like one video.
- [Recommendation] Use Kramaniti language: strategy, systems, workflows, infrastructure, clarity, brand growth, practical AI, operating pipeline, cinematic content, connected growth system.
- [Recommendation] Avoid generic AI agency language such as "unlock the future," "revolutionary AI," "automate everything," or "agentic everything."
- [Fact] Do not invent client names, logos, testimonials, outcomes, or metrics.

## Checks

[Fact] For code changes in this tool, run:

```bash
cd website
npm run lint
npx tsc --noEmit
npm run build
```

[Recommendation] After checks pass, verify `/KCS` in the browser at desktop and mobile widths.
