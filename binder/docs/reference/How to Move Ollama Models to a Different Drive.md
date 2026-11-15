---
title: How to Move Ollama Models to a Different Drive
type: recipe
path: 00_Inbox/How to Move Ollama Models to a Different Drive.md
created: 2026-06-24
updated: 2026-08-31
tags:
  - ollama
  - linux
  - systemd
  - homelab
  - recipe
related:
  - "[[Ollama and Open WebUI Stack]]"
  - "[[Scaling Local AI Hardware and Software]]"
status: active
---

# How to Move Ollama Models to a Different Drive

Use this when model weights are filling your system drive and you want them on a secondary drive. Do this as part of sizing storage in [[Scaling Local AI Hardware and Software]].

> Driven by the **storage** scaling trigger: when model weights outgrow available disk space, move them to a bigger drive instead of buying a new machine.

## Prerequisites

- Root access to the system.
- A secondary drive mounted and accessible.

## Steps

### 1. Stop Ollama Service

Ensure Ollama is not running to prevent file locks.

```bash
sudo systemctl stop ollama
```

### 2. Move Models Directory

Move the existing models to the new location.

```bash
sudo mv /usr/share/ollama/.ollama/models /path/to/new/drive/models
```

### 3. Configure Systemd Override

Create a systemd override to set the new environment variable.

```bash
sudo systemctl edit ollama.service
```

Add the following configuration:

```ini
[Service]
Environment="OLLAMA_MODELS=/path/to/new/drive/models"
Environment="OLLAMA_NUM_GPU=70"
```

> [!NOTE]
> Replace `/path/to/new/drive/models` with your actual path.

### 4. Reload and Start Service

Apply changes and restart Ollama.

```bash
sudo systemctl daemon-reload
sudo systemctl start ollama
```

## Verification

Check the service status to ensure it started correctly.

```bash
sudo systemctl status ollama
```

Then confirm Ollama finds the moved models from the new location:

```bash
ollama list
```

If your previously installed models still appear, the move worked. You can then free the old directory.

## Related

- [[Ollama and Open WebUI Stack]] — the stack whose models you are relocating
- [[Scaling Local AI Hardware and Software]] — storage sizing
