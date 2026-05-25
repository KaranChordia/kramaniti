# Domain & Handles Registry

**Purpose:** Track the availability, acquisition status, registration risk, and recommended registrars for all Kramaniti digital assets — domains and social platform handles. This file is the canonical source of truth for digital namespace ownership.

**Key Findings:** Domain and handle availability must be confirmed and secured before any public launch activity. Several high-value TLDs and handles remain unregistered and carry moderate acquisition risk due to the name's global uniqueness.

**Related Files:**
*   [company_name_ideas.md](file:///Users/k.c/kramaniti/03_brand_strategy/naming/company_name_ideas.md) — Original naming evaluation and scoring
*   [positioning_analysis.md](file:///Users/k.c/kramaniti/03_brand_strategy/positioning/positioning_analysis.md) — Market positioning context
*   [brand_narrative.md](file:///Users/k.c/kramaniti/03_brand_strategy/narrative/brand_narrative.md) — Core brand story and bios

---

## 1. Domain Lookup Table

`[Recommendation]`: Secure the primary `.com` and `.ai` TLDs first. These are the highest-priority assets for B2B credibility. Delay `.studio` and `.in` until post-launch unless pricing is opportunistic.

| Domain | Priority | Estimated Status | Registration Risk | Avg. Annual Cost | Recommended Registrar | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **kramaniti.com** | 🔴 Critical | `[Unverified]` — Likely available | **Medium** — `.com` namespace is saturated, but "kramaniti" is a coined Sanskrit compound with no existing commercial use. Risk of cybersquatting increases once any public branding goes live. | $10 – $15/yr (standard) | **Cloudflare Registrar** (at-cost pricing, no markup, free WHOIS privacy) or **Porkbun** (competitive pricing + free SSL) | Primary website domain. Must be registered before any social media announcements or website launch. |
| **kramaniti.ai** | 🟠 High | `[Unverified]` — Likely available | **Medium-High** — `.ai` domains are premium-priced and popular in the AI consulting space. Squatters actively monitor AI-related registrations. | $70 – $90/yr (premium TLD) | **Cloudflare Registrar** or **Namecheap** | Ideal for a future SaaS product landing page, API documentation portal, or redirect to the main `.com`. Establishes immediate technical credibility. |
| **kramaniti.co** | 🟡 Medium | `[Unverified]` — Likely available | **Low** — `.co` is less targeted by squatters for non-English coined words. | $25 – $35/yr | **Porkbun** or **Namecheap** | Useful as a short-link domain for email campaigns (e.g., `kramaniti.co/audit`) or as a brand-protection registration. |
| **kramaniti.in** | 🟡 Medium | `[Unverified]` — Likely available | **Low** — `.in` (India ccTLD) is affordable and has low squatting risk for Sanskrit neologisms. | ₹500 – ₹800/yr (~$6 – $10) | **BigRock** or **GoDaddy India** (local registrars with INR billing) | Useful for India-focused SEO, local client trust signals, and GST invoice domains. May be required if registering a `.in` company email under Indian MCA norms. |
| **kramaniti.studio** | 🟢 Low | `[Unverified]` — Likely available | **Very Low** — `.studio` TLD has minimal squatting pressure. | $15 – $25/yr | **Cloudflare** or **Porkbun** | Optional vanity domain. Could serve as a portfolio/case study subdomain or creative showcase. Low priority unless the brand architecture expands to a dedicated studio arm. |

### Domain Registration Risk Summary

`[Recommendation]`: Execute the following registration sequence within 48 hours of finalizing the brand name decision:

1.  **Immediate (Day 0):** Register `kramaniti.com` + `kramaniti.ai` via Cloudflare Registrar.
2.  **Week 1:** Register `kramaniti.in` via BigRock (needed for Indian business compliance and local email).
3.  **Month 1:** Register `kramaniti.co` for link shortening and brand protection.
4.  **Post-Launch:** Evaluate `kramaniti.studio` based on whether the brand architecture warrants a dedicated creative sub-brand.

### Registrar Comparison

| Registrar | Strengths | Weaknesses | Best For |
| :--- | :--- | :--- | :--- |
| **Cloudflare Registrar** | At-cost pricing (no markup), free WHOIS privacy, integrated DNS/CDN, fast propagation | Limited TLD selection; no `.in` support | `.com`, `.ai`, `.co` — primary domains |
| **Porkbun** | Low prices, free WHOIS privacy, free SSL, clean UI | Smaller brand, less enterprise reputation | `.co`, `.studio` — secondary domains |
| **Namecheap** | Wide TLD selection, competitive renewals, solid DNS management | Renewal prices can spike; upsell-heavy UI | `.ai` fallback if Cloudflare unavailable |
| **BigRock** | Indian registrar, INR billing, `.in` specialist, local support | UI is dated; aggressive upselling | `.in` domain exclusively |

---

## 2. Social Handles Checklist

`[Recommendation]`: Secure all handles using the exact string **kramaniti** (lowercase, no underscores, no abbreviations) for maximum brand consistency and discoverability.

### 2.1 LinkedIn

| Asset | Current Status | Action Required | Priority |
| :--- | :--- | :--- | :--- |
| **Company Page** (`linkedin.com/company/kramaniti`) | `[Unverified]` — Not yet created | Create a LinkedIn Company Page under the name "Kramaniti". Requires a personal LinkedIn account as admin. Upload logo, banner, and populate the "About" section with the 100-word professional bio from [brand_narrative.md](file:///Users/k.c/kramaniti/03_brand_strategy/narrative/brand_narrative.md). Set industry to "Technology, Information and Internet" or "IT Services and IT Consulting". | 🔴 Critical |
| **Personal Handle** (`linkedin.com/in/karanchordia` or similar) | `[Inference]` — Karan likely has an existing personal profile | Update the personal profile headline to align with the new positioning: **"AI Architect · Founder, Kramaniti · Building intelligent media systems for modern enterprises"**. Link the Company Page. Update the "Experience" section to list Kramaniti as the current primary role. | 🔴 Critical |

**LinkedIn Configuration Notes:**
*   `[Recommendation]`: Enable LinkedIn Creator Mode on the personal profile to unlock the newsletter feature, "Follow" button, and featured content slots.
*   `[Recommendation]`: Pin a featured post or article that introduces the Kramaniti rebrand and links to the new website.

---

### 2.2 X / Twitter

| Asset | Current Status | Action Required | Priority |
| :--- | :--- | :--- | :--- |
| **@kramaniti** | `[Unverified]` — Likely available (coined term) | Register the handle immediately. Set display name to "Kramaniti". Populate bio with the 1-sentence elevator pitch from [brand_narrative.md](file:///Users/k.c/kramaniti/03_brand_strategy/narrative/brand_narrative.md): *"We help founders and tech brands turn complex ideas into cinematic stories and AI-powered content engines."* Pin a launch announcement tweet. | 🔴 Critical |

**X/Twitter Configuration Notes:**
*   `[Recommendation]`: Secure the handle before any public domain registration (WHOIS alerts can trigger squatters on social platforms).
*   `[Recommendation]`: Consider X Premium (Blue) subscription ($8/mo) for verification checkmark, edit button, and algorithmic boost — critical for B2B trust on the platform.
*   `[Inference]`: The legacy `@HowDramaTech` handle should be retained but bio-updated to redirect followers: *"This account has evolved → Follow @kramaniti for AI strategy, cinematic automation, and enterprise builds."*

---

### 2.3 YouTube

| Asset | Current Status | Action Required | Priority |
| :--- | :--- | :--- | :--- |
| **HowDramaTech Channel** (~1.05K subscribers) | `[Fact]` — Active channel with existing subscriber base and video catalog from 2017-2019 | Migrate the channel identity to Kramaniti. Do NOT delete or create a new channel — the 1,050+ subscriber base and historical watch time are SEO assets. | 🟠 High |

**YouTube Migration Strategy:**

1.  **Handle Update:** Change the YouTube handle from `@HowDramaTech` (or current custom URL) to `@kramaniti`. YouTube allows one handle change every 14 days (`[Fact]`).
2.  **Channel Name Update:** Rename the channel from "HowDramaTech" to "Kramaniti" via YouTube Studio → Customization → Basic Info.
3.  **Channel Art Refresh:** Replace the existing banner and profile image with the new Kramaniti brand identity assets (see [brand_identity_guidelines.md](file:///Users/k.c/kramaniti/03_brand_strategy/positioning/brand_identity_guidelines.md)).
4.  **Channel Description Rewrite:** Replace the existing description with the 100-word bio from [brand_narrative.md](file:///Users/k.c/kramaniti/03_brand_strategy/narrative/brand_narrative.md), appending a link to the new website and Calendly booking page.
5.  **Legacy Content Strategy:**
    *   `[Recommendation]`: Do NOT unlist or delete the old WeWork/drone/tech vlogs. They serve as verifiable proof of the B2B media track record referenced in the [career_timeline.md](file:///Users/k.c/kramaniti/02_founder_context/timeline/career_timeline.md).
    *   `[Recommendation]`: Create a "Legacy Archive (2017-2019)" playlist to organize old content. Pin a new "Welcome to Kramaniti" channel trailer as the featured video for non-subscribers.
6.  **Community Post:** Publish a YouTube Community post explaining the rebrand to existing subscribers. Frame it using Angle C ("The Incubation Reframe") from the [brand_narrative.md](file:///Users/k.c/kramaniti/03_brand_strategy/narrative/brand_narrative.md).

---

### 2.4 Medium

| Asset | Current Status | Action Required | Priority |
| :--- | :--- | :--- | :--- |
| **@kramaniti** (or `/kramaniti`) | `[Unverified]` — Likely available | Register the Medium handle. Link it to the Kramaniti website. Publish a launch essay using the core brand narrative as the first post. | 🟡 Medium |

**Medium Configuration Notes:**
*   `[Recommendation]`: Use Medium as a long-form thought leadership platform (Pillar 4: Systems & Risk content from [content_pillars.md](file:///Users/k.c/kramaniti/04_content_system/pillars/content_pillars.md) maps well here).
*   `[Inference]`: Karan has an existing Medium presence from the 2017-2019 era with published articles on professional philosophies. If the existing account uses the `HowDramaTech` or personal handle, update the username to `kramaniti` and add a bio redirect.
*   `[Recommendation]`: Consider importing Medium articles into a self-hosted blog on the Kramaniti website (via canonical URL tags) once the site is live, to consolidate SEO equity.

---

### 2.5 Instagram

| Asset | Current Status | Action Required | Priority |
| :--- | :--- | :--- | :--- |
| **@kramaniti** | `[Unverified]` — Likely available | Register the handle. Convert to a Business or Creator account for analytics access. | 🟡 Medium |

**Instagram Configuration Notes:**
*   `[Fact]`: Karan has an existing ~15K follower Instagram presence (referenced in [positioning_analysis.md](file:///Users/k.c/kramaniti/03_brand_strategy/positioning/positioning_analysis.md) as a credibility signal).
*   `[Recommendation]`: Do NOT merge or rename the personal Instagram. Instead, register `@kramaniti` as a separate Business account for the consultancy brand. The personal account (with 15K followers) should cross-promote Kramaniti content and link to the new handle in bio.
*   `[Recommendation]`: Use Instagram primarily for short-form video reels (Pillar 2: Computational Creativity — drone footage, AI-generated visuals, behind-the-scenes of Make.com pipelines) and carousel posts (case study breakdowns).

---

## 3. Handle Acquisition Priority Matrix

| Platform | Handle | Priority | Est. Time to Secure | Dependency |
| :--- | :--- | :--- | :--- | :--- |
| **Cloudflare** | `kramaniti.com` | 🔴 Critical | 5 minutes | Payment method |
| **Cloudflare** | `kramaniti.ai` | 🔴 Critical | 5 minutes | Payment method |
| **X / Twitter** | `@kramaniti` | 🔴 Critical | 10 minutes | Email address |
| **LinkedIn** | Company Page | 🔴 Critical | 15 minutes | Personal LinkedIn admin account |
| **YouTube** | `@kramaniti` | 🟠 High | 24-48 hours (propagation) | Existing HowDramaTech channel access |
| **BigRock** | `kramaniti.in` | 🟡 Medium | 10 minutes | PAN card / Indian ID for `.in` registration |
| **Medium** | `@kramaniti` | 🟡 Medium | 5 minutes | Email address |
| **Instagram** | `@kramaniti` | 🟡 Medium | 5 minutes | Phone number |
| **Porkbun** | `kramaniti.co` | 🟢 Low | 5 minutes | Payment method |
| **Porkbun** | `kramaniti.studio` | 🟢 Low | 5 minutes | Payment method |

---

## 4. Open Questions

1.  `[Unverified]`: What is the exact current YouTube handle/custom URL? Confirming this is needed to validate the migration path and check for any handle-change cooldown.
2.  `[Unverified]`: Does Karan's existing Instagram (~15K followers) use a personal name handle or the `HowDramaTech` brand? This affects the separation strategy.
3.  `[Unverified]`: Is there an existing Medium account to migrate, or should a fresh `@kramaniti` account be created?
4.  `[Recommendation]`: Should the `.ai` domain be used immediately (as the primary website) or held as a redirect to `.com`? The `.ai` TLD signals technical authority but `.com` has broader enterprise trust.

---

## 5. Next Steps

1.  Execute domain registrations per the priority sequence in Section 1.
2.  Secure all 🔴 Critical social handles within 24 hours.
3.  Update this registry with confirmed acquisition statuses (move `[Unverified]` → `[Fact]` as each asset is secured).
4.  Log all registrations in [decisions.md](file:///Users/k.c/kramaniti/09_reviews/decision-log/decisions.md).
