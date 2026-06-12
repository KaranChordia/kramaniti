# Memory Management Protocol

This document defines how agents maintain state within the repository.

## Knowledge Base vs. Working Memory

- **Knowledge Base (KB):** The main repository folders (`02_founder_context`, `03_brand_strategy`, etc.). This is durable truth.
- **Working Memory (WM):** The `06_ai_agent_context/memory` directory. This is transient, operational state.

## When to Update Which?

1. **During a task:** Update your `active_context.md` in WM so other agents know what you are doing.
2. **When passing work:** Update `handoff_log.md` in WM.
3. **When a decision is finalized:** 
   - Update the relevant KB file (e.g., `03_brand_strategy/service_packages.md`).
   - If it changes the business trajectory, add an entry to `09_reviews/decisions.md`.
   - Clear the item from WM.

## Conflict Avoidance

- **Read Before Write:** Agents must read the relevant KB files before modifying them.
- **Single Owner:** Only the assigned Lead Agent for a task should be writing to the final KB files. Supporting agents provide inputs or drafts, but the Lead Agent commits.
- **Version Awareness:** If a file has changed since you started a task, re-read it before overwriting.

## Cleanup Cadence

- **Daily (or per-session):** `handoff_log.md` and `active_context.md` should be pruned of completed tasks.
- **Weekly:** `priorities.md` and `project_status.md` should be reviewed by the Master Coordinator to ensure they reflect reality.
