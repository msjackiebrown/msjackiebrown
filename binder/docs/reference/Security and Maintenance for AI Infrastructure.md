---
title: Security and Maintenance for AI Infrastructure
type: howto
status: active
created: 2026-06-08
updated: 2026-08-31
tags:
  - ai
  - security
  - maintenance
  - setup
  - homelab
  - backup
related:
  - "[[Local AI Setup Guide]]"
  - "[[AI Inference Servers — Local Network Setup]]"
  - "[[Why Self-Host Open-Source LLMs]]"
  - "[[Effective Prompting Strategies for Local LLMs]]"
---

# Security and Maintenance for AI Infrastructure

Security is part of setup, not an afterthought. Secure your stack as you build it, then keep it maintained with a simple routine. This note gives you concrete steps in the order to apply them.

## Why It Matters for Local AI

A local AI server that is exposed to your LAN is valuable to attackers: Ollama has **no built-in authentication**, custom nodes run arbitrary code, and the models themselves are large binaries. Treat your stack like any network service: least access, least privilege, encrypted backups.

## Security Practices (apply during setup)

### 1. Keep services LAN-only

- Bind services to `localhost` first, and only open them to the LAN when needed.
- To expose Ollama, set `OLLAMA_HOST=0.0.0.0` (see [[AI Inference Servers — Local Network Setup]]) and restrict the firewall to known subnets:
  ```bash
  sudo ufw allow from 192.168.1.0/24 to any port 11434 proto tcp
  ```
- Disable unused ports. The more services you run, the more they should be behind a single reverse proxy with basic auth.

### 2. Add authentication on any exposed UI

- Open WebUI and Perplexica support accounts. Enable them.
- For any service without built-in auth, front it with a reverse proxy that adds `basic_auth` or an SSO like Authelia.
- Set `OPEN_WEBUI_SECRET` for Open WebUI session tokens.

### 3. Data minimisation

- Audit uploaded documents, chat history, and logs regularly. Remove stale or sensitive data.
- Transcribed audio may contain PII. Auto-delete raw audio after successful transcription; keep only the text.
- Protect trained voice models (RVC) and biometric data with `chmod 700` on an encrypted volume.

### 4. Run services as least-privilege users

- Run ComfyUI and other long-lived services as a **dedicated non-root user** (see the systemd service in [[ComfyUI — Local Network Setup]]).
- Never mount the Docker socket (`/var/run/docker.sock`) into a container unless absolutely required, because that equals root on the host.
- Only install well-known ComfyUI custom nodes; review entry points before enabling (they are arbitrary Python).

## Maintenance Routine

- **Inventory:** Keep a local inventory of active ports, running models, and custom workflows, for example: `Ollama: localhost:11434`, `Open WebUI: localhost:3000`.
- **Version Control:** Track configuration files, prompt templates, and deployment scripts in Git.
- **Updates:** Schedule regular updates for Ollama, Open WebUI, ComfyUI, and underlying OS packages to patch vulnerabilities. Update one service at a time and test, because PyTorch / dependency changes can break inference.

## Backup Strategy

| Asset | How to back up | Frequency |
|-------|----------------|-----------|
| **Configs & Prompts** | Commit to a private Git repository. | Every change |
| **Chat history / vector DB** | Export and version-control periodically. | Weekly |
| **Model weights** | Store on a dedicated, backed-up storage volume. Restore by re-pulling from the registry instead of backing up every binary if space is tight. | Monthly (or on-demand) |
| **Cookbooks / workflows (ComfyUI JSON)** | Small text files; include in Git. | Every change |

Encrypt anything that leaves your machine (cloud backup, offsite disk). Don't sync restricted or proprietary-adjacent model weights to shared/cloud storage without verifying their licence terms.

> **Related:** [[Why Self-Host Open-Source LLMs]], [[Effective Prompting Strategies for Local LLMs]], [[Troubleshooting Local LLM Deployments]]
