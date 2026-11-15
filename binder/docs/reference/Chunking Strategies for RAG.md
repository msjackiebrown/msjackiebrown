---
type: resource
tags: [ai, rag, chunking, embeddings, retrieval]
aliases: [Chunking Strategy, Document Chunking for RAG]
created: 2026-09-10
modified: 2026-09-10
---

# Chunking Strategies for RAG

> How you chunk documents before embedding them matters as much as the vector database you choose — retrieval quality depends on it.

## Baseline Parameters (Srinivasan, 2026)
- **300–500 tokens per chunk** — a solid starting point.
- **50–100 tokens of overlap** at chunk boundaries.
- Chunks too large → lost precision; chunks too small → lost context.
- Prefer a **semantic chunker** over a fixed-size character splitter when the framework supports it — the difference in retrieval quality is real.

## Wider Strategy Landscape
- [[2026-08-30 Debu Sinha - The Ultimate Guide to Chunking Strategies for RAG Applications with Databricks|The Ultimate Guide to Chunking Strategies for RAG Applications with Databricks]] — fixed, semantic, recursive, adaptive, context-enriched, and AI-driven strategies with code.
- [[2026-07-14 Web Dev Simplified - Production Ready RAG AI|Production Ready RAG AI]] — production example of **structure-aware chunking**: one chunk per H2 section (hierarchical, contextually coherent) with double-newline paragraph separators and no token-size overlap; falls back to a single chunk when a document has no H2s.
- Vault rule of thumb from project notes: ~500–800 tokens with ~100-token overlap (see [[5 AI Engineer Projects to Build in 2026]]) — adjust chunk size to your document type and embedding model.

## Related
- [[RAG Pipelines MOC]]
- [[Vector Databases - Tool Comparison]]
- [[RAG Pipeline Overview]]
- [[How Embedding Models Work]]
- [[2026-09-10 Aishwarya Srinivasan - Vector Databases Explained The Complete Guide for 2026|Vector Databases Explained: The Complete Guide for 2026]]