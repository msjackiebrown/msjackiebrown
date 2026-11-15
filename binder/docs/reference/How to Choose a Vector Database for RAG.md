---
type: resource
tags: [ai, rag, vector-databases, retrieval, decision-guide]
aliases: [Vector Databases - Tool Comparison, Vector DB Comparison]
created: 2026-09-10
modified: 2026-10-31
---

# How to Choose a Vector Database for RAG

> A decision procedure, not a vendor survey. The question is never "which vector database is best" — it is "which one satisfies my constraints at my scale, with an ops burden I'll actually carry." Most comparison articles answer the first question, which is why they don't help.
>
> Built from [[2026-09-10 Aishwarya Srinivasan - Vector Databases Explained The Complete Guide for 2026|Vector Databases Explained: The Complete Guide for 2026]] and [[2026-08-31 Aishwarya Srinivasan - RAG Explained in 12 Minutes|RAG Explained in 12 Minutes]], then corrected against what actually broke.

**Not yet settled that RAG is the right approach?** That decision comes first — see [[RAG vs Prompting vs Fine-Tuning]]. This note assumes retrieval is decided and only asks which store backs it.

## What the store actually does

A RAG pipeline is `ingest → chunk → embed → store → retrieve → generate`. The vector store owns exactly one stage, and its entire contract is:

> Given a query vector, return the top-k chunk IDs whose stored vectors are nearest — optionally restricted to chunks matching a metadata filter.

That's it. Everything else a vendor advertises — replication, sharding, multi-tenancy, dashboards, RBAC — is operational surface you may never touch at single-user scale. Two consequences worth internalizing before comparing anything:

- **The store cannot rescue bad chunking or a bad embedding model.** Retrieval quality is set upstream. Swapping databases to fix poor answers is the most common wasted week in RAG work.
- **At small scale, the store is rarely the bottleneck.** Embedding calls and token generation dominate latency. Optimizing the index before measuring is premature by default.

## Step 1 — Write down hard constraints first

Constraints eliminate; features rank. A violated hard constraint isn't a tradeoff to weigh — it disqualifies the option. Do this before you read a single comparison table.

| Constraint | The question to answer | What it eliminates |
| --- | --- | --- |
| **Deployment surface** | Must this run local/on-prem only, or is cloud acceptable? | Any managed SaaS if local-first is non-negotiable |
| **Data residency** | Does the client phone home — telemetry, license checks, usage pings? | "Open source" tools with default-on analytics |
| **Corpus size** | How many chunks, at what dimensionality? | Tools whose free tiers or memory model can't hold it |
| **Concurrency** | One process, or an API plus background workers? | In-process libraries once you need multiple readers |
| **Ops budget** | Hours per week you'll spend running this thing? | Anything needing a cluster you don't want to babysit |

### Sizing the corpus, concretely

Vectors are `chunks × dimensions × 4 bytes` (float32), plus index overhead. HNSW typically adds ~1.3–2× for the graph structure.

Both inputs come from decisions made elsewhere: chunk count is set by [[Chunking Strategies for RAG]], dimensions by the embedding model — see [[How Embedding Models Work]]. Get those two numbers and the arithmetic below is all you need.

- 10k chunks × 768 dims × 4 B ≈ **30 MB** raw
- 50k chunks × 768 dims × 4 B ≈ **150 MB** raw → a few hundred MB with HNSW
- 500k chunks × 768 dims × 4 B ≈ **1.5 GB** raw → multiple GB indexed

Run that arithmetic early. It collapses a lot of debate: anything under ~100k chunks fits comfortably in RAM on a normal workstation, which makes the "massive scale" tier of every comparison irrelevant to you.

## Step 2 — Decide: do you need an index or a database?

This is the fork that matters more than any vendor feature. Two genuinely different products get lumped together as "vector databases."

| | Index library (e.g. FAISS) | Vector database (e.g. ChromaDB, Qdrant) |
| --- | --- | --- |
| **What you get** | Similarity search, full stop | Similarity search + storage + filtering + lifecycle |
| **Persistence** | You call `write_index()` yourself | Handled |
| **Metadata filtering** | None native — parallel store + ID intersection | Native |
| **Deletes / updates** | Rebuild or tombstone | Built in |
| **ID mapping** | You map row position → document ID | Built in |
| **Concurrency** | Single process | Client/server or safe embedded |
| **Ceiling** | Fastest raw search; GPU indexes | Higher ops cost, lower tuning ceiling |

**Default answer for RAG: use a database.** You will want metadata filtering within the first week — "only search this notebook," "only docs modified after 2025," "exclude drafts." Building that layer yourself is real work that adds no product value.

Choose a bare index only when all of these are true: single-process pipeline, corpus fits on one machine, you control the ingest path end to end, and you genuinely want the search in-process with no network hop. See [[#Why FAISS is a trap for RAG beginners]] before deciding you're that case.

## Step 3 — Test the four capabilities that actually bite

Vendors all claim these. The differences are in the edge cases, and you can check them in an afternoon.

### 1. Metadata filtering — the one that bites first

Ask: is the filter applied *before* the ANN search (pre-filter) or after (post-filter)?

Post-filtering is the silent quality killer. If 2% of chunks match your filter and the store pulls top-100 then discards, you may return three results. Pre-filtering constrains the search space and preserves recall.

**Test it:** insert 10k chunks where only 200 carry a specific metadata value. Query with that filter and top-k=10. If you get fewer than 10 results back on a corpus that clearly has 200 matches, it's post-filtering.

### 2. Deletes and updates

Embeddings go stale. Documents change, chunks get re-cut, models get upgraded — and a model upgrade invalidates *every* vector in the store.

**Test it:** delete 10% of chunks and measure the time and the resulting disk size. If deletion means "rebuild the index," that's a real constraint on how often you can re-ingest.

### 3. Persistence and backup

Know exactly which directory or volume holds the truth, and what happens if it's wiped.

**Key insight:** embeddings are *derivable*. If you still have the source documents and the embedding model, you can regenerate the entire store. So the backup priority is source documents and chunking config — not the index. That said, re-embedding 50k chunks is not free on consumer hardware, so a cheap snapshot of the store is worth having.

### 4. Hybrid search — only if exact tokens matter

Semantic similarity is bad at exact strings: error codes, ticket IDs, function names, product SKUs, proper nouns. If your corpus has those and users search for them literally, you need keyword matching alongside vectors.

If your corpus is prose and users ask conceptual questions, skip this entirely — it's complexity you'd be buying for a problem you don't have.

## Step 4 — Measure at your scale, with your data

Vendor benchmarks use their corpus, their hardware, their query distribution. None of that is yours.

**Procedure:**

1. Build a corpus of 20k–50k chunks from your own documents — not a public dataset.
2. Measure **p50 and p95** top-10 query latency. Averages hide the tail, and the tail is what users feel.
3. Measure **ingest throughput** in chunks/sec, including the embedding call.
4. Measure **recall@10 against an exact brute-force baseline** on a few hundred queries. This catches approximate indexes configured too aggressively.
5. Measure the **end-to-end** answer time — retrieval plus generation. If retrieval is 15 ms and generation is 4 s, you have no retrieval problem.

That last number is the one that settles most debates. On a local stack, the store is usually a rounding error.

## Step 5 — Bound the cost of being wrong

You will not pick perfectly, and you don't need to. Put a thin interface in front of the store:

```python
class VectorStore:
    def add(self, ids, embeddings, metadatas, documents): ...
    def query(self, embedding, k, where=None) -> list[Result]: ...
    def delete(self, ids): ...
```

Every call site talks to that, never to the vendor SDK. Migration then becomes one new class rather than a refactor — and the decision drops from "architectural commitment" to "reversible choice." This single move is worth more than getting the vendor right on the first try.

## Worked example: the Binder decision

Applying the steps to a real local-first RAG app:

| Step | Result |
| --- | --- |
| **Constraints** | Local-first, single user, Windows workstation, ~50k chunks expected, one process, minimal ops budget |
| **Deployment** | Rules out Pinecone — managed cloud contradicts the entire premise |
| **Scale** | ~150 MB of vectors fits in RAM; Qdrant's performance edge buys nothing at this size, and adds a service to run |
| **Filtering** | Per-notebook and per-source filtering required → rules out FAISS as the primary store |
| **Survivor** | **ChromaDB** — embedded, Python-native, cosine via `hnsw:space: cosine`, persists to `./chroma_db/` |
| **Escalation path** | FAISS, if and only if retrieval latency becomes the bottleneck at scale |
| **What would reopen it** | >1M chunks, a multi-user API surface, or a hard hybrid-search requirement |

Familiarity was a legitimate tiebreaker here, not a cop-out. A store you can debug at 11pm without opening the docs is worth more than a benchmark delta you can't reproduce.

## Cheat sheet

| If this is true | Reach for |
| --- | --- |
| Prototyping, single user, want it working today | **ChromaDB** |
| Single-process, no service, full control, GPU available | **FAISS** — if you'll own persistence and filtering |
| Self-hosted, performance-critical, need first-class filtering | **Qdrant** |
| No ops budget and cloud is acceptable | **Pinecone** |

## Why FAISS is a trap for RAG beginners

FAISS is an index, not a database — and the gap is larger than it sounds. Everything a database does for you becomes your code:

- **Persistence** — `write_index()` / `read_index()` are manual; index files are opaque blobs, not queryable state.
- **Metadata filtering** — no native layer. You need a parallel store (SQLite, Postgres) plus ID-set intersection before or after the search — see [[RAG with Metadata Filtering]].
- **Updates and deletes** — appending is cheap; removal generally means rebuilding or carrying tombstones.
- **ID mapping** — FAISS returns positional row numbers, so you maintain the vector position ↔ document ID map.
- **Concurrency** — no server, so multi-process or multi-user access is on you.

Where FAISS genuinely wins: a single-process pipeline, corpus on one machine, ingest path fully under your control, index wanted in-process with no network hop. On a workstation with a discrete GPU, the GPU indexes are a real advantage over the server options. Just go in knowing you're signing up to build the missing half of a database.

## Anti-patterns

- **Choosing from a benchmark chart you didn't run.** Their corpus, their hardware, their query mix.
- **Comparing tools before writing constraints.** Ranking features you don't need is how Milvus ends up on a shortlist for a 20k-chunk personal app.
- **Swapping the database to fix bad answers.** That's a chunking or embedding problem 90% of the time.
- **Migrating before measuring.** If retrieval is 15 ms of a 4 s response, you have no retrieval problem.
- **Picking by GitHub stars or recency.** Stars measure attention, not fit.
- **Skipping the abstraction layer.** Vendor SDK calls sprinkled through the codebase turn a reversible choice into a rewrite.

## Revisit triggers

Tools deliberately excluded from this guide, recorded as triggers rather than options:

- **Hybrid keyword + semantic search becomes a hard requirement** → Weaviate
- **Scale genuinely exceeds one machine** → Milvus
- **Disk-based serverless with heavy multi-modal ingest** → LanceDB

If one of those requirements actually appears, run this procedure fresh. Don't add them back on spec.

## Docs

- ChromaDB: https://www.trychroma.com/
- FAISS: https://faiss.ai/ · https://github.com/facebookresearch/faiss
- Qdrant: https://qdrant.tech/
- Pinecone: https://www.pinecone.io/

## Related

**Parent**
- [[RAG Pipelines MOC]]

**Sibling decision notes**
- [[RAG vs Prompting vs Fine-Tuning]] — whether to use RAG at all, upstream of this
- [[Chunking Strategies for RAG]] — sets the chunk count this guide sizes against
- [[How Embedding Models Work]] — sets the dimensionality this guide sizes against
- [[RAG with Metadata Filtering]] — the requirement that usually decides the store

**Background**
- [[RAG Pipeline Overview]]
- [[Simple RAG]]

**Apply it**
- [[Vector Database Selection Template|Vector Database Selection — [Project Name]]] — the fill-in form that operationalises this procedure; save as `<Project> - Vector Database Selection.md`
- [[Binder - Vector Database Selection|Binder — Vector Database Selection]] — a worked instance, decision closed 2026-10-31

**Sources**
- [[2026-08-26 Chroma - Chroma Python Basics|Chroma Python Basics]] — hands-on clip, still unprocessed
- [[2026-09-10 Aishwarya Srinivasan - Vector Databases Explained The Complete Guide for 2026|Vector Databases Explained: The Complete Guide for 2026]]
