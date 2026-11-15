---
title: Troubleshooting Local LLM Deployments
tags:
  - ai
  - troubleshooting
  - ollama
  - open-webui
  - homelab
created: 2026-06-08
---
# Troubleshooting Local LLM Deployments

Diagnosing issues in a self-hosted AI stack requires a bottom-up approach: Model Runtime → API → Interface → Retrieval → Prompts.

## Common Issues & Fixes

| Issue | Likely Cause | Fix |
| :--- | :--- | :--- |
| **Model won't load** | VRAM exhaustion / Incorrect format | Switch to a smaller model, verify quantization, check free VRAM. |
| **API running but no response** | Backend initialization delay / Port mismatch | Confirm backend status, test endpoint locally via `curl`. |
| **RAG answers irrelevant** | Poor chunking / Noisy documents / Vague prompt | Clean document set, adjust chunk size, refine retrieval query. |
| **Hallucinating** | Prompt encourages false confidence / Thin context | Explicitly permit uncertainty ("Say if not supported"). |

## Diagnostic Workflow
1. **Verify Runtime:** Check Ollama logs for model loading errors.
2. **Test API:** Use a simple `curl` request to the Ollama endpoint.
3. **Check Interface:** Ensure Open WebUI is correctly pointing to the API URL.
4. **Audit Retrieval:** Inspect document chunks and vector embeddings for noise.
5. **Refine Prompts:** Adjust system prompts to enforce grounding and format.

> **Related:** [[Ollama and Open WebUI Stack]], [[Scaling Local AI Hardware and Software]]