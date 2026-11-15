---
type: project
status: active
phase: build             # design | build | ship
created: 2026-07-12
modified: 2026-11-06
effort:
local-first: true
tags:
  - software
  - local-first
  - ai-agents
---

**Repo:** [Binder](https://dev.gitea.msjackiebrown.net/msjackiebrown/binder) · **Issues:** [Binder Issues](https://dev.gitea.msjackiebrown.net/msjackiebrown/binder/issues) · **Docs:** [Wiki](https://dev.gitea.msjackiebrown.net/msjackiebrown/binder/wiki/?action=_pages)

# 🚀 Binder

## 🎯 What It Does
A study pipeline that does what Google NotebookLM does — ingest my documents, ground answers in them, cite the source — but runs entirely on my workstation. No subscription, no 50-note ceiling, no documents leaving the machine.

The design constraint that shapes everything else: **local inference is expensive, so it is reserved for reasoning only.** Parsing, chunking, retrieval, and storage are handled by lightweight non-LLM tools; the LLM sees only the assembled context and generates the answer.

## 🗺️ Shape of the System


 Would like to use mermaid for these diagrams: https://mermaid.js.org/intro/syntax-reference.html
```
[PDF / DOCX / TXT / MD / URL / pasted text]
        │
   Parse ──→ Chunk ──→ Ollama Embed ──→ ChromaDB (one per binder)
                                             ▲
[User Question] ──→ Embed Query ──→ Cosine Top-k Search
                                             │
        Context Assembly + Citation Map ─────┘
                     │
        Ollama Generation (SSE stream) ──→ Bootstrap UI (Flask-served)
```

> **v1 scope (SRS v3.0):** PDF, DOCX, TXT, MD, URL, pasted text. Audio/video/YouTube/PPTX/CSV are the explicit deferred backlog — they are not v1 components.

## 🧩 Components

> Legend: ✅ note exists in vault · ⬜ note **needs creating** · 🔗 consolidation candidate (scattered notes exist, no top-level note)

| Component                    | Job it does                                                                    | Library / tech                                                            | Note                                                                                                   |
| ---------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Inference + embedding engine | Runs generation and text embedding locally; streams tokens over HTTP           | Ollama (`qwen3:14b`, quality `qwen3.5:27b`, embed `qwen3-embedding:0.6b`) | 🔗 [[Ollama]] — top-level note needs creating; merge [[Use Ollama with Python\|Use Ollama and Python]], [[Download and Use OLLAMA]], [[Ollama and Open WebUI Stack]] |
| Orchestration                | LCEL chains wrapping Ollama's embed/generate endpoints                          | LangChain                                                                 | ✅ [[LangChain]] (`03_Resources/Ollama & LLMs/Langchain/`)                                             |
| Vector store                 | One ChromaDB per binder (PersistentClient), cosine, persists with the binder   | ChromaDB                                                                  | ⬜ [[ChromaDB]] — needs creating; related: ✅ [[Vector Databases - Tool Comparison]], ✅ [[How to Choose a Vector Database for RAG]], [[Binder - Vector Database Selection|Vector DB Selection (Binder)]] |
| Retrieval logic              | Embeds the query, pulls top-k, assembles prompt, maps citations back to files  | Custom (`query_service`)                                                  | ⬜ [[RAG Architecture]] — needs creating; closest existing: ✅ [[RAG Pipelines MOC]], ✅ [[RAG Pipeline Overview]] |
| Web server                   | Routing, static asset serving, SSE streaming, background ingest jobs           | Flask (Python)                                                            | ⬜ [[Flask]] — needs creating                                                                           |
| Frontend                     | Bookshelf home, binder sources+chat panes, toasts, streaming render            | Bootstrap 5 (HTML/CSS/JS) + vanilla JS                                    | ⬜ [[Bootstrap]] — needs creating; design: [[Binder - Blueprint - Wireframe Spec]]                     |
| Schemas & config             | `.env` settings via pydantic-settings; no hardcoded config                     | Pydantic / pydantic-settings                                              | ⬜ [[Pydantic]] — needs creating                                                                        |
| Document parsing             | Text extraction across PDF, DOCX, and HTML                                     | PDFPlumber, python-docx, BeautifulSoup                                    | ⬜ [[PDFPlumber]] · ⬜ [[python-docx]] · ⬜ [[BeautifulSoup]] — all need creating                       |
| Chunking                     | Paragraph-aware recursive splits, 1000 chars / 200 overlap                     | LangChain `RecursiveCharacterTextSplitter`                                | ✅ [[Chunking Strategies for RAG]] (`03_Resources/Search & RAG/`)                                       |
| Test harness                 | Route and service validation; Ollama/ChromaDB mocked offline                   | pytest                                                                    | ⬜ [[pytest]] — needs creating                                                                          |

**Deferred (v2/v3 backlog — deliberately not v1 components):** faster-whisper + ffmpeg (audio), Playwright (JS pages), openpyxl / python-pptx (tables/slides), ReportLab (PDF fixtures).

## 🔀 The Main Flow

**Ingest**
1. File/URL/text lands via the Bootstrap upload form (Flask) → `Source` row created with status `pending`.
2. Dispatcher routes by extension to the matching parser; URL content is extracted via BeautifulSoup (main content only).
3. Parsed text is chunked via `RecursiveCharacterTextSplitter` (1000 / 200).
4. Chunks go to Ollama's embedding endpoint in batches.
5. Vectors land in the binder's ChromaDB; citation metadata is written back to the `Source` row. A copy of each source file is retained under the binder's `inputs/` folder.

**Query**
6. User sends a question from the chat pane (Flask → SSE endpoint).
7. Query is embedded with the same model used at ingest — this has to match or retrieval silently degrades (mismatch is refused, FR-006).
8. Cosine top-k pulled from the binder's collection.
9. Context assembled, citation map built (`[1]` → `Source#page/chunk`).
10. Prompt sent to Ollama; response streamed back token-by-token over SSE to the browser; **Stop** keeps the partial answer.
11. Citations render as inline `[n]` markers — click expands the exact quote + filename + page/chunk (quote-is-proof).

## 🗃️ Data Model

> Model follows [[Binder - Blueprint - How to Create a Binder]]: **binder → sections (nestable) → sources**. "Notebook" terminology from v2.x is retired.

| Entity                 | Holds                                                                                       | Lives in                                                              |
| ---------------------- | ------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| Binder                 | Container for a set of sources; title, description, timestamps                              | SQLite + own directory `Name_Binder/`                                 |
| Section                | Nestable grouping of sources (the "dividers")                                               | SQLite (tree under binder)                                            |
| Source                 | Uploaded file reference, origin (file/URL/paste), section, status, citation metadata        | SQLite; **file copy retained in `Name_Binder/inputs/`**              |
| Conversation / Message | Chat thread, role, content, citations used, style (Default / Learning Guide)                | SQLite                                                                |
| Chunk embeddings       | Text + vector + back-reference to `Source`                                                  | **ChromaDB, one per binder** (`Name_Binder/.chromaDB`)               |

*The split matters for backup and reset: wiping a binder's ChromaDB kills retrieval but keeps the binder's metadata; deleting a binder cascades to its sections, sources, conversations, and ChromaDB (confirmation dialog required, FR-001).*

## 🔌 Interfaces

- **User touches:** the browser UI (Bootstrap, served by Flask) — bookshelf home, binder sources + chat, settings. See [[Binder - Blueprint - Wireframe Spec]].
- **Internal contracts:** JSON API + SSE for streaming; `query_service` streams from Ollama rather than buffering.
- **Externally reachable:** the Flask app. Local-first mandate says bind to `127.0.0.1` by default and require an explicit flag to expose it on the LAN.
- **Runtime prerequisites:** Ollama must already be running at its base URL (default `ai-lab:11434`); FFmpeg on PATH is only needed once media ingestion lands in v3.

## 📋 Design Decisions

| Date | Decision | Why | Rejected because |
| --- | --- | --- | --- |
| 2026-07-12 | Project initialised | Establish the baseline architecture for a local-first study pipeline | — |
| 2026-07-12 | Decouple preprocessing from reasoning | Transcript parsing, chunking, and retrieval need no inference at all — keeping them out of the LLM preserves capacity for synthesis | Routing the whole pipeline through the model burns VRAM and adds latency for zero quality gain |
| 2026-07-12 | Ship minimal retrieval before the reasoning layer | Validate Ingest → Chunk → Embed → Store → keyword search without LLM overhead | Building the RAG loop first hides ingestion bugs behind plausible-sounding model output |
| 2026-10-31 | ChromaDB confirmed as vector store | Native notebook-scoped metadata filtering, embedded with no service to operate, and the store I can debug without opening the docs | Pinecone (cloud, violates the premise) · FAISS (no native metadata filtering) · Qdrant (a service to run for no gain at this corpus size) |
| 2026-11-02 | SRS v3.0 reset — Core RAG only | Sized to ~10h/week solo dev; v2.x feature set deferred, not rejected | A platform-shaped v1 that never ships |
| 2026-11-06 | **Streamlit dropped (final)** — UI stack is **Flask + Bootstrap 5** | PoC did not work; Streamlit suits ML apps (rerun model, placeholder streaming) but not Binder's panes, bookshelf, and per-file progress UX | Streamlit (PoC failure) · Gradio (same rerun-model problem) — see [[Binder - Blueprint - Wireframe Spec]] §1 |

## ❓ Open Design Questions

See detailed design decisions and architecture in [[System Architecture|System Architecture Document]] for current implementation state.

- [x] **ChromaDB vs LanceDB** — resolved 2026-10-31 in favour of ChromaDB. See [[Binder - Vector Database Selection|Binder — Vector Database Selection]].
- [x] **Embedding model** — resolved 2026-11-02: `qwen3-embedding:0.6b` canonical; nomic-embed-text superseded → `4 - AI System Design/Algorithm and Model Selection — Binder.md`.
- [x] **Chunk size and overlap defaults** — resolved 2026-11-02: global 1000/200 recursive; per-format chunkers re-enter only with eval-set evidence.
- [x] **Citation granularity** — resolved 2026-11-02: quote-is-proof citations + text-poor page flag.
- [x] **Where the UI binds** — resolved 2026-11-02: ai-lab single environment; `127.0.0.1` default, LAN via explicit flag.
- [x] **Streamlit vs Gradio** — resolved 2026-11-06: **neither**. Flask + Bootstrap 5 (final, PoC informed).
- [ ] **SRS A-2 is stale** — the SRS decision log still says "Streamlit UI". Needs a 2026-11-06 reversal entry.
- [ ] **Top-level resource notes** — several component links below are uncreated (see ⬜ marks); Ollama and ChromaDB are the two highest-value first.

## ✍️ Notes I Still Need to Write

Most of the `[[]]` links under Components are unresolved — each one is a note I meant to write and never did.

**⬜ Needs creating (top-level, highest value first):**
- [ ] [[Ollama]] — local inference, model management, embedding endpoints. *Consolidate from:* `03_Resources/Ollama & LLMs/Ollama/` (Use Ollama with Python, Download and Use OLLAMA, Ollama and Open WebUI Stack)
- [ ] [[ChromaDB]] — PersistentClient, one collection per binder, cosine distance, persistence layout
- [ ] [[Flask]] — routing, static serving, SSE streaming, background jobs
- [ ] [[Bootstrap]] — components, grid, modals, toasts (as used in Binder's UI)
- [ ] [[Pydantic]] — settings via pydantic-settings, request/response schemas
- [ ] [[RAG Architecture]] — retrieval loop: ingest → chunk → query → assemble → generate *(close relatives exist: [[RAG Pipelines MOC]], [[RAG Pipeline Overview]])*
- [ ] [[PDFPlumber]] · [[python-docx]] · [[BeautifulSoup]] — one page each: what it does, gotchas in Binder
- [ ] [[pytest]] — mocking Ollama/ChromaDB offline

**✅ Already in the vault (linked):** [[LangChain]] · [[Chunking Strategies for RAG]] · [[RAG Pipelines MOC]] · [[RAG Pipeline Overview]] · [[Vector Databases - Tool Comparison]] · [[How to Choose a Vector Database for RAG]]

**Retired (Streamlit-era, no longer Binder components):** ~~Streamlit~~ · ~~FastAPI~~ · ~~Uvicorn~~ · ~~HTTPX (as SSE transport)~~ — the Flask + Bootstrap + SSE stack replaces all of these.

## 📚 Reference Notes & Internal Links

### Core Documentation (Binder Project)
- **[[Binder - Vector Database Selection|Binder — Vector Database Selection]]** — Decision record for ChromaDB selection and alternatives
- **[[Chunking Strategies for RAG]]** — Chunk size/overlap patterns
- **[[RAG Pipelines MOC]]** — Retrieval loop overview (closest existing stand-in for a full RAG Architecture note)

### Design & UI Documentation
- **[[Binder - Blueprint - Wireframe Spec]]** — ⭐ current wireframe spec (Flask + Bootstrap 5), derived from SRS v3.0
- **[[Binder - Blueprint - How to Create a Binder]]** — binder → sections → sources model + filesystem layout (`Name_Binder/{inputs,outputs,.chromaDB}`)
- **[[Software-Requirements-Specification|SRS v3.0]]** — FR-001…FR-014, decision log, deferred backlog
- **[[Binder - What to Put in it]]** — Binder (NotebookLM alternative) overview for users
- ⚠️ **Superseded / Streamlit-era (do not implement from):** [[Binder - UI_Wireframes_Home]] (home view replaced by the bookshelf spec; its style guide is carried into the new spec) · [[System Architecture|System Architecture Document]] (marked superseded 2026-11-02) · [[ARCHITECTURE|GH-300 Copilot Architecture (notes)]] (Streamlit UI layout section retired) · [[DESIGN_GUIDELINES|DESIGN_GUIDELINES]] (Streamlit-specific §3–§5; principles still valid)

### Technical Library Notes (see ⬜ list above)
- [[Ollama]] · [[ChromaDB]] · [[Flask]] · [[Bootstrap]] · [[Pydantic]] · [[PDFPlumber]] · [[python-docx]] · [[BeautifulSoup]] · [[pytest]] — all need creating
- [[LangChain]] ✅ · [[Chunking Strategies for RAG]] ✅

### External Reference Topics (Future)
- [[RAG vs Prompting vs Fine-Tuning]] — Why retrieval beats fine-tuning here
- [[Context Window Optimization]] — Local LLM context strategies
