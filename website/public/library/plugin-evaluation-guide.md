# Plugin Evaluation Guide

Version 1.1 · Kramaniti Kosh

## Intended outcome

A recorded connection decision with permissions, ownership and a failure plan.

## Before you begin

- The specific plugin and current documentation
- Requested permissions and intended data
- An owner who can approve and revoke access

## How to use

1. Use this as an evaluation document. It is a guide, not an installable plugin.
2. Read the provider’s current permission and data documentation. Mark anything you cannot confirm as unknown.
3. Ask the owner to approve a bounded test only after the required evidence is available. Record how to revoke access.

## Working template

## Before connecting a plugin

1. State the exact workflow outcome it should improve.
2. List every permission it requests and every system it can reach.
3. Identify the least-privileged setup that still proves usefulness.
4. Record what happens when the plugin fails, returns poor data, or takes an unintended action.
5. Name the person who can approve, disable, or remove the connection.

## Decision record

- Plugin and version
- Intended use
- Permissions granted
- Data boundary
- Failure path
- Owner
- Approval date and review date

Do not connect a plugin merely because it is available. A useful connection has a clear job, a bounded permission set, and a reversible path.

## Demonstration

This is an illustrative scenario, not a client case study or a measured result. Do not reuse its details as facts about your work.

A team considers a document-search connection for approved reference notes.

### Sample inputs

Demonstration inputs only: the desired job is searching one reference folder. The hypothetical connector requests access to all documents. Its retention policy has not been supplied.

### Example output

#### Intended use
Search approved reference notes in one folder.

#### Permission inventory
[Fact within this demonstration] The hypothetical request covers all documents.
[Inference] The requested scope is broader than the stated job.

#### Data boundary
Only the approved reference folder is in scope. Private client documents are excluded.

#### Unknowns
Can access be restricted by folder? What data is retained? How is access revoked?

#### Decision
Hold the connection. Ask the provider for scoping and retention details.

#### Owner and failure path
[Name the administrator] reviews the evidence and records a revoke procedure before any test. Approval: pending.

## Quality check

Every permission has a reason; unknown retention or access behaviour stays visible; a named owner can disable the connection.

## Limits and human review

Permissions and provider behaviour change. Recheck current documentation before connecting; no plugin compatibility is implied. Keep consequential actions with the named human owner.

## Edition notes

Version 1.1 adds setup guidance, an illustrative example and a review checklist. Provider-neutral Markdown instructions; no installation or platform compatibility is implied. Runtime behaviour has not been verified across AI providers. Reuse terms have not yet been published.
