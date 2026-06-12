# Asset Registry

**Purpose:** Track Kramaniti assets, source context, usage status, and public-use permissions.

**Key Findings:** [Recommendation] Assets should be registered before repeated public use so visual consistency and permission status stay visible.

**Evidence:** `08_assets/AGENTS.md`, `03_brand_strategy/brand_system/brand_operating_kit.md`, and `03_brand_strategy/positioning/brand_identity_guidelines.md`.

**Interpretation:** [Inference] The asset registry should include both source assets in `08_assets/` and active public assets in `website/public/assets/` when they are reused across website, social, decks, or campaigns.

**Implications:** Asset entries should separate file existence from permission status. A file path alone does not prove that an asset is approved for every public use.

**Open Questions:** Which founder images, selected-work visuals, and brand marks are approved for repeated social and deck use?

**Next Steps:** Register assets as they are selected for campaigns or public reuse.

---

## Asset Status Values

| Status | Meaning |
| :--- | :--- |
| Public-ready | Approved for repeated public use in the stated context |
| Internal-only | Use inside the repo or private drafts only |
| Needs review | Source, rights, or context needs review before public use |
| Retired | Do not use without explicit reapproval |

## Registry

| Asset | Path | Type | Status | Source Context | Usage Notes | Owner |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Kramaniti gold mark SVG | `website/public/assets/brand/kramaniti-mark-gold.svg` | Brand mark | Needs review | [Fact] File exists in website public assets. | Confirm repeat-use rules before using in campaign graphics. | Asset Librarian |
| Kramaniti gold mark PNG | `website/public/assets/brand/kramaniti-mark-gold.png` | Brand mark | Needs review | [Fact] File exists in website public assets. | Use only when raster mark is required. | Asset Librarian |
| Kramaniti framed mark | `website/public/assets/brand/kramaniti-mark-framed.png` | Brand mark | Needs review | [Fact] File exists in website public assets. | Confirm placement rules before campaign use. | Asset Librarian |
| Founder image | `website/public/assets/founder_real.jpg` | Founder photo | Needs review | [Fact] File exists in website public assets. | Confirm approved public contexts before reuse outside website. | Asset Librarian |

## Campaign Asset Intake

When adding a new asset, record:

- asset name
- path
- type
- source or creator
- permission status
- approved channels
- expiry or review date if any
- proof sensitivity
