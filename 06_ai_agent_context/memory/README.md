# Kramaniti Agent Memory Architecture

## Memory Philosophy

Agents at Kramaniti do not rely on opaque context windows or hidden database tables to remember what they are doing. Instead, memory is explicit, readable by humans, and stored as markdown files in the repository.

There are two distinct types of memory in the Kramaniti system:

### 1. Knowledge Base (Long-term / Structural)

The Knowledge Base is the durable truth of the brand and operations. It exists in the main repository directories.
Agents refer to these files to understand strategy and rules, and they update them when permanent decisions are made.

- `02_founder_context/`: Facts about the founder.
- `03_brand_strategy/`: Positioning, messaging, and offers.
- `04_content_system/`: Pillars and editorial systems.
- `05_ai_strategy/`: Workflows and system blueprints.
- `07_business_build/`: Operations and CRM setup.
- `09_reviews/decision-log/`: Major strategic choices.

### 2. Working Memory (Short-term / Operational)

Working memory is this directory (`06_ai_agent_context/memory/`). It tracks what is happening *right now*. It is the equivalent of an agent's active notepad.

- **Status Tracking**: What are we doing this week?
- **Handoffs**: Who is passing work to whom?
- **Active Context**: What specific lens is an agent applying to their current task?
- **Pending Decisions**: What is waiting for the founder to approve?

## Rules for Working Memory

1. **Keep it current**: When a project is done, it should be cleared from `project_status.md` and durable learnings should be moved to the Knowledge Base.
2. **Keep it brief**: Working memory should not contain long strategy documents. Link to the actual files instead.
3. **Master Coordinator owns the flow**: The `master_coordinator/` directory is the central hub. Other agents have their own `active_context.md` files, but they take their cues from the master priorities.
