# Plugin Evaluation Guide

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
