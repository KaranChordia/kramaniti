# Premium UI

Version 1.0 · Kramaniti Kosh

> How to use this file: fill in the Working template section below. It is a portable interaction-design skill, not a visual clone or a requirement to use a particular framework. If your assistant supports reusable skill packages, use the public package name `$premium-ui`.

## Intended outcome

A brand-adapted interaction contract and implementation brief for an interface that changes shape while preserving orientation, selected context and unfinished work.

## Before you begin

- One primary user task and the product surface where it begins
- The object, mode, filters, draft or other context that must survive a transition
- The target product's existing typography, colour, material, density and geometry rules
- The accessibility, responsive and reduced-motion constraints you must preserve

## How to use

1. Inspect the existing product and name one useful transformation. Preserve its working flow and visual identity unless a change is explicitly requested.
2. Write the interaction contract before implementing motion: primary task, persistent context, compact and expanded states, trigger, exit, persistence, focus behaviour, narrow-screen form, and loading, empty and error outcomes.
3. Design the static compact and expanded states first. Use one coordinated surface for related transient tools; replace incompatible panels rather than accumulating overlays.
4. Implement shared state before animation. Keep domain context separate from transient presentation state, and capture the original context for asynchronous work.
5. Add restrained transitions only where they explain the relationship between states. Then test the task with motion disabled, keyboard input, touch-sized controls, long content and an unavailable optional dependency.

## Working template

## Product and primary task

**Product or surface:**

**Primary user task:**

**Current starting point:**

**What should become easier or clearer:**

## Interaction contract

**Persistent anchor:** Name the trigger, heading, selected object or spatial origin that remains recognisable through the change.

**Compact state:** What is visible before activation? Keep frequent controls available and make the next action understandable without an icon-only guess.

**Expanded state:** What workspace appears, and what task can be completed there? Give it enough room to work rather than enough room only to look animated.

**Trigger:** What opens or replaces the surface? Define the pressed or expanded state and its accessible relationship to the content.

**Exit:** How does the user close, replace or finish the surface? Return focus to a connected, enabled trigger where appropriate.

**What persists:** List the selected object, mode, filters, inputs, drafts and results that survive a mode change. State what intentionally resets.

**What must never happen:** List context loss, stale results, hidden focus targets, accidental submission, or other unacceptable transitions.

## Shared context and state

Separate the states below rather than letting each panel maintain a contradictory copy:

- **Domain context:** selected object, mode, filters and current task
- **Workspace:** saved items and drafts, scoped to their owner or task
- **Presentation:** active surface, nested menu and return-focus target
- **Request:** loading state, request identifier, captured owner and result status

When a user changes object or mode, synchronise dependent labels, content and controls. If an asynchronous result finishes after the selection changes, keep it attached to the context that started the request or explain that it was cancelled.

## Connected surfaces

**Surface A:**

**Surface B:**

**Shared selection or context:**

**Replacement rule:** Which surface becomes inactive when another opens? Mark inactive content hidden or inert so it cannot receive focus or input.

**Nested controls:** Define how menus close, how Escape works from the innermost layer outward, and how Tab exits.

## Controls, motion and material

Use the target product's existing control family. Choose typography, colours, materials, density and geometry for that product; do not copy another product's palette or layout. Keep labels visible when an icon is ambiguous and use a consistent icon system with decorative icons hidden from assistive technology.

Define explicit tokens for:

- Structural transition duration and easing
- Short feedback transitions
- Focus indication
- Surface spacing and usable viewport bounds

Animate only properties that explain the state relationship. Prefer transform and opacity when they communicate enough. If a panel expands, coordinate the available content space so the reading target is not repeatedly displaced.

## Keyboard and focus behaviour

- Use buttons for actions and accurate expanded or pressed states.
- Move focus into a task surface only when the task requires it; otherwise preserve a sensible reading order.
- Return focus to the opening control on close when it remains available.
- Keep normal Tab navigation. Trap focus only in a genuinely modal dialog.
- Ensure inactive surfaces are hidden or inert, not merely transparent.
- Provide visible focus states and touch-friendly controls.

## Responsive and reduced-motion form

**Narrow-screen layout:** Decide whether the expanded surface reflows inline, becomes a bounded sheet, or uses a split view. Keep the close control reachable above browser chrome and the on-screen keyboard.

**Overflow risks:** Check long labels, tables, menus, code, inputs and nested scrolling. Avoid fixed dimensions that work only for the reference viewport.

**Reduced motion:** With `prefers-reduced-motion: reduce`, remove nonessential movement and smooth scrolling while retaining all content, state changes, focus behaviour and operability.

## Loading, empty and unavailable states

**Loading:**

**Empty:**

**Disabled:**

**Unavailable optional dependency:** Preserve a truthful useful path. If prepared content is used as a fallback, label it as prepared or local; do not present it as live AI, current data or completed external work.

## Demonstration

This is an illustrative scenario, not a client case study or a measured result. Do not reuse its details as facts about your work.

### Sample inputs

Demonstration inputs only: a support case list, a selected case, a reply draft and a compact toolbar with Search, Notes and Reply actions. No production data, user metrics or device coverage is available.

### Example output

#### Interaction contract

The selected case remains visible as the compact toolbar expands into a reply workspace. Search and Notes replace Reply within one coordinated region; switching surfaces preserves the case and draft. Closing returns focus to the selected case action.

#### Context rule

[Fact within this demonstration] The reply draft belongs to the selected case.

[Inference] If the user selects a different case while a reply request is pending, the result should remain associated with the original case rather than overwrite the new draft.

#### Responsive rule

[Recommendation] On a narrow viewport, the reply surface reflows below the case heading with an in-flow close action and one scrollable content region. Reduced motion keeps the same layout without the expansion animation.

#### Fallback

[Recommendation] If the optional reply service is unavailable, preserve the draft and offer manual editing or copy. State that no reply was sent.

## Quality check

The primary task can be completed with motion disabled; selected context and unfinished work survive the defined transitions; inactive surfaces cannot receive focus; buttons expose accurate state; long content does not create unintended horizontal overflow; the narrow layout keeps controls reachable; reduced motion retains the same information; and unavailable dependencies lead to an honest useful next action.

## Limits and human review

An interaction brief does not prove usability, performance or accessibility in every environment. Test the real product with representative content, devices, keyboard navigation, reduced-motion settings and assistive technology where relevant. Keep consequential actions, external communication and final product decisions with the authorised human owner.

## Edition notes

Version 1.0 packages adaptive-interface guidance for Kramaniti Kosh under the portable invocation name `$premium-ui`. It is provider-neutral and framework-neutral. It does not include application source, screenshots, credentials, private repository details or client-identifying provenance. The target brand should supply its own visual identity and interaction constraints. Compatibility and runtime behaviour have not been verified across AI providers or frontend frameworks. Formal reuse and redistribution terms have not yet been published.
