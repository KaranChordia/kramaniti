# Agree how you’ll know it works before you build

Version 1.1 · Kramaniti Kosh

## Intended outcome

A one-page sheet that names the workflow, who uses it, what starts it, what "done" looks like in real work, safe sample inputs, expected behaviour, fail and stop conditions, evidence to keep, a named owner and a review date, written and agreed before anyone builds or buys anything.

## Before you begin

- One workflow the team wants to change or support, described in plain words
- Someone who does that work today, and someone who can decide what "working" means
- Agreement that no build, bot, app or hire will start until this sheet is filled

## How to use

1. Name the workflow, who uses it and what triggers it. Stay with real work; do not name a product yet.
2. Write what "done" looks like, safe sample inputs, expected behaviour, fail and stop conditions, and what evidence to keep. Leave blanks where you do not know.
3. Name an owner and a review date. Use the stop rules before anyone builds, buys or turns anything on.

## Working template

## Sheet header

Business or team:

Sheet owner:

Date:

Workflow name (one workflow only, in plain words):

Who uses it (role or person):

What starts it (the trigger):

## What "done" looks like

Write one or two sentences that describe a finished run of this workflow in real work. Say what the person using it can see or do when it has worked. Do not name a product.

## Safe sample inputs

List a few inputs the workflow should handle safely. Use made-up or anonymised examples. Do not put real customer names, phone numbers or money amounts here unless the owner agrees.

- Sample input 1:
- Sample input 2:
- Sample input 3:
- Inputs that must wait for a human (money, promises, complaints, medical or legal wording):

## Expected behaviour

For each sample input, write what should happen in plain steps. Say who acts, what they see and what they pass on.

- For sample input 1:
- For sample input 2:
- For sample input 3:

## Fail and stop conditions

Write when the workflow must stop and hand to a person. Be specific.

- Stop if:
- Hand to a named person if:
- Do not send, book, charge or promise anything if:

## Evidence to keep

What record should remain after a run, so someone can see what happened later?

- What to keep:
- Where it will live:
- Who can see it:

## Owner and review

Named owner for this sheet:

Who else must agree before any build starts:

Review date (when you will check the sheet against real work again):

## Stop rules

- Do not start building, buying, hiring or turning on a tool until this sheet has a workflow name, who uses it, a trigger, what "done" looks like, safe sample inputs, expected behaviour, fail and stop conditions, evidence to keep, a named owner and a review date.
- Do not invent pass rates, volumes, time saved or customer results. Write what people said, or leave it blank.
- Money, medical advice, legal wording, refunds and promises to customers stay with a named human. They are not automatic outputs.
- If two people disagree on what "working" means, record both views and pick one with a reason, or set a date to decide before any build.

## Demonstration

This is an illustrative scenario, not a client case study or a measured result. Do not reuse its details as facts about your work.

A sample three-person physiotherapy clinic in Bengaluru wants appointment reminders. The owner, the receptionist and one physiotherapist run the clinic together. They have been looking at reminder apps and WhatsApp tools, but nobody has yet written down what "working" means for reminders before a build starts.

### Sample inputs

Demonstration inputs only. No patient counts, reminder rates, no-show rates or costs are used. From a short talk with the owner, the receptionist and the physiotherapist: patients book by phone and WhatsApp; the receptionist writes appointments in a paper diary and a shared spreadsheet; the physiotherapist wants patients reminded the day before; the owner does not want reminder wording that sounds like medical advice; nobody has agreed what happens when a patient replies that they need to change the time.

### Example output

#### Sheet header
[Fact within this demonstration] Workflow name: day-before appointment reminder for booked physiotherapy visits. Who uses it: the receptionist. Trigger: an appointment already written in the diary for the next day. Sheet owner: [Name the clinic owner].

#### What "done" looks like
[Inference] The receptionist can see that each next-day appointment either got a reminder or was marked as needing a human follow-up, without guessing from chat history. How often patients reply or attend has not been measured in this demonstration.

#### Safe sample inputs
[Fact within this demonstration] Sample 1: a routine follow-up visit already booked for tomorrow, with a phone number on the booking.
Sample 2: a first visit tomorrow where the patient asked for WhatsApp only.
Sample 3: a booking where the time was changed yesterday and the diary and spreadsheet may not match.
Must wait for a human: any reply that asks what treatment to do, whether to stop exercises, or anything about fees or refunds.

#### Expected behaviour
Sample 1: send a short reminder with the date, time and clinic name; note that it was sent.
Sample 2: send the same reminder on WhatsApp if that is the agreed channel; note the channel used.
Sample 3: do not send until the receptionist has checked the diary and spreadsheet and confirmed the time.
[Inference] The reminder should confirm attendance details only. It should not answer clinical questions.

#### Fail and stop conditions
Stop if the diary and spreadsheet disagree on the time.
Hand to [Name the receptionist] if the patient replies with a change request, a clinical question or a fee question.
Do not send, rebook, charge or give advice from the reminder itself.

#### Evidence to keep
Keep: which booking was reminded, which channel was used, whether a reply needed a human, and who handled it.
Where it will live: [A column on the shared spreadsheet, or a short daily note the receptionist already keeps].
Who can see it: the owner and the receptionist.

#### Owner and review
Named owner: [Name the clinic owner].
Who else must agree: [Name the receptionist and the physiotherapist].
Review date: [Two weeks after the sheet is agreed, before any app is bought].

#### Stop rules applied
[Recommendation] Agree this sheet before shortlisting any reminder app or WhatsApp tool. Keep clinical replies, fees and rebooking with the named people. This recommendation is not the clinic’s decision.

## Quality check

The sheet names one workflow, who uses it, the trigger, what "done" looks like, safe sample inputs, expected behaviour, fail and stop conditions, evidence to keep, a named owner and a review date; blanks stay visible where facts are missing; no pass rates or results were invented; nothing was built or bought before the sheet was filled.

## Limits and human review

The sheet records how you will know the workflow works; it does not prove that a tool is right, safe or worth paying for, and it does not check medical, data protection or consumer rules. A filled sheet is not approval to send reminders, give clinical advice, change fees or turn on automation. Keep consequential actions with the named human owner.

## Edition notes

New in Kosh at version 1.1. Provider-neutral Markdown instructions; no installation or platform compatibility is implied. Runtime behaviour has not been verified across AI providers. Reuse terms have not yet been published. Background reading: [Write the Test Before the Build](/insights/write-the-test-before-the-build/). Building to a written test is part of Kramaniti’s [Systems Engineering](/#services) work.
