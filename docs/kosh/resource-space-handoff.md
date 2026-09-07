# Kosh spatial resource experience

Date: 2026-09-07. Local, reviewable extension of the connected Kosh experience.

## Direction and scope

[Fact] KC asked for substantially stronger spatial awareness and focused movement inside opened templates, replacing the traditional long resource page. This continues the same local Kosh outcome in the existing b773 worktree.

[Fact] Website Steward leads, with Brand Identity and Proof and Governance Auditor responsibilities handled in this task. No additional agents or tasks were created. Existing Studio and world changes were preserved.

## Implemented experience

- All six public resources open into an asymmetric map and one focused content area: Intent → Method → Example → Review → Your copy.
- The method is divided using the original resource's headings. Each part can be inspected independently, with previous/next movement and a visible position. Returning from another place remembers the last method part.
- The desktop map stays visible beside the content. Mobile uses a compact sticky path; intentional navigation brings the content beneath it. Directional movement is short and disabled under reduced motion. Normal document scrolling and native links remain available.
- Each place and method part has a hash URL. Direct links and browser back/forward select the corresponding content. Re-selecting the current location does not add redundant history.
- The original reader is an accessible native dialog with Escape and focus return. Full canonical content is present in the server-rendered HTML, and the original Markdown download remains byte-identical.
- The existing manual working-copy editor stays mounted while the user consults method, example or review. Its guest account form is collapsed behind an explicit disclosure in this focused presentation. A blocked route departure reveals the working-copy warning even when another place was visible.
- Source-backed Create links, provenance, existing account/provider boundaries and related-resource routes are preserved. No canonical Markdown wording was changed.

## Verification

[Fact] `npm run test:kosh`: 24 passing domain and mocked API tests, including a new reconstruction check for every public resource's exact section wording and nested demonstration headings.

[Fact] `website/tests/kosh-resource-space.mjs` passes at 1440, 390 and 320 widths. Evidence: `evidence/resource-space-results.json`, `resource-intent-*`, `resource-method-*`, `resource-copy-*`, `resource-light-zoom.png`, and actual downloaded source/working-copy Markdown. Checks cover section history, method-part recall, edited-copy continuity, real downloads, departure guard reveal, original-reader Escape/focus return, map touch target heights, no horizontal overflow, all six resources, reduced motion and light theme.

[Fact] A separate keyboard pass verified Enter activation and focus transfer into the method. Rapid Intent/Example/Review/Method changes finish on the last selected method with the correct map marker and one visible focus area.

[Fact] `website/tests/kosh-world-browser.mjs` passed again against the updated resource: Explore filters/position → exact original download → source-backed Create → ZIP → discovery return, native back/forward and My work/Create continuity. Completed browser passes report no console or page errors.

[Fact] Production build, lint, explicit TypeScript and diff whitespace checks pass. The preview is restarted after the build at `http://127.0.0.1:3001/library/resources/source-checking-skill`. Build-generated HQ metadata is restored to its pre-task bytes.

[Unverified] Browser testing uses local Chrome/Chromium and synthetic text. Hardware phone keyboards, Safari, screen readers and actual browser-menu 200% zoom were not tested. The recorded 200% check uses CSS zoom. This presentation change does not verify live member persistence or provider calls; previous backend release gates remain.

## Changed files for this extension

- `website/src/components/kosh/resource/ResourceSpace.tsx`
- `website/src/components/kosh/resource/resource-space.module.css`
- `website/src/lib/kosh/resourceSections.ts`
- `website/src/app/library/resources/[id]/page.tsx`
- `website/src/app/library/ResourceWorkbench.tsx` (focused presentation and blocked-navigation callback only)
- `website/tests/kosh-resource-space.mjs`
- `website/tests/kosh-resource-sections.test.mjs`
- This handoff, evidence, and the extension in `09_reviews/decisions.md`.

[Fact] Work remains local and uncommitted. No deployment, remote migration, account mutation or provider request was made. The primary checkout and original Markdown files remain untouched.

## Publication authorization

[Fact] KC explicitly authorized committing and publishing all work in this task on 2026-09-07. The release includes the complete manual Studio, connected Kosh navigation, spatial resource experience, preparation code/migration and verification artifacts. Private Studio persistence and model assistance remain unavailable; the migration is not applied by publication. The earlier local-only status describes the implementation checkpoint. See `release-20260907.md` for release scope and verification.
