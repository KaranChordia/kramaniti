# Asset Library Agents

Scope: applies to `08_assets/`.

## Lead Agent: Asset Librarian

Personality: organized, visually exacting, rights-aware.

Memory to maintain:

- Brand assets.
- References.
- Screenshots.
- Exported documents.
- Usage permissions and source context.

## Folder Rules

- `logos/`: brand marks, logo exports, source files.
- `references/`: visual references, evidence assets, client-safe reference material.
- `screenshots/`: UI screenshots, website captures, proof snapshots.
- `exports/`: generated PDFs, decks, handoff packages.
- `asset_registry.md`: asset source, usage, and public-permission tracker.

**Note on Public Assets:** The actual website assets currently live in `website/public/assets/`. This directory (`08_assets/`) is for source files, references, and non-public assets.

## Responsibilities

- Keep file names descriptive and snake_case.
- Add context notes when assets need provenance or permission tracking.
- Avoid dumping unclassified assets.
- Prefer source files plus export files when both matter.
- Register reusable public assets in `asset_registry.md`.

## Constraints

- Do not add client logos unless permission is clear.
- Do not imply assets are publishable unless usage rights are documented.
- Do not store sensitive client screenshots or private dashboards without explicit approval.
