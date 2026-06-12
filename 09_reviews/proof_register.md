# Proof Register

**Purpose:** Track public claims, client references, metrics, testimonials, proof assets, and permission status before they appear in Kramaniti public content.

**Key Findings:** [Fact] Kramaniti must not invent client names, testimonials, metrics, logos, case studies, or outcomes. [Recommendation] Proof review should be mandatory for website, content, campaign, and proposal material.

**Evidence:** `AGENTS.md`, `06_ai_agent_context/system_prompts/master_context.md`, and `09_reviews/decision-log/decisions.md`.

**Interpretation:** [Inference] A proof register makes public trust easier to protect because agents can see what is approved, blocked, or still needs founder confirmation.

**Implications:** Proof-sensitive content remains draft-only until reviewed. Specific client names, metrics, testimonials, logos, and outcome claims require evidence and permission.

**Open Questions:** Which selected experience references are approved for each channel and asset type?

**Next Steps:** Add or update entries whenever a public-facing draft uses proof, client references, metrics, or selected-work examples.

---

## Claim Status Values

| Status | Meaning |
| :--- | :--- |
| Approved | Evidence and permission are sufficient for the stated use |
| Limited use | Approved only in the stated wording, channel, or context |
| Needs source | Evidence is missing or incomplete |
| Needs permission | Evidence may exist but public use permission is unclear |
| Do not publish | Do not use publicly |

## Safe Language

[Fact] When specific proof is not verified and permission-cleared, use category-level credibility language:

"Experience across co-working, hospitality, education, startup, and B2B technology ecosystems."

## Proof Tracker

| Claim or Asset | Type | Status | Approved Wording | Source or Evidence | Permission Notes | Owner |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Category-level experience across co-working, hospitality, education, startup, and B2B technology ecosystems | Credibility language | Limited use | Experience across co-working, hospitality, education, startup, and B2B technology ecosystems. | `AGENTS.md` and `06_ai_agent_context/system_prompts/master_context.md` | Use when specific proof is not cleared. | Proof and Governance Auditor |
| WeWork India, Hyatt Centric, and Nexocean references | Selected experience | Limited use | Use only as softened, text-only selected experience unless public permission and evidence are confirmed. | `AGENTS.md` and `06_ai_agent_context/system_prompts/master_context.md` | No logos, metrics, testimonials, or broad endorsement language without approval. | Proof and Governance Auditor |
| Nexocean selected work page | Selected work | Limited use | Frame around internal workflow tools, practical AI systems, and cinematic brand presence. | `09_reviews/decision-log/decisions.md` Decision 7 | Do not claim quantified recruiter outcomes, testimonials, or client endorsement unless separately approved. | Proof and Governance Auditor |

## Review Checklist

- [ ] Is the claim factual, inferred, unverified, or a recommendation?
- [ ] Is there evidence in founder context, decision log, public source, or approved asset?
- [ ] Does public use require permission?
- [ ] Is the wording softened enough for the available proof?
- [ ] Has founder approval been recorded for publication?
