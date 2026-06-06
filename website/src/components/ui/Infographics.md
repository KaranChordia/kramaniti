# Infographic UI Templates Directory

This directory contains **5 distinct infographic templates** designed to present business and operational frameworks with a premium, analytical aesthetic. 

When writing new essays/insights, future agents or writers should choose the infographic style that matches the structure and narrative flow of the post.

---

## 1. The Side-by-Side Flow (Comparative Flow)
* **Component Name**: `DisconnectedOpsInfographic`
* **Trigger String**: `[infographic:disconnected-ops]`
* **Best Used For**: Comparing a flawed, fragmented, or legacy process with a modern, unified, or optimized process.
* **Visuals**: Displays two vertical flows side-by-side:
  - **Left (The Trap)**: Uses warning/danger colors (muted red/dashed outlines) to visualize structural problems.
  - **Right (The Solution)**: Uses accent/golden gradients to show the ideal flow.
* **Selection Criteria**: Choose this when contrasting "how it is typically done poorly" vs. "how we do it correctly".

---

## 2. The Priority Pyramid (Layered Stack)
* **Component Name**: `TechStackInfographic`
* **Trigger String**: `[infographic:tech-stack]`
* **Best Used For**: Presenting a foundation-to-peak hierarchy, order of priority, or a layered process where the base layer supports the top.
* **Visuals**: A vertical stack of three blocks with decreasing widths:
  - **Base (01)**: The largest, foundational layer (highlighted in gold).
  - **Middle (02)**: The bridging operations layer.
  - **Top (03)**: The narrowest, crown layer.
* **Selection Criteria**: Choose this when explaining that certain prerequisites (like strategy or audits) must come before final steps (like selecting software or tools).

---

## 3. The Value Equation (Intersection Diagram)
* **Component Name**: `CinematicStandardInfographic`
* **Trigger String**: `[infographic:cinematic-standard]`
* **Best Used For**: Showing how two independent concepts or forces intersect or combine to produce a premium outcome.
* **Visuals**: A horizontal layout of three card modules:
  - **Card A (Left)** + **Card B (Center)** = **Card C (Right, highlighted gold)**.
  - Incorporates glassmorphic panels, icons, and subtle hover lifts.
* **Selection Criteria**: Choose this when explaining a strategic formula (e.g. `Human Taste` + `AI Scale` = `Cinematic Output`).

---

## 4. The Capability Matrix (Grid Table)
* **Component Name**: `AgenticWorkflowsInfographic`
* **Trigger String**: `[infographic:agentic-workflows]`
* **Best Used For**: Comparing two paradigms across multiple specific dimensions (e.g. speed, input type, failure modes, scale).
* **Visuals**: A clean, scrollable horizontal comparison grid/table:
  - Columns represent the two paradigms.
  - Rows represent the evaluation dimensions.
  - Highlighted column cells (in gold/subtle borders) focus attention on the modern, agentic approach.
* **Selection Criteria**: Choose this when a simple flowchart is not detailed enough, and you need to contrast technical features across 3-4 distinct criteria.

---

## 5. The Horizontal Pipeline (Process Timeline)
* **Component Name**: `SpatialAcquisitionInfographic`
* **Trigger String**: `[infographic:spatial-acquisition]`
* **Best Used For**: Showcasing a sequential pipeline, workflow loop, or lifecycle timeline.
* **Visuals**: A horizontal node chain (flex row) on desktop that stacks vertically on mobile:
  - Nodes are connected by direction arrows.
  - The final node (Step 03) is highlighted in gold to show the ultimate conversion/delivery point.
* **Selection Criteria**: Choose this for circular, feedback-oriented, or step-by-step pipeline flows (e.g. Lead ingestion -> Lead nurturing -> Conversion).

---

## 6. Tokenomics Tradeoff (Operating Economics Matrix)
* **Component Name**: `TokenomicsTradeoffInfographic`
* **Trigger String**: `[infographic:tokenomics-tradeoff]`
* **Best Used For**: Contrasting software-budget thinking with workflow-economics thinking when a post is about AI cost, usage, or operating value.
* **Visuals**: A highlighted comparison table showing how cost changes when the unit of analysis shifts from SaaS spend to end-to-end workflow performance.
* **Selection Criteria**: Choose this when the essay needs to show that AI economics depend on routing, review, and write-back logic, not only model price.

## 7. Cost Control Loop (Operating Control Spine)
* **Component Name**: `CostControlLoopInfographic`
* **Trigger String**: `[infographic:cost-control-loop]`
* **Best Used For**: Showing the operating sequence required to keep AI usage commercially efficient over time.
* **Visuals**: A four-step horizontal control spine with a highlighted final state focused on measurable write-back and retained savings.
* **Selection Criteria**: Choose this when the post explains cost control as a workflow design system rather than a standalone procurement exercise.

---

## Decision Flowchart for Content Creators

Use the following mental model to choose the template:

```
                  What is the core structure of your data?
                                     │
         ┌───────────────────────────┼───────────────────────────┐
         ▼                           ▼                           ▼
    Comparison                   Hierarchy                   Process/Flow
         │                           │                           │
 ┌───────┴───────┐                   │                   ┌───────┴───────┐
 ▼               ▼                   ▼                   ▼               ▼
Feature-by-     Workflow vs.     Foundation-to-      Step-by-Step     A + B = C
Feature Grid    Workflow         Peak Stack          Pipeline         Combination
 │               │                   │                   │               │
 ▼               ▼                   ▼                   ▼               ▼
[Matrix]       [Side-by-Side]     [Pyramid]         [Horizontal]    [Value Equation]
Template #4     Template #1       Template #2       Template #5       Template #3
```

---

## How to Add a New Post with an Infographic

1. Write the new essay object inside [insights.ts](file:///Users/karanchordia/Documents/GitHub/kramaniti/website/src/data/insights.ts).
2. Insert the trigger string (e.g. `[infographic:custom-slug]`) as a standalone item in the `content` array.
3. Open [page.tsx](file:///Users/karanchordia/Documents/GitHub/kramaniti/website/src/app/insights/%5Bslug%5D/page.tsx):
   - Import your infographic component.
   - Add a matching `if` condition in the paragraph mapping loop:
     ```tsx
     if (paragraph === '[infographic:custom-slug]') {
       return <YourInfographicComponent key={index} />;
     }
     ```
