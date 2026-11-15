---
type: resource
tags: [ai, rag, vector-databases, tools, retrieval]
aliases: [Vector DB Comparison, ChromaDB vs Qdrant vs Pinecone vs FAISS]
created: 2026-09-10
modified: 2026-10-31
---

# Vector Databases — Tool Comparison

> Decision matrix for choosing a vector database. Scope is deliberately narrow: only tools I have studied or worked with hands-on. Distilled from [[2026-09-10 Aishwarya Srinivasan - Vector Databases Explained The Complete Guide for 2026|Vector Databases Explained: The Complete Guide for 2026]] and [[2026-08-31 Aishwarya Srinivasan - RAG Explained in 12 Minutes|RAG Explained in 12 Minutes]].

## Decision

**ChromaDB — decided for [[Binder]].** No longer provisional. It is Python-native, persists to `./chroma_db/`, supports cosine distance via `hnsw:space: cosine`, and is the one I know well enough to debug without reading docs mid-incident. That last point is a real criterion, not a soft one: an unfamiliar store turns every retrieval bug into a research project.

FAISS stays on the list as the escalation path if retrieval latency becomes the bottleneck at scale — see [[#The FAISS Caveat]] for what that would cost.

## Decision Matrix

Ordered by deployment shape: in-process libraries first, then self-hosted servers, then managed cloud.

| Tool | Kind | Best for | Notes |
| --- | --- | --- | --- |
| **ChromaDB** | Embedded library (+ optional server) | Local prototyping / first RAG build | Python-native, easiest setup; works with LangChain & LlamaIndex; working prototype in under an hour. Runs in-process by default, with a client/server mode if you outgrow that. **Chosen for Binder.** |
| **FAISS** | Index library (C++/Python, in-process) | Maximum control on one machine; zero-server local-first | Pure similarity search — the fastest raw ANN index here. Ships IVF, HNSW, and PQ index types, with a real GPU path. **Not a database:** no server, no auth, no built-in metadata filtering, no replication. You own persistence, the ID ↔ vector mapping, and updates. |
| **Qdrant** | Self-hosted server (+ managed cloud) | Self-hosted performance | Open-source, written in Rust — fast and memory-efficient; local Docker run in ~5 minutes; first-class metadata filtering. |
| **Pinecone** | Fully managed cloud | Managed production | Auto-scaling, generous free tier; no infrastructure to operate. Cloud dependency, so it cuts against local-first. |

## Selection Rules of Thumb
- Prototyping locally, or you want the store you already know → **ChromaDB**.
- Local-first with full control and no service to run → **FAISS**, if you're willing to write the persistence and metadata layer yourself.
- Self-hosting with performance as priority → **Qdrant**.
- Avoiding infrastructure ops in production, and cloud is acceptable → **Pinecone**.
- Beyond tool choice, evaluate query latency at expected scale, metadata filtering support, and hybrid search when comparing any two options.

## The FAISS Caveat

FAISS is an index, not a vector database. Everything a database would do for you is your code:

- **Persistence** — `write_index()` / `read_index()` are manual; index files are opaque blobs, not queryable state.
- **Metadata filtering** — no native filter layer. Filtering means a parallel store (SQLite, Postgres) plus ID-set intersection before or after the search — see [[RAG with Metadata Filtering]].
- **Updates and deletes** — appending is cheap; removal generally means rebuilding or carrying tombstones.
- **ID mapping** — FAISS returns positional row numbers, so you maintain the vector position ↔ document ID map.
- **Concurrency** — no server, so multi-process or multi-user access is on you.

Where FAISS wins: a single-process pipeline where the corpus fits on one machine, you control the ingest path end to end, and you want the index in-process with no network hop. On a workstation with a discrete GPU, the GPU indexes are a genuine advantage over the server options. If any of the caveats above sound like work you don't want to own, use ChromaDB or Qdrant instead.

## Out of Scope

Weaviate, Milvus, and LanceDB were dropped from this note — not evaluated hands-on, and keeping unfamiliar rows in a decision matrix makes it look like a survey instead of a shortlist.

Recorded only as triggers to revisit: **hybrid keyword + semantic search** → Weaviate; **distributed scale beyond one machine** → Milvus; **disk-based serverless with heavy multi-modal ingest** → LanceDB. If one of those requirements actually appears, start a fresh evaluation then. Don't re-add them here on spec.

## Tool Docs
- ChromaDB: https://www.trychroma.com/
- FAISS: https://faiss.ai/ · https://github.com/facebookresearch/faiss
- Qdrant: https://qdrant.tech/
- Pinecone: https://www.pinecone.io/

## Related
- [[RAG Pipelines MOC]]
- [[Simple RAG]]
- [[RAG Pipeline Overview]]
- [[Chunking Strategies for RAG]]
- [[RAG with Metadata Filtering]]
- [[2026-08-26 Chroma - Chroma Python Basics|Chroma Python Basics]] — hands-on clip, unprocessed
- [[2026-09-10 Aishwarya Srinivasan - Vector Databases Explained The Complete Guide for 2026|Vector Databases Explained: The Complete Guide for 2026]]
