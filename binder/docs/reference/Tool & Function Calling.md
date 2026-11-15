---
tags: [concept, ai-agent, tool-calling, learning]
status: draft
---

## Core Idea
Defining executable tools via JSON schemas, parsing LLM tool-call requests, executing the corresponding functions, and feeding results back into the conversation loop.

## Key Questions to Explore
- How does the LLM signal a tool call versus a final text response?
- What fields are required in a tool definition (name, description, parameters schema)?
- How do you handle chained tool calls in a single turn?
- How do you map LLM-provided arguments to actual function parameters safely?

## Implementation Hints
- Most providers return a `tool_calls` array with `id`, `type`, and `function` objects.
- Loop: send messages → check `finish_reason` → if `tool_calls`, execute → append tool result → repeat.
- Validate arguments against the schema before execution to prevent crashes.
- Keep tool definitions consistent across turns; don't redefine them unnecessarily.

## Your Notes
<!-- Add schema examples, tool execution loop pseudocode, argument validation strategies, and provider quirks -->