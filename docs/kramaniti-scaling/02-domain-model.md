# Workflow Intelligence: Domain Model v0

## Design principle

[Recommendation] The primary ontology is the workflow and its controls—not agents, tools, prompts, or model runs. Those may later attach to a workflow step, but they are not needed to validate the core product hypothesis.

## Core entities

| Entity | Required attributes | Relationship / rule |
| --- | --- | --- |
| Organisation | `id`, `name` | Owns the workflow and team boundary. |
| Team | `id`, `name`, `purpose` | The workflow team; must match the workflow `teamId`. |
| Actor | `id`, `name`, `role`, `teamId` | A named responsibility in the workflow. Customer data is not represented. |
| Workflow | identity, organisation/team IDs, name, description, trigger | Contains ordered steps, controls, issues, metrics, improvements, and versions. |
| Step | sequence, purpose, classification, owner/approver, systems, inputs, outputs, rule, handoff, checkpoint, evidence | Sequences are contiguous from 1. Owner may be unassigned only where an ownership ambiguity is explicitly recorded. |
| Issue | type, title, detail, severity, step ID | Types: `bottleneck`, `risk`, `ownership_ambiguity`. A valid representative workflow includes a bottleneck and ownership ambiguity. |
| Exception | trigger, route, escalation owner, step ID | Must identify a known step and actor. |
| Metric | name, baseline, target, cadence | Captures measurable before/after intent, not a claimed result. |
| Improvement | title, rationale, owner, status | Status is `proposed`, `approved`, or `complete`. First slice stores it only in browser state. |
| Version | number, time, change summary, author | Workflow history begins with version 1. |

## Controlled vocabularies

```ts
type WorkClassification = 'human_led' | 'ai_assisted' | 'safely_automatable';
type WorkflowRiskLevel = 'low' | 'medium' | 'high';
type WorkflowIssueType = 'bottleneck' | 'risk' | 'ownership_ambiguity';
type WorkflowImprovementStatus = 'proposed' | 'approved' | 'complete';
```

## Runtime invariants

The validator in `website/src/lib/workflow-intelligence/workflowDomain.ts` requires:

1. organisation, team, workflow, and at least one actor;
2. workflow organisation/team references to match the declared boundary;
3. one or more steps, numbered 1..n without gaps;
4. an allowed work classification, known owner/approver (when assigned), non-empty systems/inputs/outputs/evidence, and a decision rule for every step;
5. handoffs to point to known steps;
6. one bottleneck, one ownership ambiguity, an exception/escalation route, a baseline/target metric, and version 1;
7. issue and escalation references to point to known steps/actors.

## Persistence boundary (deferred)

[Decision pending] This model is intentionally not mapped to Supabase tables yet. A persistent implementation must decide whether a workflow is owned by a Kramaniti internal workspace, a customer organisation, or a shared delivery workspace; the resulting RLS and audit model materially differs.

The likely future pattern is an isolated workflow domain/schema with organisation/workspace membership, server-verified requests, RLS, append-only version/history records, and explicit evidence retention rules. It must not be assumed from this prototype.
