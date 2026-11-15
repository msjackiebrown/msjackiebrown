---
title: "AI Inference Servers — Local Network Setup"
type: reference-howto
status: active
created: 2026-08-31
tags:
  - ai-inference
  - selfhosting
  - ollama
  - docker
  - homelab
related:
  - "[[Why Self-Host Open-Source LLMs]]"
  - "[[Perplexica on a Local Network]]"
  - "[[SearXNG — Self-Hosted Metasearch Engine|SearXNG - Self-Hosted Metasearch Engine]]"
---

# AI Inference Servers — Local Network Setup

## What Is an AI Inference Server?

An **AI inference server** is a dedicated machine (or container) that loads one or more large language models into memory and serves them over HTTP/WebSocket to clients on your network. Unlike training, *inference* means the model is already trained — you're just running forward passes to generate text, embeddings, or other outputs.

| Aspect | Cloud API (OpenAI, Anthropic) | Local Inference Server |
|--------|-------------------------------|------------------------|
| Data leaves your network? | Yes | **No** |
| Cost model | Per-token / per-request | Electricity + amortised hardware |
| Rate limits | Vendor-imposed | None (bounded by GPU/CPU) |
| Model choice | Curated list of vendors' models | Any open-weights model you can fit in RAM/VRAM |
| Latency (first token) | 200–800 ms + network RTT | 50–300 ms on local GPU; 1–5 s on CPU-only |
| Uptime dependency | Vendor SLA | Your hardware + power supply |

In practice, a "server" can be as simple as one laptop running Ollama, or a rack-mounted box with an A100 serving vLLM to dozens of internal users. The architecture is the same: **model weights → inference engine → HTTP API → clients**.

---

## Hardware Considerations

### Minimum viable (CPU-only)

| Component | Spec | Notes |
|-----------|------|-------|
| CPU | 8-core x86-64, AVX2/AVX-512 | AVX-512 gives ~30 % speedup on llama.cpp / Ollama |
| RAM | 32 GB DDR4/DDR5 | Fits 7–8 B models at Q4 quantisation with headroom for OS + embeddings |
| Storage | 256 GB NVMe (SSD) | Model files are large; SSD avoids multi-second load times on cold start |

### Recommended (GPU-accelerated)

| Component | Spec | Notes |
|-----------|------|-------|
| GPU | NVIDIA RTX 4090 / A100 / L40S (24 GB+ VRAM) | CUDA is the most mature path; AMD ROCm works with Ollama ≥ 0.3 and vLLM |
| RAM | 64 GB DDR5 | Offload layers to system RAM if model > VRAM |
| CPU | Ryzen 9 / Xeon, 12+ cores | Handles tokenisation, KV-cache management, concurrent requests |
| Storage | 1 TB NVMe (RAID-0 or single) for models + swap headroom | A 70 B Q4 model ≈ 40 GB; keep room for several variants |

### Sizing rule of thumb

```
VRAM needed ≈ params × bytes_per_weight + KV_cache_overhead
             e.g. 8B × 0.5 (Q4) = ~4 GB weights + ~1–2 GB KV → fits in 6 GB VRAM
                70B × 0.5      = ~35 GB weights → needs A100-80G or offload to RAM
```

---

## Inference Engine Options (Comparison)

| Engine | Best for | API style | Multi-model? | GPU support | Notes |
|--------|----------|-----------|--------------|-------------|-------|
| **Ollama** | Simplicity, single-user / small team, mixed CPU+GPU | OpenAI-compatible REST + native `/api/chat` | Yes (load/unload on demand) | CUDA, ROCm, Metal (macOS) | Easiest to start; systemd service; `ollama pull` one-liner. **Recommended default for home use.** |
| **vLLM** | High-throughput serving, PagedAttention batching | OpenAI-compatible REST + streaming SSE | Yes (one model per instance typically) | CUDA, ROCm | Best tokens/sec on a single GPU; more complex to configure. Good if you need 10+ concurrent users. |
| **llama.cpp / llama-server** | Maximum control, exotic hardware (Apple Silicon, AMD, CPU-only) | OpenAI-compatible REST + WebSocket | One model per process (run multiple instances) | CUDA, Vulkan, Metal, SYCL | The "engine under the hood" of Ollama. Use directly if you need custom quantisation or threading flags. |
| **Text Generation Inference (TGI)** — HF | Production-grade HuggingFace ecosystem integration | OpenAI-compatible + native `/generate` streaming | One model per instance | CUDA, ROCm | Heavier; designed for multi-tenant GPU clusters. Overkill for a home lab unless you're running 70 B+ models with continuous batching. |
| **LM Studio** (GUI) | Non-developers, quick experimentation | Local REST server + desktop UI | Yes (manual switch) | CUDA, Metal, CPU | Windows/macOS GUI wrapper around llama.cpp. Not ideal as a headless network service. |

> **For a home / small-office LAN: Ollama is the right default.** It handles model loading/unloading automatically, exposes an OpenAI-compatible API for drop-in compatibility with any client (Perplexica, Open WebUI, custom scripts), and runs as a simple systemd service or Docker container.

---

## Recommended Local-Network Stack

```
┌─────────────────────────── LAN ───────────────────────────────┐
│                                                               │
│  Clients (browsers, phones, scripts)                           │
│       │                                                       │
│       ▼                                                       │
│  ┌─────────────┐   :3000    ┌──────────────┐                 │
│  │ Perplexica  │◄──────────►│ perplexica-  │                 │
│  │ (frontend)  │            │ backend      │ :3001           │
│  └─────────────┘            └──────┬───────┘                 │
│                                    │                          │
│       ┌────────────────────────────┼──────────────────┐       │
│       ▼                            ▼                  ▼       │
│  ┌─────────┐              ┌──────────────┐   ┌───────────┐  │
│  │ Ollama  │ :11434      │ SearXNG     │   │ Open WebUI│  │
│  │ (inference)           │ :8888       │   │ :3002     │  │
│  └─────────┘              └──────────────┘   └───────────┘  │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

| Service                             | Port (LAN)                    | Role                                                                                                                               | Required?                                                |
| ----------------------------------- | ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| **Ollama**                          | 11434                         | LLM inference + embeddings. The "brain."                                                                                           | ✅ Yes — core engine                                      |
| **Perplexica** (frontend + backend) | 3000 / 3001                   | AI-powered search with citations, RAG over local files, chat UI. Uses Ollama for generation and SearXNG for retrieval.             | Recommended if you want Perplexity-style answers offline |
| **SearXNG**                         | 8888 (internal) or 8080 (LAN) | Privacy metasearch backend that feeds results to Perplexica / your scripts.                                                        | Required by Perplexica; optional standalone              |
| **Open WebUI**                      | 3002                          | Polished chat UI with multi-user support, file upload/RAG, model switching. Alternative or complement to Perplexica's built-in UI. | Optional — nice for non-technical family members         |
| **Caddy / Nginx** (reverse proxy)   | 443 / 80                      | TLS termination, clean domain names (`ai.home.lan`), optional basic-auth.                                                          | Recommended once more than one service is exposed        |

---

## Setup: Ollama as the Inference Server

### Option A — Native install (simplest for a dedicated box)

```bash
# 1. Install
curl -fsSL https://ollama.com/install.sh | sh

# 2. Expose to LAN (default is 127.0.0.1 only)
sudo systemctl edit ollama.service
```

Add:

```ini
[Service]
Environment="OLLAMA_HOST=0.0.0.0"
Environment="OLLAMA_MAX_LOADED_MODELS=2"   # keep two models hot in VRAM/RAM
# Optional: cap memory to avoid OOM on a shared box
# Environment="OLLAMA_KV_CACHE_TYPE=q8_0"
```

```bash
sudo systemctl daemon-reload && sudo systemctl restart ollama

# 3. Pull your first model (pick one that fits your VRAM/RAM)
ollama pull llama3.1:8b-instruct-q6_K      # ~6.7 GB, great quality/speed balance
ollama pull jina/jina-embeddings-v2-base-en:latest   # embeddings for RAG

# 4. Verify from another LAN machine
curl http://<server-ip>:11434/api/tags | jq .models[].name
```

### Option B — Docker (if you want everything in one compose file)

```yaml
# docker-compose.yml  (inference + search + UI, single host)
services:
  ollama:
    image: ollama/ollama:latest
    container_name: ollama
    restart: unless-stopped
    ports:
      - "11434:11434"          # expose to LAN for Perplexica / Open WebUI / scripts
    volumes:
      - ./models:/root/.ollama  # persist model weights across container rebuilds
    environment:
      - OLLAMA_HOST=0.0.0.0
      - OLLAMA_MAX_LOADED_MODELS=2
    deploy:
      resources:
        reservations:
          devices:              # GPU passthrough (NVIDIA)
            - driver: nvidia
              count: all        # or "1" if you have multiple GPUs and want to split workloads
              capabilities: [gpu]

  searxng:
    image: searxng/searxng:latest
    container_name: searxng
    restart: unless-stopped
    ports:
      - "8080:8080"            # LAN access (or keep internal-only)
    volumes:
      - ./searxng-config:/etc/searxng

  perplexica-frontend:
    build:
      context: ./Perplexica
      dockerfile: app.dockerfile
      args:
        - NEXT_PUBLIC_API_URL=http://192.168.1.50:3001/api
        - NEXT_PUBLIC_WS_URL=ws://192.168.1.50:3001
    ports:
      - "3000:3"
    extra_hosts: ["host.docker.internal:host-gateway"]

  perplexica-backend:
    build:
      context: ./Perplexica
      dockerfile: api.dockerfile
    ports:
      - "3001:80"
    environment:
      - OLLAMA_BASE_URL=http://ollama:11434   # internal Docker DNS name (no host-gateway needed)
      - SEARXNG_URL=http://searxng:8080       # internal DNS → SearXNG container
    extra_hosts: ["host.docker.internal:host-gateway"]

  open-webui:                  # optional chat UI for non-technical users
    image: ghcr.io/open-webui/open-webui:main
    container_name: open-webui
    restart: unless-stopped
    ports:
      - "3002:8080"            # LAN port 3002 → Open WebUI internal 8080
    environment:
      - OLLAMA_BASE_URL=http://ollama:11434   # same Docker network, no host-gateway needed
    volumes:
      - ./open-webui-data:/app/backend/data

volumes: {}                    # all data in bind-mounts above for easy backup
```

> **Tip:** When services are on the **same Docker Compose network**, use the service name as hostname (`http://ollama:11434`, `http://searxng:8080`). You only need `host.docker.internal` when a container must reach something running *outside* Docker (e.g., Ollama installed natively on the host).

### Start everything

```bash
docker compose up -d --build   # first run (builds Perplexica images)
docker compose ps              # confirm all "running"
```

---

## Exposing Services on the LAN — Checklist

| Step | Command / Config | Why |
|------|-----------------|-----|
| Bind to `0.0.0.0` (or specific LAN IP) in each service config | Ollama: `OLLAMA_HOST=0.0.0.0`; SearXNG: `bind_address: "0.0.0.0"`; Perplexica/Open WebUI: Docker port mapping already does this | Default is loopback-only — nothing reachable from other machines without this |
| Open firewall ports (if UFW / firewalld active) | `sudo ufw allow 11434/tcp && sudo ufw allow 3000,3001,8080,3002/tcp` | Docker's iptables rules may be bypassed by a host firewall |
| Verify from another device | `curl http://<server-ip>:11434/api/version` → `{"version":"..."}`; browser to each UI port | Confirms routing + binding are correct end-to-end |
| (Optional) Reverse proxy with TLS + auth | Caddy / Nginx on 80/443, `reverse_proxy` to internal ports | Clean URLs (`ai.home.lan`), HTTPS for mobile browsers, optional basic-auth gatekeeper |

### Example: Caddy reverse-proxy config

```caddyfile
# /etc/caddy/Caddyfile (or include in your existing one)

ai.home.lan {
    # Ollama API + WebSocket streaming
    handle /api/*  { reverse_proxy ollama:11434 }
    handle /v1/*   { reverse_proxy ollama:11434 }   # OpenAI-compatible path

    # Perplexica (frontend + backend)
    handle_path /perplexica/api/* { reverse_proxy perplexica-backend:80 }
    handle_path /perplexica/ws*   { reverse_proxy perplexica-backend:80 }
    handle_path /perplexica/*     { reverse_proxy perplexica-frontend:3 }

    # Open WebUI
    handle_path /chat/*           { reverse_proxy open-webui:8080 }

    # SearXNG (optional direct access)
    handle_path /search/*         { reverse_proxy searxng:8080 }
}
```

> Adjust `handle_path` prefixes to match the `NEXT_PUBLIC_*` build args in Perplexica's compose file. Rebuild after changing them.

---

## Complementary Services Worth Installing Alongside

| Service | Purpose | Install (Docker) | Port |
|---------|---------|-----------------|------|
| **Open WebUI** | Multi-user chat UI, file upload → RAG, model switching, conversation history in SQLite/Postgres. Great for non-technical family members who just want a "ChatGPT-like" box. | `ghcr.io/open-webui/open-webui:main` | 3002 (→8080) |
| **SearXNG** | Privacy metasearch; feeds Perplexica and any custom retrieval scripts. See [[SearXNG — Self-Hosted Metasearch Engine|SearXNG - Self-Hosted Metasearch Engine]]. | `searxng/searxng:latest` | 8080 (→80) |
| **Perplexica** | AI search with citations, local-file RAG, academic/YouTube/Reddit source filtering. See [[Perplexica on a Local Network]]. | Build from repo (2 containers) | 3000 / 3001 |
| **Ollama Web Dashboard** *(community)* | Lightweight web UI to manage models, view GPU usage, pull/delete weights without CLI. | `ghcr.io/ollama-web-dash/ollama-web-dashboard:latest` (or similar) | 8765 |
| **Prometheus + Grafana** *(optional)* | Monitor token throughput, VRAM utilisation, request latency across Ollama / vLLM endpoints. Ollama exposes `/api/metrics` in recent versions; scrape with a textfile collector or the `ollama_exporter`. | Standard Prometheus stack | 9090 / 3001 (Grafana) |
| **Tailscale** *(optional)* | Securely reach your inference server from outside the LAN without port-forwarding. Each device gets a stable Tailscale IP; no public exposure. | `tailscaled` on host + clients | N/A (overlay network) |

---

## Monitoring & Maintenance

### Health checks (add to cron or a simple script)

```bash
#!/usr/bin/env bash
# /opt/ai-stack-health.sh — run every 5 min via systemd timer or cron

SERVER="192.168.1.50"
declare -A SERVICES=(
  ["Ollama"]      = "http://$SERVER:11434/api/version"
  ["Perplexica"]  = "http://$SERVER:3001/"
  ["SearXNG"]     = "http://$SERVER:8080/healthz"
  ["Open WebUI"]  = "http://$SERVER:3002/health"
)

for name in "${!SERVICES[@]}"; do
  code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 10 "${SERVICES[$name]}")
  if [[ "$code" != "200" && "$code" != "302" ]]; then
    echo "[ALERT] $name returned HTTP $code at $(date)" | mail -s "AI Stack Alert: $name down" admin@home.lan
  fi
done

# GPU check (NVIDIA)
nvidia-smi --query-gpu=utilization.gpu,memory.used,memory.total,temperature.gpu --format=csv,noheader >> /var/log/ai-stack/gpu.log
```

### Model management routine

| Task | Command | Frequency |
|------|---------|-----------|
| Check loaded models & VRAM usage | `ollama ps` | Ad-hoc |
| Pull a new model variant to A/B test quality vs speed | `ollama pull llama3.1:8b-instruct-q8_0` | When experimenting |
| Remove unused models (frees disk + RAM) | `ollama rm qwen2:7b-instruct-q4_0` | Monthly cleanup |
| Update Ollama binary / Docker image | `curl -fsSL https://ollama.com/install.sh \| sh` **or** `docker compose pull ollama && docker compose up -d ollama` | When a new release is tagged (check GitHub) |
| Back up model weights + config | `rsync -avz ~/models/ backup-server:~/ai-models/` or include in your restic/borg job | Weekly / after each new pull |

### Keeping models "hot" vs. cold-loading

- Ollama unloads a model from VRAM/RAM after ~5 min of idle by default (`OLLAMA_KEEP_ALIVE=5m`).
- If you want 2–3 models always resident (e.g., chat + embedding), set `OLLAMA_MAX_LOADED_MODELS=3` and keep-alive high:

```ini
Environment="OLLAMA_KEEP_ALIVE=-1"   # never unload (use only if RAM/VRAM is plentiful)
```

- Trade-off: more models loaded = less VRAM available for KV-cache on the active model → slower generation under load. Tune per your hardware.

---

## Security Considerations (LAN Context)

| Risk | Mitigation |
|------|-----------|
| Ollama has **no built-in auth** — anyone who can reach port 11434 can generate tokens and consume GPU cycles. | Keep it LAN-only; add a reverse-proxy `basic_auth` or Authelia if the network includes untrusted devices (IoT, guest Wi-Fi). Firewall: allow only known subnets to 11434. |
| Model weights are large and proprietary-adjacent (some have usage restrictions). | Store on encrypted volume (`LUKS`) or at minimum restrict filesystem permissions (`chmod 700 ~/models`). Don't sync to cloud backup without encryption. |
| Perplexica / Open WebUI store conversation history locally (SQLite/Postgres) which may contain sensitive queries. | Back up with encryption; set `OPEN_WEBUI_SECRET` env var for session tokens; restrict port access if multi-user. |
| Docker socket exposure (`/var/run/docker.sock`) in a container = root on host. | Never mount the Docker socket into Perplexica / Open WebUI containers unless absolutely necessary (e.g., Ollama dashboard). Use dedicated API endpoints instead. |

---

## Quick-Start TL;DR (Copy-Paste)

```bash
# 1. Install Ollama natively (or use the compose file above for all-in-Docker)
curl -fsSL https://ollama.com/install.sh | sh
sudo systemctl edit ollama.service   # add OLLAMA_HOST=0.0.0.0, daemon-reload, restart

# 2. Pull a chat model + embedding model
ollama pull llama3.1:8b-instruct-q6_K
ollama pull jina/jina-embeddings-v2-base-en:latest

# 3. Verify from another machine on the LAN
curl http://<server-ip>:11434/api/tags | jq .models[].name

# 4. (Optional) Add Perplexica + SearXNG via docker compose — see [[Perplexica on a Local Network]]
# 5. (Optional) Add Open WebUI for a polished chat UI:
docker run -d --name open-webui \
  -p 3002:8080 \
  -e OLLAMA_BASE_URL=http://<server-ip>:11434 \
  -v ./open-webui-data:/app/backend/data \
  ghcr.io/open-webui/open-webui:main

# Done. Point any browser on the LAN to http://<server-ip>:3002 (Open WebUI) or :3000 (Perplexica).
```

---

## Related Notes

- [[Why Self-Host Open-Source LLMs]] — motivations and trade-offs
- [[Perplexica on a Local Network]] — AI search frontend setup
- [[SearXNG — Self-Hosted Metasearch Engine|SearXNG - Self-Hosted Metasearch Engine]] — privacy metasearch backend
```