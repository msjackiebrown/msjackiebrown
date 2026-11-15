---
title: OpenWebUI with Ollama
tags:
  - ai
  - ollama
  - open-webui
  - integration
status: active
created: 2026-06-23
---

## Connection Setup

Open WebUI is designed to automatically detect and connect to a local Ollama instance running on the same host or accessible via the network.

### Automatic Connection
- Ensure the Ollama service is running.
- Open WebUI typically detects the endpoint (`http://host.docker.internal:11434` or `http://localhost:11434`) automatically.

### Troubleshooting
If the connection fails or models do not appear:
- Verify Ollama is accessible from the Open WebUI container.
- Check network configurations and firewall rules.
- Refer to [[Connection Erros in OpenWebUI]] for detailed diagnostics.

## Managing Your Ollama Instance

Administrators can manage the Ollama connection, download models, and configure settings directly within the Open WebUI interface.

### Steps to Manage
1. Navigate to **Admin Settings** in Open WebUI.
2. Go to **Connections > Ollama > Manage** (click the wrench icon).
3. From this panel, you can:
    - **Download Models:** Search and pull models directly to your Ollama instance.
    - **Configure Settings:** Adjust connection parameters and model defaults.
    - **Manage Connection:** Verify status and update endpoints if necessary.

