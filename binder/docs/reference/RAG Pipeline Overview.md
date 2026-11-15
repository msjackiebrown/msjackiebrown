---
type: resource
tags: [ai, rag, llm, machine-learning, retrieval-augmented-generation]
aliases: [RAG Overview, Retrieval-Augmented Generation]
created: 2026-09-02
modified: 2026-09-02
source: "[[2026-08-31 Aishwarya Srinivasan - RAG Explained in 12 Minutes|RAG Explained in 12 Minutes]]"
---

# RAG Pipeline Overview

## What is RAG?

Retrieval-Augmented Generation (RAG) is an architectural pattern that gives LLMs the ability to look up relevant information from external sources before generating an answer — like an open-book exam instead of relying solely on memorized training data.

It has two core components:
- **Retrieval system** — finds the right information from external sources
- **Generation system** — the LLM that uses the retrieved context to answer intelligently

RAG is the foundation of nearly every serious enterprise AI application: customer support, internal knowledge assistance, legal document analysis, and more.

## Common Myths

- **"RAG is dead"** — False. RAG is an evolving architectural pattern, not a single static technology. New variants (corrective RAG, self RAG, agentic RAG) directly address earlier limitations.
- **"Bigger context windows replace RAG"** — False. Large context windows are expensive at scale, slow, and models actually perform *worse* when overloaded with irrelevant content. RAG surfaces precisely the right info, outperforming brute-force context stuffing on accuracy, cost, and speed.

## Core Architecture

### 1. Ingestion & Chunking

Documents are broken into chunks before storage. Chunking strategies include:

- **Fixed-size chunking** — cuts documents into uniform pieces (e.g. 500 tokens). Simple but loses context at boundaries.
- **Semantic chunking** — uses an embedding model to detect topic shifts, breaking at natural boundaries.
- **Document-aware chunking** — respects the structure of the document (sections, headers).
- **Hierarchical chunking** — stores both a small precise chunk and its larger parent chunk for context. Called "small-to-big retrieval" — one of the best production techniques.

### 2. Embedding

Each chunk is converted into a numerical vector (embedding) representing its meaning. When a user asks a question, their query is also embedded, and chunks with the closest embeddings are retrieved via semantic search.

### 3. Vector Database

Stores embeddings and supports fast similarity search, metadata filtering (by date, source, category), and hybrid search.

## The 10 RAG Patterns

| #   | Pattern                                    | Description                                                                                                                                            |
| --- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | [[Simple RAG]]                             | Retrieve chunks → stuff into prompt → LLM answers. Good for prototyping, not production.                                                               |
| 2   | **RAG with Memory**                        | Adds a memory layer on top of simple RAG for conversational context.                                                                                   |
| 3   | **Branched RAG**                           | Decomposes complex questions into sub-questions, retrieves in parallel, then synthesizes.                                                              |
| 4   | **HyDE (Hypothetical Document Embedding)** | LLM generates a hypothetical answer first, then uses *that* embedding to search, bridging the query-document embedding gap.                            |
| 5   | **Adaptive RAG**                           | A routing layer decides whether a question needs retrieval at all — saves cost and latency.                                                            |
| 6   | **Corrective RAG (CRAG)**                  | Quality gate after retrieval; low-confidence results trigger query reformulation or web search fallback.                                               |
| 7   | **Self RAG**                               | LLM generates reflection tokens during answering to self-critique relevance and grounding in real time.                                                |
| 8   | **Agentic RAG**                            | An LLM orchestrator decides what to do next (search, call API, run code) and loops until the answer is good enough. The direction the field is moving. |
| 9   | **Multimodal RAG**                         | Handles charts, images, tables, and mixed-content PDFs using vision language models and image embeddings.                                              |
| 10  | **Graph RAG**                              | Builds a knowledge graph mapping entity relationships. Dramatically outperforms flat vector search for multi-hop reasoning questions.                  |

## Recommended Tools (2026)

### Frameworks
- [[LangChain]] — for building context-aware reasoning applications
- [[LlamaIndex]] — excellent for advanced chunking, data ingestion, and multi-modal RAG

### Vector Databases
- Pinecone — managed, scalable
- Weaviate — open-source
- Qdrant — high-performance vector search
- Milvus — open-source, built for massive-scale AI
- Chroma DB — open-source, AI-native

### Embedding Models
- OpenAI: text-embedding-3-large
- Voyage AI: Voyage 3
- Hugging Face (open-source): BGE-large, E5-Mistral

> **Tip:** Benchmark embedding models on your domain specifically — performance varies significantly. A model great on legal text may be mediocre on code documentation.

---

## Key Takeaway

RAG is not a trick — it's an evolving architectural pattern and the foundation of production AI systems. Mastering these 10 patterns is essential for building smarter, faster, and more accurate AI applications.
