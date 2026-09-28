# Keep a record of when the AI gets it wrong

Version 1.1 · Kramaniti Kosh

## Intended outcome

A shared record of each time someone had to step in, so repeat problems get fixed once, with a named person responsible.

## Before you begin

- One live workflow where people regularly correct, override or escalate
- A shared table or sheet placed beside that workflow
- A named owner who reviews the log on a fixed day

## How to use

1. Pick one workflow that is already running, whether manual or AI-assisted. Set up the log with the fields below and tell the team where it lives.
2. Record each exception on the day it happens. Keep entries short and factual; do not redesign anything while the first entries come in.
3. At the agreed review, group repeats, choose the smallest change for each pattern and close every reviewed entry with one outcome and an owner.

## Working template

## Workflow

Workflow name:

Log owner:

Review rhythm (for example, every Friday or every second Monday):

Where the log lives:

## Log fields

Record one row per exception.

- Date
- Workflow moment (where in the route it happened)
- What was expected
- What actually happened (the output, action or question)
- Human correction or temporary resolution
- Reason for the correction
- Class (see below)
- Recorded by
- Write-back target (where the fix should live: form field, source record, instruction, review rule, team note or decision owner)

## Classes

Give each exception one class. Change it at review if needed.

- One-off judgment: a genuine edge case that needs a person’s call
- Route gap: the normal route has no step for a situation that keeps appearing
- Source problem: the input, record or reference was missing, outdated or wrong
- Ownership problem: nobody was clearly responsible for the decision
- Policy boundary: the case touched money, commitments, privacy or a customer promise
- Communication gap: the customer or team member did not know what to expect

## Review

At each review, answer for every pattern:

1. How often has this appeared since the last review?
2. What did it interrupt or delay?
3. What is the smallest change that would stop someone reconstructing the answer next time?
4. Who owns that change, and by when will someone check it worked?

## Close each reviewed entry

Choose one outcome:

- No change, with the reason recorded
- Clearer operating note, added to [location]
- Changed workflow rule, approved by [name]
- System change, with an owner and a check date

## Stop rules

- Any exception involving money, legal exposure, personal data or a promise to a customer goes to the named decision owner the same day, not to the next review.
- Do not use the log to judge individual performance. It records the route, not the person.

## Demonstration

This is an illustrative scenario, not a client case study or a measured result. Do not reuse its details as facts about your work.

A sample D2C home-textiles brand uses AI-drafted replies for order-status messages. Its small customer care team keeps editing some drafts before sending.

### Sample inputs

Demonstration inputs only: five exceptions logged over two weeks. Three were corrections to delivery dates in drafted replies; one was a customer asking for a size exchange; one was a refund request the draft answered with a generic apology. No volume data beyond these entries.

### Example output

#### Pattern 1: delivery dates
[Fact within this demonstration] Three of the five entries corrected a delivery date in a drafted reply.
[Inference] The draft may be reading the dispatch date rather than the courier’s latest estimate. This has not been checked.
Class: Source problem. Write-back target: the order record field the draft reads from.

#### Pattern 2: refund request
[Fact within this demonstration] One drafted reply answered a refund request with a generic apology.
Class: Policy boundary. Refunds involve money and a customer promise.

#### Recommended changes
[Recommendation] Ask the operations lead to confirm which date field the drafts use before changing the instructions. Add a rule that any message mentioning a refund is routed to the care lead without a drafted reply.

#### Closed entries
Size exchange: no change; genuine one-off judgment, recorded.
Delivery dates: system change pending. Owner: [Name the operations lead]. Check date: [Next review].
Refund routing: changed workflow rule, awaiting approval from [Name the care lead].

## Quality check

Every entry says what was expected and what happened; each reviewed pattern ends in one outcome with an owner; urgent cases went to a person the same day rather than waiting for review.

## Limits and human review

A log shows what people noticed and recorded, not everything that went wrong, so treat counts as signals rather than measurements. It does not decide which changes are worth making; the named owner does. Keep consequential actions with the named human owner.

## Edition notes

New in Kosh at version 1.1. Provider-neutral Markdown instructions; no installation or platform compatibility is implied. Runtime behaviour has not been verified across AI providers. Reuse terms have not yet been published. Background reading: [The Exception Log Is a System Design Tool](/insights/the-exception-log-is-a-system-design-tool/). Regular reviews and workflow improvements after launch are part of Kramaniti’s [Complete Lifecycle Retainer](/#services).
