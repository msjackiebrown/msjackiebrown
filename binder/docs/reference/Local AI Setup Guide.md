---
title: Local AI Setup Guide
type: moc
status: active
created: 2026-08-31
tags:
  - ai
  - setup
  - homelab
  - ollama
  - map-of-content
aliases:
  - Start Here Local AI
  - Local AI Setup
  - Setup Local AI
related:
  - "[[AI Inference Servers — Local Network Setup]]"
  - "[[ComfyUI — Local Network Setup]]"
  - "[[Audio Generation Stack — Local Network Setup]]"
---

# Local AI Setup Guide

This is the entry point for setting up a complete, local-first AI stack on your own hardware. Follow the phases in order. Each phase says what to do, how to verify it worked, and where to go next. Stop when you have built only the parts you need, not the whole thing.

## The Journey at a Glance

| Phase | Goal | Output | Key note |
|-------|------|--------|----------|
| 1. Decide | Confirm local AI is right for you | A clear yes/no and the scope | [[Why Self-Host Open-Source LLMs]] |
| 2. Size | Pick hardware + models that fit your budget | A hardware / model plan | [[Scaling Local AI Hardware and Software]] |
| 3. Core stack | Run a local model server + chat UI | A working chat on your LAN | [[Ollama and Open WebUI Stack]] |
| 4. Inference server | Expose the model engine to the LAN, add search + RAG | Any device can talk to the server | [[AI Inference Servers — Local Network Setup]] |
| 5. Images | Add local image generation (Stable Diffusion) | A browser-based image gen server | [[ComfyUI — Local Network Setup]] |
| 6. Audio | Add speech / music generation | TTS, STT, music on your LAN | [[Audio Generation Stack — Local Network Setup]] |
| 7. Secure + maintain | Harden, back up, keep it running | A safe, durable stack | [[Security and Maintenance for AI Infrastructure]] |
| 8. Fix | Know how to diagnose when it breaks | A working troubleshooting habit | [[Troubleshooting Local LLM Deployments]] |

## Recommended Path Through the Notes

### Phase 1 — Decide (5 min)
Read [[Why Self-Host Open-Source LLMs]]. It explains the trade-offs (privacy, cost, independence, effort). Decide whether self-hosting is worth it for you before buying anything.

### Phase 2 — Size (30 min)
Read [[Scaling Local AI Hardware and Software]]. It maps hardware tiers to the models you want to run and gives the VRAM sizing formula. Write down:
- Your hardware tier (Starter / Mid-Range / Prosumer).
- The first model you will run.
- Where the model weights will live (disk space needed).

### Phase 3 — Core stack (1 hour)
Follow [[Ollama and Open WebUI Stack]] end to end. By the end you have:
- Ollama installed and a model pulled, tested from the command line.
- Open WebUI running so you can chat in a browser.
- A working chat on the same machine (not yet exposed to the LAN).

### Phase 4 — Inference server (1-2 hours)
Follow [[AI Inference Servers — Local Network Setup]]. This turns your single-machine install into a real network service:
- Bind Ollama to the LAN, open firewall ports, verify from another device.
- Optionally add SearXNG + Perplexica for privacy search with citations, and RAG over local files.
- Optionally add a reverse proxy (Caddy) for clean URLs.

Related reference notes for this phase:
- [[SearXNG — Self-Hosted Metasearch Engine|SearXNG - Self-Hosted Metasearch Engine]]
- [[Perplexica on a Local Network]]

### Phase 5 — Images (optional, 1-2 hours)
If you want image generation, follow [[ComfyUI — Local Network Setup]]. It covers native install, Docker, downloading an SDXL model pair, exposing to the LAN, and common custom nodes.

### Phase 6 — Audio (optional, 1-3 hours)
If you want speech or music generation, follow [[Audio Generation Stack — Local Network Setup]]. It covers Piper TTS, XTTS v2 voice cloning, faster-whisper STT, MusicGen, and RVC voice conversion, with CPU vs GPU guidance.

### Phase 7 — Secure + maintain (ongoing)
Read [[Security and Maintenance for AI Infrastructure]]. Apply the network-isolation, auth, backup, and update steps that match how you exposed services.

### Phase 8 — Fix (as needed)
When something breaks, follow [[Troubleshooting Local LLM Deployments]]. It gives a bottom-up diagnostic order: runtime → API → interface → retrieval → prompts.

## Setup Order Quick Checklist

Use this as a runbook. Tick each box as you complete it.

- [x] Decided self-hosting is right for me
- [ ] Sized hardware + picked a first model
- [ ] Ollama installed and answering `ollama run <model>`
- [ ] Open WebUI up in a browser
- [ ] Ollama bound to the LAN (`OLLAMA_HOST=0.0.0.0`) and reachable from a second device
- [ ] Firewall ports open and verified
- [ ] (Optional) SearXNG + Perplexica for search/RAG
- [ ] (Optional) ComfyUI image generation
- [ ] (Optional) Audio stack (TTS / STT / music)
- [ ] Security reviewed: LAN-only, auth on exposed UIs, encrypted backups
- [ ] Maintenance schedule in place (updates + backups)

## Related Notes in This Area

- [[How to Move Ollama Models to a Different Drive]] — move model weights off your system drive (useful if disk space is the bottleneck).
- [[RAG vs Prompting vs Fine-Tuning]] — understand which technique to use once your stack is running.
- [[Effective Prompting Strategies for Local LLMs]] — get better answers from your models.

> **Note on the other files in this folder:** [[AGENTS.md Usage Guide]], [[CLAUDE.md Usage Guide]], [[Operating Rule of AI Agents]], and the paste-ready / XML files are about configuring Claude and Codex agents. They are not part of standing up the local AI runtime; skip them while setting up.
