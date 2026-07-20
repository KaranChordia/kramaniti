# Clarity Square: first 20 real journeys review

Use this review after the first 20 authenticated members complete, abandon, or revisit the initial sequence. It is a founder-only operating note, not a public dashboard.

## Activation definition

A journey is activated when the member:

1. produces a Clarity Brief;
2. approves a private project; and
3. approves the reviewed starting actions.

The product records these owner-scoped events in `clarity_square.product_events`: `path_chosen`, `context_started`, `context_completed`, `clarity_brief_produced`, `project_created`, `task_drafted`, `task_approved`, `assistant_first_message`, `square_post`, `response_saved`, and `loop_completed`.

## Weekly review questions

1. How many members reached each activation step, and where did they stop?
2. Did the first approved task unlock a concrete learning or merely add administration?
3. Which path (Founder or Solopreneur) produced the clearest brief and project boundary?
4. Which community response was useful enough to save into a private project?
5. Did any user misunderstand privacy, publication, or human approval? Treat that as a product fix, not user error.

## Safe access model

The browser intentionally displays only the signed-in member's activation signal. Cross-user review requires a separately authorized, server-side founder/admin workflow; do not weaken Row Level Security or expose raw member context to create a dashboard.

## Decision log format

For each weekly review, record:

- cohort window and count of authenticated journeys reviewed;
- activation counts by step, without copying private context;
- repeated friction, confusion, or trust issues;
- one proposed change, its owner, and the evidence needed to keep or reverse it.
