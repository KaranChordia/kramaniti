# Builder-Exit Handover Test

Version 1.1 · Kramaniti Kosh

## Intended outcome

A clear answer to whether a workflow can run, stop safely and be corrected without the person who built it, plus a short list of what to fix before it grows.

## Before you begin

- One workflow already in use, manual or AI-assisted
- The person who runs it day to day, and someone who has not built it
- An hour when the builder can stay present but silent

## How to use

1. Name the roles and fill in the readiness questions from what is written down today, not from what the builder can explain.
2. Run the three practice cases with the operator while the builder watches and says nothing. Note every moment that needs private context.
3. Agree the smallest fixes, assign owners and repeat the test before adding more users or handing the workflow over.

## Working template

## Workflow and roles

Workflow:

Builder:

Operator (runs the normal route):

Decision owner (resolves cases that need judgment):

Support owner (keeps access, instructions and settings usable):

If one person holds more than one role, write that down. It is allowed, but it should be visible.

## Readiness questions

The operator should be able to answer each of these from the workflow’s own notes or screens. Mark each Yes, Partly or No, and say where the answer lives.

1. What starts the workflow?
2. What inputs or source records does it need, and where are they?
3. What does a good output look like? Is there an example?
4. When must the route stop or pass the work to a person?
5. Where is the accepted result or correction recorded?
6. Who has access to the tools and accounts it uses, and who can remove that access?
7. What does it cost each month, and who pays for it?

## Recovery cards

Write one card for each of the three most likely failures.

- Failure:
- Signal (how someone would notice):
- Immediate safe action:
- Escalation owner:
- Where the fix is recorded:

If the only safe action on a card is “ask the builder”, the workflow is not ready.

## Practice cases

Run each case with the operator narrating what they see, what they trust, what they would do and what they would record.

1. A normal case
2. An incomplete case (a missing input or unclear request)
3. An exception that should reach the decision owner

For each case, note every point where the operator needed the builder’s private knowledge.

## Result

- Ready to run without the builder
- Ready with named fixes, to be retested on [date]
- Not ready; keep the builder involved until [condition]

Fixes to make, each with an owner and a date:

Signed off by (decision owner):

## Demonstration

This is an illustrative scenario, not a client case study or a measured result. Do not reuse its details as facts about your work.

A sample early-stage B2B software startup has an operations associate who built an AI-assisted workflow that turns sales call notes into CRM updates and follow-up email drafts. The associate is moving to a product role next month, and a sales executive will take the workflow over.

### Sample inputs

Demonstration inputs only: the instructions for the assistant live in the associate’s personal notes; the CRM fields it fills are listed in a shared document; the subscription is on the associate’s company card; no written rule says when a follow-up draft should go to a founder.

### Example output

#### Readiness questions
1. Starts when: Yes, a call note is added to the shared folder.
2. Inputs: Partly. The call note template exists; the assistant instructions are in a personal notes app.
3. Good output: No example saved.
4. Stop rule: No. Nothing says which follow-ups need a founder’s review.
5. Record: Yes, CRM activity history.
6. Access: Partly. Only the associate can edit the assistant settings.
7. Cost: [Fact within this demonstration] Billed to the associate’s card; no owner named for renewal.

#### Practice cases
[Fact within this demonstration] In the exception case, a prospect asked for custom pricing. The sales executive did not know whether the drafted follow-up could mention pricing and asked the associate.
[Inference] Pricing questions may need a written stop rule. One practice case is not enough to be sure how often this comes up.

#### Result
Ready with named fixes, to be retested in two weeks.

#### Fixes
[Recommendation] Move the assistant instructions to a shared, versioned document. Save two approved example outputs. Add a rule that any follow-up mentioning price or contract terms goes to [Name the founder] before sending. Move billing and admin access to [Name the support owner].

## Quality check

The test was run with the operator, not the builder, doing the work; every No or Partly answer has a fix with an owner; recovery cards have safe actions that do not depend on the builder; the decision owner signed the result.

## Limits and human review

This test checks whether ownership, instructions and recovery steps exist. It does not prove the workflow is accurate, secure or compliant, and a few practice cases will not show every failure. Keep consequential actions with the named human owner.

## Edition notes

New in Kosh at version 1.1. Provider-neutral Markdown instructions; no installation or platform compatibility is implied. Runtime behaviour has not been verified across AI providers. Reuse terms have not yet been published. Background reading: [Can the Workflow Run Without Its Builder?](/insights/can-the-workflow-run-without-its-builder/). System care and team support after launch are part of Kramaniti’s [Complete Lifecycle Retainer](/#services).
