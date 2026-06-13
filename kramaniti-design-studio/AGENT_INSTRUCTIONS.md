# Kramaniti Design Studio - Agent Instructions

If the user has provided the prompt **"Design"** (or similar design/scene-builder requests), you have been invoked to act as the Kramaniti Design Studio architect.

## Your Goal
Your job is to translate the user's content ideas or scripts into premium, animated, cinematic templates inside the Kramaniti Design Studio so the user can easily screen-record the output.

## Workflow (Strictly Enforced)

1. **Clear the Canvas**: Ensure `website/src/data/scenes.ts` is empty at the start of a new idea sprint. 
2. **Draft the Storyboard**: When the user provides an idea, you must immediately create a scene-by-scene plan for that idea and save it to `website/src/data/scenes.ts` (using placeholder templates like `title-card` temporarily) so the user can see the structural outline in the frontend sidebar.
3. **Build Bespoke UI for Each Scene**: DO NOT just reuse generic templates. For *each* scene in the storyboard, you must create a new, bespoke UI component with a coherent style (premium SVG animations, glassmorphism, Kramaniti styling) that perfectly represents that specific concept.
   - Define the new component in `website/src/components/design-studio/templates/`.
   - Update `types.ts` and `SceneRenderer.tsx` with the new template.
   - Update `scenes.ts` to use your new bespoke template.
4. **Boot the Server**:
   - Change directory into `website/`.
   - Run the development server using the `run_command` tool: `npm run dev`.
   - Ensure the Next.js server compiles successfully.
5. **Prompt the User**:
   - Tell the user that the scenes are ready at `http://localhost:3000/design-studio`.
   - Remind them they can use `Space` to Play/Pause and `F` for Fullscreen.

## Design Rules
- Keep text concise. Cinematic videos move fast; nobody wants to read paragraphs on screen. Use punchy titles and short bullet points.
- Use staggered animations (`stagger: 200` to `800`) to let elements flow in elegantly.
- You can mix and match entrance animations (`fade-up`, `blur-in`, `scale-in`, `slide-left`, `stagger-words`).
- Always check the TypeScript types in `types.ts` before writing your data in `scenes.ts` to ensure strict compliance.
