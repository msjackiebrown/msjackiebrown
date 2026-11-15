---
type: idea
status: spark            # spark | exploring | promoted | shelved
effort-guess: M          # S | M | L | XL
created: 2026-09-03
tags: [idea, RAG, LLM, retrieval, metadata, vector-database, study]
---

# 💡 RAG with Metadata Filtering

> [!tip] What this note is
> A spark, not a project. Keep it under a screen.
> It becomes a project hub only when you're willing to spend part of your ~10 hrs/week on it — that's the gate.
> Otherwise it sits here with a revisit date and costs you nothing.

**The idea:**

Extend the [[Simple RAG]] pipeline so that structured metadata (date, source, category, doc-type, tags) narrows the search space *before* vector similarity, making retrieval more precise and grounded. Instead of relying on fuzzy similarity alone, filters can enforce concrete constraints like "reports from 2023" or "only contract documents".

**Why it might matter:**

Simple RAG is blind to structured qualifiers. Vector search finds semantically similar chunks, but it cannot honor these constraints on its own. Pre-filtering keeps only relevant documents in play, improves precision, reduces noise, and avoids the anti-pattern of post-filtering where non-matching results consume the top-k slots.

**Smallest version worth building:**

A weekend-sized slice: take a tiny corpus with just 2-3 metadata dimensions (e.g. `source`, `year`, `type`), attach structured metadata to each chunk in a local vector store (like Chroma or Qdrant), apply a single filter before similarity search, and prove that it changes the top-k results. Also need a simple fallback for an empty filtered subset or malformed filter.

**What I'd learn:**

- **Filtering fundamentals:** Pre-filtering vs post-filtering and why pre-filtering is the correct default.
- **Metadata design:** Keeping metadata as structured fields vs concatenating into text.
- **Store-specific filters:** How Chroma/Qdrant handle filter syntax and mapping to expressions.
- **Edge cases:** Top-k behavior with filtered subsets, empty results, and malformed filters.
- **Pragmatic RAG:** When exact constraints are needed alongside semantic similarity, and how to do it locally without heavy orchestration.

**Verdict:** exploring <!-- promote → create the hub and link it here, or shelve → add a revisit date --> 

*Note:* I have built [[Simple RAG]] before, but not metadata filtering. This is currently a design/study note. Future research directions (LLM-inferred filters via [[LangChain]], hybrid search, embedding metadata, filtered reranking) are interesting, but out of scope for this spark.
