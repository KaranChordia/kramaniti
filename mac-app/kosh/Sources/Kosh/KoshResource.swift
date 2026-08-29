import Foundation

enum ResourceKind: String, CaseIterable, Codable, Identifiable {
    case agent = "Agent"
    case skill = "Skill"
    case pluginGuide = "Plugin guide"
    case governance = "Governance"

    var id: String { rawValue }

    var descriptor: String {
        switch self {
        case .agent:
            return "Bounded role"
        case .skill:
            return "Repeatable method"
        case .pluginGuide:
            return "System connection"
        case .governance:
            return "Human decision boundary"
        }
    }
}

struct KoshResource: Identifiable, Hashable {
    let id: String
    let kind: ResourceKind
    let title: String
    let summary: String
    let useWhen: String
    let includes: [String]
    let format: String
    let sourcePath: String
    let version: String
    let status: String
    let body: String
}

enum KoshCatalog {
    static let resources: [KoshResource] = [
        KoshResource(
            id: "research-synthesis-agent",
            kind: .agent,
            title: "Research & synthesis agent",
            summary: "Frame a question, distinguish sources from assumptions, and return a concise decision-ready brief.",
            useWhen: "You need a reliable research pass before a decision, rather than a confident-looking answer with no trail.",
            includes: ["Role and outcome", "Source boundary", "Output contract", "Escalation rule"],
            format: "Markdown",
            sourcePath: "website/public/library/research-synthesis-agent.md",
            version: "Starter",
            status: "Starter template",
            body: body(named: "research-synthesis-agent")
        ),
        KoshResource(
            id: "workflow-diagnostic-skill",
            kind: .skill,
            title: "Workflow diagnostic",
            summary: "A repeatable method for turning a scattered process into a visible map of friction, ownership, and next moves.",
            useWhen: "A team says a process is slow or unclear, but no one has yet named where it actually breaks.",
            includes: ["Interview prompts", "Friction map", "Opportunity filter", "Human review step"],
            format: "Markdown",
            sourcePath: "website/public/library/workflow-diagnostic-skill.md",
            version: "Starter",
            status: "Starter template",
            body: body(named: "workflow-diagnostic-skill")
        ),
        KoshResource(
            id: "source-checking-skill",
            kind: .skill,
            title: "Source-checking skill",
            summary: "Keep an AI-assisted draft grounded in what is observed, what is inferred, and what still needs confirmation.",
            useWhen: "You are preparing strategy, research, or public copy where unsupported claims would create avoidable risk.",
            includes: ["Evidence labels", "Verification sequence", "Claim stop signs", "Review output"],
            format: "Markdown",
            sourcePath: "website/public/library/source-checking-skill.md",
            version: "Starter",
            status: "Starter template",
            body: body(named: "source-checking-skill")
        ),
        KoshResource(
            id: "plugin-evaluation-guide",
            kind: .pluginGuide,
            title: "Plugin evaluation guide",
            summary: "Assess a tool connection before it receives access to data, actions, or an important part of the workflow.",
            useWhen: "A new plugin looks useful, but its permissions, failure modes, and owner are not yet clear.",
            includes: ["Permission inventory", "Data boundary", "Failure path", "Approval record"],
            format: "Markdown",
            sourcePath: "website/public/library/plugin-evaluation-guide.md",
            version: "Starter",
            status: "Starter template",
            body: body(named: "plugin-evaluation-guide")
        ),
        KoshResource(
            id: "agent-brief-template",
            kind: .agent,
            title: "Agent brief template",
            summary: "Give an agent a real job: a bounded role, usable context, a named owner, and a clear handoff.",
            useWhen: "You are tempted to create an agent because it sounds impressive, rather than because a recurring job needs accountable support.",
            includes: ["Job definition", "Inputs and outputs", "Constraints", "Handoff protocol"],
            format: "Markdown",
            sourcePath: "website/public/library/agent-brief-template.md",
            version: "Starter",
            status: "Starter template",
            body: body(named: "agent-brief-template")
        ),
        KoshResource(
            id: "human-review-gate",
            kind: .governance,
            title: "Human review gate",
            summary: "A lightweight decision record for work that should pause before it changes a customer, claim, commitment, or system.",
            useWhen: "An AI-assisted workflow reaches a point where speed is less valuable than a named person making the call.",
            includes: ["Decision prompt", "Evidence needed", "Approver", "Next-state rule"],
            format: "Markdown",
            sourcePath: "website/public/library/human-review-gate.md",
            version: "Starter",
            status: "Starter template",
            body: body(named: "human-review-gate")
        )
    ]

    private static func body(named name: String) -> String {
        guard let url = Bundle.module.url(forResource: name, withExtension: "md", subdirectory: "Library"),
              let contents = try? String(contentsOf: url, encoding: .utf8) else {
            return "# Resource unavailable\n\nThe bundled source for this Kosh resource could not be read."
        }
        return contents
    }
}
