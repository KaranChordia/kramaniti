# Communication Protocols

To maintain continuity across the agent team, all internal communication (handoffs, tasks, and escalations) must follow these formats.

## 1. Task Brief Format
Used when the Master Coordinator or a Lead Agent assigns work to another agent.

**Format:**
- **Task:** [Clear, action-oriented title]
- **Context:** [Why are we doing this? Which strategic priority does it support?]
- **Inputs:** [Links to relevant repo files, e.g., `03_brand_strategy/positioning/...`]
- **Expected Output:** [What exactly should be produced? e.g., "Drafted section in page.tsx"]
- **Constraints:** [Specific things to avoid based on brand voice or current strategy]

## 2. Handoff Format
Used when an agent finishes their part of a process and passes it to the next agent in the sequence.

**Format:**
- **Status:** [Completed / Blocked]
- **What was done:** [Brief summary of edits/creation]
- **Files Modified:** [List of paths]
- **Next Steps:** [What the receiving agent needs to do]
- **Open Questions:** [Anything unresolved?]

*Note: Handoffs should also be recorded in `memory/master_coordinator/handoff_log.md`.*

## 3. Escalation Format
Used when an agent hits a hard constraint, needs human approval, or detects a conflict.

**Format:**
- **Escalation Reason:** [e.g., Missing Proof, Pricing Change, Security Risk]
- **The Issue:** [Brief description of what happened]
- **Impact:** [Why this blocks work]
- **Recommendation:** [What the agent suggests doing]

*Note: Escalations waiting for founder input should be logged in `memory/master_coordinator/pending_decisions.md`.*

## 4. Status Report Format
Used for async updates to the founder or Master Coordinator.

**Format:**
- **Current Sprint Goal:** [Reminder of the objective]
- **Completed:** [Bullet points of done work]
- **In Progress:** [What is happening now]
- **Blocked/Needs Review:** [Link to pending decisions]
