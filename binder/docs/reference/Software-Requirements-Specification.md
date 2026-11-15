---
type: requirements
project: binder
version: 3.0
status: draft
created: 2026-11-02
modified: 2026-11-02
tags: [binder, requirements, rag, local-first, ai]
supersedes: SRS v2.2 (2026-10-25)
---

# Software Requirements Specification — Binder v3.0 (product v1.0)

> **Reset.** This document fully supersedes SRS v2.2 (2026-10-25). All prior code
> locations and design docs are discarded; Binder is rebuilt from a fresh repo
> baseline. Product v1.0 scope = **Core RAG only**. The v2.x feature set is kept as
> an explicit deferred backlog (§9) — nothing was rejected, only deferred.

## 1. Purpose

Binder is a local-first, privacy-focused alternative to Google NotebookLM for
study: ingest personal documents, ground chat answers in them, cite exact sources.

**Design constraint (2026-07-12, retained):** local inference is expensive →
LLM is reserved for *reasoning only*. Parsing, chunking, retrieval, and storage
are non-LLM work.

**Working style:** ~10h/week, solo dev. v1 is sized to be buildable in a few
focused sprints and useful immediately — a tool, not a platform.

## 2. Decision Log (Jackie, 2026-11-02)

| #  | Decision                     | Value |
|----|------------------------------|-------|
| A-1| Product v1.0 scope           | Core RAG only (§3) |
| A-2| Stack                        | Streamlit UI + framework-agnostic Python service layer, single process, no HTTP boundary |
| A-3| Orchestration                | Modern LangChain (LCEL / LangGraph) over Ollama |
| D-1| Vector store                 | ChromaDB (confirmed 2026-10-31) |
| D-2| Socratic "Learning Guide" chat style | In v1 (FR-009) |
| D-3| YouTube transcript ingestion | Deferred to v2 |
| D-4| Playwright fallback          | Deferred to v3 |
| D-5| Repository                   | Fresh start — `msjackiebrown/binder` treated as empty baseline |

## 3. Scope Boundaries

| ✅ In scope (v1.0) | ❌ Out of scope (see §9) |
|---|---|
| Notebooks; ingest PDF/DOCX/TXT/MD/URL/pasted text; chunking; embedding; ChromaDB; grounded chat (2 styles); citations; streaming; history; settings; retrieval logging | Studio artifacts; audio; images; YouTube; CSV/ePub/PPTX/ODF; TTS; VLM; Playwright; duplication; auto-labeling; Obsidian export |

## 4. Functional Requirements

| ID | Requirement | Acceptance criteria |
|----|-------------|---------------------|
| FR-001 | **Notebook management** — create, rename, delete; sidebar list with source count + last-updated | Deleting a notebook cascades: sources, ChromaDB collection, conversations. Confirmation dialog required |
| FR-002 | **File ingestion** — PDF (pdfplumber), DOCX (python-docx), TXT, MD; multi-file; progress feedback; originals retained | 100-page PDF ingestable to searchable in < 3 min on ai-lab; a parse failure is reported per-file with reason, other files continue |
| FR-003 | **URL ingestion** — user-supplied URL; fetch + extract main content only (no nav/ads), via BeautifulSoup | Static pages work; JS-only pages return a clear "unsupported in v1" message (Playwright is v3) |
| FR-004 | **Pasted-text ingestion** — paste box stored as `.txt` source with user title | Citable exactly like a file |
| FR-005 | **Chunking** — LangChain `RecursiveCharacterTextSplitter`; defaults 1000 chars / 200 overlap, both configurable | Chunk metadata carries `source_id`, `chunk_index`, `page_number` (when known) |
| FR-006 | **Embeddings** — local Ollama embedding model: `qwen3-embedding:0.6b` (canonical, 2026-11-02), batched | Embedding model name stored in collection metadata; on query, a model mismatch is refused with a clear error (prevents silent retrieval degradation) |
| FR-007 | **Vector store** — ChromaDB `PersistentClient`; one collection per notebook; cosine; configurable path | Data survives restart; notebook delete removes its collection |
| FR-008 | **Grounded Q&A** — top-k retrieval (default 5, configurable) scoped to notebook; prompt constrains answers to retrieved chunks only; insufficient evidence → "I can't answer from your sources" | No answer content fabricated outside retrieved context (validated against an eval set — design step 8) |
| FR-009 | **Chat styles** — **Default** and **Learning Guide** (Socratic: probes step-by-step before answering); same grounding rules; Learning Guide may enable model thinking mode | Style selectable per notebook; switchable mid-conversation without re-ingestion |
| FR-010 | **Citations** — inline `[n]` markers; click expands the source quote + filename + page/chunk | Every `[n]` resolves to a chunk actually used in that answer |
| FR-011 | **Streaming + Stop** — tokens stream into the chat pane; Stop halts generation, keeps partial answer | First token < 5 s on ai-lab |
| FR-012 | **Conversation history** — per notebook, persisted across restarts, deletable | Follow-up questions see earlier turns of the same conversation |
| FR-013 | **Settings** — `.env` + pydantic-settings: LLM model (default `qwen3:14b`, quality mode `qwen3.5:27b`), embedding model, top-k, chunk size/overlap, storage paths, Ollama base URL | No configuration hardcoded; `.env.example` ships in the repo |
| FR-014 | **Retrieval trace logging** — per query: question, retrieved chunk IDs + scores, final prompt, answer, models, latency → log file | Any answer can be reconstructed from the log alone |

## 5. Non-Functional Requirements

| NFR | Target |
|-----|--------|
| **Local-only** | Zero cloud egress for generated data. Only external network: user-initiated content fetch (FR-003). No telemetry |
| **Hardware** | App + Ollama on ai-lab (RTX PRO 4000, 24GB GDDR7 — shared with existing services, so model sizes must fit); Python 3.10+ |
| **Latency** | Retrieval < 1 s · first token < 5 s · ingestion per FR-002 |
| **Security** | UI binds to localhost by default; LAN exposure only via an explicit flag |
| **Reliability** | Ollama down → clear, actionable error, no crash; failed ingestion retryable |
| **Testability** | Service layer has zero Streamlit imports — unit-testable headless; ≥ 80% coverage on core (ingest/RAG) modules |
| **Swappability** | Embedding model, LLM, and vector store sit behind interfaces — ChromaDB is confirmed but not hardcoded |

## 6. Data Model (light — full schema belongs in the design doc)

| Entity | Stores | Lives in |
|--------|--------|----------|
| Notebook | id, title, description, created/updated | SQLite |
| Source | id, notebook_id, origin, title, file path/URL, status, ingested_at | SQLite |
| Conversation / Message | id, notebook_id, role, content, citations, style, created_at | SQLite |
| Chunk | text, embedding, metadata | ChromaDB `./data/chroma_db/` |

## 7. Assumptions

- Ollama runs at `ai-lab:11434` (base URL configurable) with the generation + embedding models pulled (confirmed present 2026-11-02)
- Single user (Jackie); no auth in v1 — localhost binding *is* the access control
- ai-lab VRAM is shared with other services — quantized fallback models are acceptable

## 8. Open Questions (resolved during design)

1. ~~Generation model~~ — **Resolved 2026-11-02:** `qwen3:14b` primary, `qwen3.5:27b` quality mode → `4 - AI System Design/Algorithm and Model Selection — Binder.md`
2. ~~Embedding model~~ — **Resolved 2026-11-02:** `qwen3-embedding:0.6b` canonical; nomic-embed-text superseded → same doc
3. ~~Top-k default & per-format chunking~~ — **Resolved 2026-11-02:** global 1000/200 recursive; top-k 5 (config 3–10); per-format chunkers re-enter only with eval-set evidence → `4 - AI System Design/RAG Strategy — Binder.md`
4. ~~Citation granularity for table-heavy sources~~ — **Resolved 2026-11-02:** quote-is-proof citations (chunk text shown on click) + text-poor page flag → same doc
5. ~~Where the UI binds~~ — **Resolved 2026-11-02:** app runs on ai-lab (single environment); UI binds 127.0.0.1, LAN access via explicit flag → `4 - AI System Design/System Architecture & Orchestration — Binder.md`

## 9. Deferred Backlog (explicit, re-enters via change request)

| v2 — notes & learning | v3 — studio & heavy |
|---|---|
| Save chat → note · notes → sources | Studio: reports, flashcards/quizzes, mind maps, data tables |
| Response-length presets | Two-stage generation (review-before-render) |
| Obsidian export (answers/notes) | Audio ingestion (faster-whisper) + audio overviews (Piper TTS) |
| YouTube transcripts (D-3) | Image ingestion (local VLM) |
| Extra formats: CSV, ePub, PPTX, ODF | Playwright JS fallback (D-4) |
| Per-question source include/exclude | Notebook duplication |
| Auto-summary/labels · related sources | Context-window preview |
