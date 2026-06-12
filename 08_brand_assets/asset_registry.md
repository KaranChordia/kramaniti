# Asset Registry

**Purpose:** Track Kramaniti assets, source context, usage status, and public-use permissions.

**Key Findings:** [Recommendation] Assets should be registered before repeated public use so visual consistency and permission status stay visible.

**Evidence:** `08_brand_assets/AGENTS.md`, `03_brand_strategy/brand_system/brand_operating_kit.md`, and `03_brand_strategy/positioning/brand_identity_guidelines.md`.

**Interpretation:** [Inference] The asset registry should include both source assets in `08_brand_assets/` and active public assets in `website/public/assets/` when they are reused across website, social, decks, or campaigns.

**Implications:** Asset entries should separate file existence from permission status. A file path alone does not prove that an asset is approved for every public use.

**Open Questions:** Which founder images and selected-work visuals are approved for repeated social and deck use beyond internal planning?

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
| Kramaniti gold mark SVG | `08_brand_assets/logos/kramaniti_mark_gold.svg` | Brand mark | Needs review | [Fact] Source/reference copy exists in the brand asset library. | Public runtime copy also exists at `website/public/assets/brand/kramaniti-mark-gold.svg`. Confirm repeat-use rules before using in campaign graphics. | Asset Librarian |
| Kramaniti gold mark PNG | `08_brand_assets/logos/kramaniti_mark_gold.png` | Brand mark | Needs review | [Fact] Source/reference copy exists in the brand asset library. | Public runtime copy also exists at `website/public/assets/brand/kramaniti-mark-gold.png` and is used by the website header/footer/intro. | Asset Librarian |
| Kramaniti framed mark | `08_brand_assets/logos/kramaniti_mark_framed.png` | Brand mark | Needs review | [Fact] Source/reference copy exists in the brand asset library. | Public runtime copy also exists at `website/public/assets/brand/kramaniti-mark-framed.png`. Confirm placement rules before campaign use. | Asset Librarian |
| Founder real image | `08_brand_assets/founder_media/founder_real.jpg` | Founder photo | Needs review | [Fact] Source/reference copy exists in the brand asset library. | Public runtime copy also exists at `website/public/assets/founder_real.jpg` and is used by the website founder sections. | Asset Librarian |
| Founder cinematic references | `08_brand_assets/founder_media/` | Founder media | Internal-only | [Fact] Folder contains founder and era reference images moved out of public website assets. | Use as private reference material until public contexts are approved. | Asset Librarian |
| Insights graphics | `08_brand_assets/insight_graphics/` | Article graphics | Needs review | [Fact] Source/reference copies exist for current Insights graphics. | Public runtime copies remain under `website/public/assets/insights/` for article rendering. | Asset Librarian |
| Kramaniti brochure | `08_brand_assets/exports/kramaniti_brochure.pdf` | PDF export | Needs review | [Fact] Moved out of website public root because it was not referenced by website source. | Decide whether this should become a public download, stay internal, or be retired. | Asset Librarian |

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
