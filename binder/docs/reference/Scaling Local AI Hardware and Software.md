---
title: Scaling Local AI Hardware and Software
type: howto
status: active
created: 2026-06-08
updated: 2026-08-31
tags:
  - ai
  - scaling
  - hardware
  - setup
  - homelab
  - performance
related:
  - "[[Local AI Setup Guide]]"
  - "[[Ollama and Open WebUI Stack]]"
  - "[[Troubleshooting Local LLM Deployments]]"
  - "[[Security and Maintenance for AI Infrastructure]]"
---

# Scaling Local AI Hardware and Software

Use this note to (1) size hardware before you start, (2) pick the models that fit that hardware, and (3) decide when to upgrade. Scale driven by measurable bottlenecks, not premature optimisation.

## Step 1 — Estimate the VRAM / RAM you need

The single most useful formula for a LLM:

```
Memory needed ≈ (params in billions) × (bytes per weight) + KV-cache overhead
```

Quantisation changes the bytes per weight:

| Quantisation | Bytes per weight | 8B model weights | 70B model weights |
|--------------|------------------|------------------|-------------------|
| fp16 | 2.0 | ~16 GB | ~140 GB |
| q8_0 | 1.0 | ~8 GB | ~70 GB |
| q4_0 / Q4 | 0.5 | ~4 GB | ~35 GB |

Add roughly 1-2 GB of KV-cache overhead for a chat model. So an 8B model at Q4 fits in ~6 GB VRAM; a 70B model at Q4 needs ~35 GB (an A100-80G) or it must offload to system RAM.

> CPU inference uses system RAM instead of VRAM. An 8B Q4 model works on a machine with 16-32 GB RAM, just slower (1-5 s per token generation).

## Step 2 — Pick your hardware tier

| Tier | CPU | RAM | GPU / VRAM | Storage | What you can run |
|------|-----|-----|------------|---------|------------------|
| **Starter** | 8-core x86-64 (AVX2) | 16-32 GB | None (CPU) or 6-8 GB | 256 GB NVMe | 7-8 B Q4 models, CPU or small GPU. Single-user experimentation. |
| **Mid-Range** | Modern 8-12 core | 32-64 GB | 12-16 GB VRAM | 1 TB NVMe | 8-70 B models (Q4), moderate concurrency, longer context. |
| **Prosumer/Server** | 12+ core (Ryzen 9 / Xeon) | 64+ GB | 24 GB+ VRAM (e.g. RTX 4090, A100) | 1-4 TB NVMe + separate backup | Multi-user, large context, 70B+ models, RAG, ComfyUI + audio stack together. |

### Image generation (ComfyUI) sizing note

Image diffusion is VRAM-hungrier than LLM text inference. See [[ComfyUI — Local Network Setup]] for the exact model table. Rough guide: SD 1.5 fits in ~4-6 GB, SDXL in ~8-12 GB, Flux-dev needs ~22-26 GB.

### Audio stack sizing note

Audio models are much lighter. Piper TTS runs on any CPU; faster-whisper STT fits in 2-8 GB; XTTS voice cloning wants ~4-8 GB VRAM. See [[Audio Generation Stack — Local Network Setup]].

## Step 3 — Pick models that fit

Rule of thumb when choosing a model:

- Start at **8B class** (e.g. `llama3.1:8b`, `qwen2.5:7b`, `phi3:mini`). Good speed/quality for most home use.
- Go **smaller** when speed matters or hardware is tight (`phi3:mini`, `qwen2.5:3b`).
- Go **larger** only when you need quality and have the memory (8B-Q4 ~6 GB VRAM fits 24 GB cards easily; step up to 70B only with 40 GB+).

Use quantised variants (`q4`, `q8`) to fit a bigger model into less memory at a small quality cost.

## Scaling Triggers (when to upgrade)

- **Latency:** Inference times exceed acceptable thresholds for concurrent users.
- **Concurrency:** Current hardware cannot handle simultaneous requests or RAG indexing.
- **Storage:** Model weights and vector databases outgrow available disk space.

## Scaling Strategy

- **Software First:** Optimise prompts, chunking, and model selection before upgrading hardware. A smaller quantised model with a good prompt often beats a bigger model with a vague prompt.
- **Modular Upgrades:** Replace components incrementally (GPU, RAM, storage) rather than full stack replacements. Add a dedicated model drive before buying a new GPU (see [[How to Move Ollama Models to a Different Drive]]).
- **Stop Scaling When:** Complexity becomes a maintenance burden disguised as ambition. Shared access requires strict data separation and support overhead.

> **Related:** [[Ollama and Open WebUI Stack]], [[Troubleshooting Local LLM Deployments]], [[Security and Maintenance for AI Infrastructure]]
