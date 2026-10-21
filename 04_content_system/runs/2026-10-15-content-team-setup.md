# Content-team setup and initial run

## Requested outcome

[Fact] KC asked for agents responsible for understanding what is currently published, planning content around it and generating content. KC confirmed LinkedIn and Instagram as primary channels. Product logos will be created by KC in Canva and supplied later; logo work is paused.

## Implemented

- Extended three existing agent configurations, plus their editorial/research/visual modes. Connected the route and canonical instructions rather than creating duplicate agents or user-owned chats.
- Created the workflow, per-channel publication registry, public baseline and rolling four-week proposal.
- Registered four actual generated campaign images without promoting them to published status. Kept positive creative feedback separate from publication approval.
- Prepared finished LinkedIn/Instagram captions and alt text for two existing follow-up images.
- Prepared complete four-slide copy, channel captions and an image-production prompt for the next applied Kosh invoice-follow-up carousel. Images are not generated; the existing four assets cover the current introduction/follow-up sequence.

## Research and limits

One bounded worker performed read-only public website research. It reported Spasht HTTP 200, old-route 308, Kosh's current catalogue and Insights listing. Coordinator independently confirmed Spasht, the legacy route's final destination, Insights and the invoice template. No private workspace, member content or analytics inspected. Social account identities remain unknown because KC supplied platform names, not profile URLs. This is a provisional social plan and a verified bounded website baseline.

## Validation

`python3 06_ai_agent_context/scripts/validate_content_team.py` checks required config keys, role/router references, registry evidence conditions, exact revision/channel/account approval and actual asset paths. Four isolated negative cases reject missing publication URL, a global published production state, creative feedback as publication authority and stale revision approval. These checks do not fetch URLs or certify account identity. Application code was not edited; no website build is needed for this documentation/configuration change.

## Next action

Obtain exact LinkedIn/Instagram profile links or post permalinks/export. Refresh accessible recent posts, record scope/time and adjust sequence before posting. KC can invoke: “Run the content team: review what is published on LinkedIn and Instagram, update the plan, and produce the next post.” No scheduler, automation, social connection, production deployment or publication was created.
