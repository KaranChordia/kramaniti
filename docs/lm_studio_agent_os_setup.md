# LM Studio Agent OS Setup

**Purpose:** Explain how to run Kramaniti Studio's Agent OS against a local model served by LM Studio.

**Key Findings:** [Recommendation] Keep the Kramaniti Studio workflow local-first. Let LM Studio run the local model server, then have the Studio backend bridge call the OpenAI-compatible localhost endpoint while preserving founder approval gates.

**Evidence:** LM Studio Developer docs describe starting the server from the Developer tab, using `lms server start`, and calling OpenAI-compatible endpoints such as `/v1/models` and `/v1/chat/completions`.

**Interpretation:** [Inference] The frontend should not try to launch LM Studio itself. It can test and use the local server through Kramaniti Studio's localhost-only bridge after the founder starts LM Studio.

## References

- LM Studio Developer overview: `https://lmstudio.ai/docs/developer`
- LM Studio local server guide: `https://lmstudio.ai/docs/developer/core/server`
- LM Studio OpenAI compatibility: `https://lmstudio.ai/docs/developer/openai-compat`
- LM Studio chat completions endpoint: `https://lmstudio.ai/docs/developer/openai-compat/chat-completions`

**Implications:** No API keys, credentials, or private client data should be committed to this repository. Local model settings may live in browser storage, but real secrets should stay outside repo files.

**Open Questions:** Should this local bridge later gain audit logs, permissions, and saved conversations?

**Next Steps:** Use the checklist below before running agent prompts from `/studio`.

---

## Recommended Local Flow

1. Install and open LM Studio.
2. Download and load a chat-tuned model that fits the Mac's memory. Current local default: Nemotron 3 Nano 4B.
3. In LM Studio, open the Developer tab.
4. Start the local server.
5. Confirm the base URL. The common OpenAI-compatible base URL is:

```text
http://127.0.0.1:1234/v1
```

6. Copy the loaded model identifier from LM Studio. Current local default:

```text
nvidia/nemotron-3-nano-4b
```

7. Open Kramaniti Studio locally at:

```text
http://localhost:3000/studio/
```

For a hosted static build that uses the public base path, the equivalent public route may be `/kramaniti/studio/`.

8. Switch to Agents, then open the LM Studio tab.
9. Enter the base URL and model identifier.
10. Run Test Server.
11. If models load, send a prompt through the selected agent.

The Studio frontend calls `/api/studio/lm-studio/models/` and `/api/studio/lm-studio/chat/`. Those route handlers then call LM Studio at the localhost base URL, which avoids browser CORS issues and keeps the bridge limited to local inference.

## Optional CLI Flow

LM Studio also supports starting the local server through its CLI:

```bash
lms server start
```

Use the GUI Developer tab first if you are new to this workflow. The website cannot start the GUI server for you; it can only call the server once it is running.

## OpenAI-Compatible Calls

List models:

```bash
curl http://127.0.0.1:1234/v1/models
```

Chat completion:

```bash
curl http://127.0.0.1:1234/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "nvidia/nemotron-3-nano-4b",
    "messages": [
      {
        "role": "system",
        "content": "You are the Kramaniti Digital Presence Orchestrator. Strategy before tools. Systems before scale. Content after clarity."
      },
      {
        "role": "user",
        "content": "Plan the next digital presence task."
      }
    ],
    "temperature": 0.4
  }'
```

## Governance Rules

- Do not send private client data to any model unless the founder explicitly approves it.
- Do not let the local model publish directly.
- Do not let the local model invent client proof, metrics, testimonials, or outcomes.
- Keep public claims behind Proof and Governance review.
- Keep pricing, contracts, paid accounts, credentials, and external commitments human-approved.

## Later Backend Option

[Recommendation] The current version uses a minimal local-only Studio bridge for model calls. A fuller backend should be added only when Kramaniti needs saved conversations, durable audit logs, permissioned agent actions, or shared team access.
