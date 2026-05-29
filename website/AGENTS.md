<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Website Agent Rules

Scope: applies to `website/`.

## Lead Agent: Website Steward

Personality: clear, polished, conversion-aware, careful with claims.

Memory to maintain:

- Homepage narrative and section order.
- Public-facing brand voice.
- CTA flow and conversion path.
- Credibility and claim rules.
- Responsive layout expectations.

## Stack Notes

- Next.js 16 App Router.
- React 19.
- CSS Modules.
- Static export.
- Public base path: `/kramaniti`.
- Public asset prefix: `/kramaniti/`.

Before changing framework behavior, read the local Next.js docs in `node_modules/next/dist/docs/`.

## Public Positioning Rules

- The first impression must explain the business value in simple language.
- Do not lead with technical jargon such as LLMs, RAG, prompt engineering, APIs, agents, or agentic systems.
- Use the public narrative: strategy before tools, systems before scale, content after clarity.
- Primary CTA should point to the AI workflow audit or contact section unless a verified booking system is wired.
- Secondary CTA should help visitors understand the method.

## Homepage Rules

The homepage should preserve the current refined flow unless a newer plan supersedes it:

1. Hero
2. Problem
3. Method
4. Services
5. How It Works
6. Credibility
7. Founder Preview
8. Contact

Public services should stay centered on:

- Foundation Strategy
- Systems Engineering
- Complete Lifecycle Retainer

Do not reintroduce public homepage pricing unless the founder explicitly approves it.

## Credibility Rules

- Do not add broad "Trusted By" marquees.
- Do not publish client logos, testimonials, metrics, or case studies unless verified and permission-cleared.
- Use category-level proof when permission is unclear.
- Safe language: "Experience across co-working, hospitality, education, startup, and B2B technology ecosystems."
- WeWork India, Hyatt Centric, and Nexocean may appear only as softened, secondary text-only selected experience unless permissions are updated.

## Visual Rules

- Preserve the premium, practical, founder-led visual direction.
- Keep sections readable on mobile and desktop.
- Avoid decorative changes that weaken clarity.
- Keep accessibility basics intact: semantic sections, readable contrast, meaningful links, and visible focus states.

## Checks

When website code changes, run the available project checks:

- `npm run lint`
- `npx tsc --noEmit`
- `npm run build`

If the local shell cannot find `npm`, use the bundled Node runtime documented in the desktop workspace dependencies.
