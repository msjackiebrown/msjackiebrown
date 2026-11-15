---
type: design
project: binder
version: 0.2 (with listview)
status: draft
created: 2026-11-06
modified: 2026-11-15
tags: [binder, design, wireframe, bootstrap, flask]
---

# 📐 Binder — Blueprint — Wireframe Spec

> **Stack decision (final, 2026-11-06):** Streamlit is **out**. Streamlit suits ML apps, not Binder.
> New stack: **Bootstrap 5 (HTML/CSS/JS) + Flask (Python) + ChromaDB**.
> This spec defines the HTML/CSS/JS wireframes derived from [[Software-Requirements-Specification]] v3.0
> (FR-001…FR-014) and the binder model in [[Binder - Blueprint - How to Create a Binder]].
>
> **Version 0.2 Update (2026-11-15):** Home page redesigned from bookshelf spine view to **responsive listview** showing:
> - Binder name (with up to 40+ characters visible on desktop)
> - Description (one-line summary)
> - Source count (📄 badge)
> - Created date
> - Modified date
> - Action buttons (Open, Rename, Delete)
>
> The listview is scrollable, responsive across all screen sizes (1920px desktop to mobile), and optimized for discoverability of binder metadata.
>
> **Supersedes:** the home view in [[Binder - UI_Wireframes_Home]] (notebook grid/list era) — its visual style guide and status colors are still carried into §3.

> **Working style reminder:** single user (Jackie), desktop-first, localhost-only. We are wiring a *tool*, not a platform — every screen must map to an SRS requirement.

---

## 1. Design Premises

| Premise | Consequence for wireframes |
|---|---|
| **Local-first, single user** | No login, no account surfaces, no sharing UI. Access control = localhost binding (NFR Security). |
| **Flask serves, LLM reasons** | All long-running work (ingest, embedding, generation) is async on the server; the wireframes must show **progress, stop, and per-file failure** states — the UI never blocks. |
| **Binder = discoverable object** | The home page is a **responsive listview** showing binder metadata at a glance: title, description, source count, dates, and actions. Optimized for 1920×1080 desktop but fully responsive down to mobile. |
| **Binder → Sections → Sources** (see How to Create a Binder) | Inside a binder, the left pane is a **sections tree**; root-level sources sit directly under the binder. |
| **Citations are the product** | The chat pane is designed around `[n]` → click → quote + file + page/chunk (FR-010), not around prose. |
| **Desktop-first, responsive** | Design at **1920×1080 primary**, 1200px tablet, 768px minimum; responsive grid ensures usability across all breakpoints. |

---

## 2. Information Architecture

```
/                       Home — Bookshelf (FR-001)
│
├── /binder/<id>        Binder — Sources + Chat (FR-002…FR-012)
│   ├── #chat           (default anchor: chat pane)
│   └── #sources        (sources/sections pane)
│
└── /settings           Settings (FR-013)
```

- **Three routes, zero nesting beyond one level.** Flask renders the pages; JS (vanilla, Bootstrap JS bundle only) drives modals, toasts, streaming via SSE, and the sources tree.
- **No SPA router.** Page navigation is real navigation — refresh always lands you somewhere sensible.
- **Global chrome:** a slim top bar on every page (brand + model status + settings link). See §3.4.

---

## 3. Design Tokens (Bootstrap Overrides)

Bootstrap defaults are overridden via CSS variables in `app.css`. Carries forward the existing visual language:

| Token | Value | Used by |
|---|---|---|
| `--binder-accent` | `#4A90D9` | Primary buttons, links, active spine highlight, focus rings |
| `--binder-bg` | `#FAF8F4` (warm paper) | App background — the "shelf wood" tone for the home page deepens this to a wood gradient (`#3E2F23 → #5A4632`) |
| Status 🟢 Indexed/Ready | `#4CAF50` | Source + binder status badges |
| Status 🟡 Processing | `#FFC107` | Ingest progress, "embedding…" badges |
| Status ⚪ Empty | `#9E9E9E` | Binders with no sources |
| Status 🔴 Error | `#F44336` | Failed files, Ollama-down banner |
| Card radius | `8px` | All cards, modals, spines (bottom corners only) |
| Typography | UI: system sans (Bootstrap default); binder titles on spines: small-caps serif for the "physical book" feel; chat: 15px, line-height 1.6 | — |
| Spacing scale | 8 / 16 / 24 px | Gutters between spines = 8px (they touch, like real books) |

**Motion rules:** max 200ms transitions (hover, modal, toast). No animations for streaming text — tokens just appear.

---

## 4. Screen 1 — Home: Binder Listview (FR-001)

> **Updated 2026-11-15:** The home page now uses a **responsive listview** instead of a bookshelf spine view. This provides better discoverability of binder metadata, enables searching/filtering, and scales naturally from 1920×1080 desktop to mobile devices.

### 4.1 Wireframe — Desktop (1920×1080)

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│ 🔖 BINDER                      [● Ollama: qwen3:14b]      [⚙ Settings]               │ ← top bar (40px)
├──────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                       │
│  My Binders                                                    [ + New Binder ]        │ ← page header + CTA
│  ─────────────────────────────────────────────────────────────────────────────────── │
│                                                                                       │
│  NAME                              DESCRIPTION               SOURCES  CREATED  MODIFIED │ ACTIONS
│  ─────────────────────────────────┬──────────────────────────┬────────┬────────┬────────┬─────────
│                                    │                          │        │        │        │
│  • Python Data Science Ad. Topics  │ ML algorithms and pandas │📄 0    │Nov 15  │Nov 15  │ 📖 ✏ 🗑
│                                    │ techniques               │        │ 2026   │ 2026   │
│  ─────────────────────────────────┼──────────────────────────┼────────┼────────┼────────┼─────────
│                                    │                          │        │        │        │
│  • This is a Very Long Binder      │ Test description with    │📄 0    │Nov 15  │Nov 15  │ 📖 ✏ 🗑
│    Title That Should Show More...  │ some sources             │        │ 2026   │ 2026   │
│                                    │                          │        │        │        │
│  ─────────────────────────────────┴──────────────────────────┴────────┴────────┴────────┴─────────
│                                                                      [ ↓ scroll for more ]
│
│                                                                                    2 binders
│                                                                                       │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

**Key characteristics:**
- **Grid columns:** Name (250–350px) · Description (flexible) · Sources (100px) · Created (120px) · Modified (120px) · Actions (100px)
- **Name visibility:** Desktop shows 40+ characters before ellipsis (e.g., "Python Data Science Advanced Topics" is fully visible)
- **Status indicator:** Colored dot (🟢/🟡/🔴/⚪) to the left of title
- **Scrollable:** Vertical scrolling for collections with many binders
- **Responsive rows:** Each row is 40px + padding; even spacing for readability

### 4.2 Responsive Breakpoints

| Breakpoint | Layout | Visible Columns | Font Size |
|---|---|---|---|
| **1920px+** (Desktop Large) | Full grid, NAME width 280–350px | Name, Description, Sources, Created, Modified, Actions | 15–16px |
| **1200–1919px** (Desktop) | Full grid, NAME width 250–320px | Name, Description, Sources, Created, Modified, Actions | 15px |
| **768–1199px** (Tablet) | 4-column grid | Name, Description, Sources, Modified (hides Created) | 13–14px |
| **600–767px** (Tablet Portrait) | 3-column grid | Name, Sources, Actions (hides Description/dates) | 12–13px |
| **480–599px** (Mobile Large) | 3-column grid | Name, Sources, Actions (compact) | 11–12px |
| **<480px** (Mobile Small) | Card layout | Name with date/source badges below | 12px labels |

### 4.3 Interactions

| Interaction | Behavior | SRS |
|---|---|---|
| **Click row / "Open" button** | Navigates to `/binder/<id>` | FR-001 |
| **"Rename" button** | Modal: Edit binder name and/or description | FR-001 |
| **"Delete" button** | Confirm modal — *"Deleting **X** also deletes its Y sources, its ChromaDB collection, and Z conversations. This cannot be undone. Type the binder name to confirm."* (type-to-confirm for safety) | FR-001 |
| **Scroll** | Vertical scrolling for many binders; list is within a container with fixed height and `overflow-y: auto` | FR-001 |
| **Sort** | Default: **last modified** (most recent at top). Optional A–Z or created date via dropdown in header | nice-to-have |
| **[+ New Binder]** | Modal: **Name** (required), **Description** (optional, one line) → creates binder → lands *inside* the new binder on its empty state (see §6.5), because a new binder's first act is adding sources | FR-001 |

### 4.4 Empty State

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│  Your binder collection is empty.                    │
│  Start organizing your knowledge base.               │
│                                                      │
│  [ + Create your first binder ]                      │
│                                                      │
│  ──────────────────────────────────────────────────  │
│                                                      │
│  NAME                       DESCRIPTION    SOURCES   │ (column headers visible but no rows)
└──────────────────────────────────────────────────────┘
```

### 4.5 Listview Styling

- **Row height:** 40px baseline + 16px padding = ~56px per item
- **Row hover:** Subtle background highlight (`background-color: #f5f5f5`), 200ms transition
- **Truncation:** Name and Description use `text-overflow: ellipsis` with `white-space: nowrap`; browser's native truncation UX is familiar
- **Status indicator:** 8px colored circle; status-by-color reinforced with icon (📄 for sources, dates shown as text)
- **Action buttons:** Icon-only (📖 Open, ✏ Rename, 🗑 Delete), accessible via hover or focus
- **Row divider:** Subtle 1px border (`#e0e0e0`) between rows for clarity
- **Footer:** Binder count: *"X binder(s)"* sticky at bottom of list

---

## 5. Screen 2 — Inside a Binder: Sources + Chat (FR-002…FR-012)

Two-pane workspace. **Left = the binder's contents (sections → sources). Right = the conversation grounded in them.**

### 5.1 Wireframe

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│ ← Shelf        [● Ollama: qwen3:14b]                        [⚙ Settings]             │
├───────────────────────────────┬──────────────────────────────────────────────────────┤
│ 📓 CAPTURE THEBRAIN            │  Conversation 2 of 3        [ + New Chat ] [ 🗑 ]     │
│ "Evergreen notes methodology"  │──────────────────────────────────────────────────────│
│ ┌─────────────────────────────┐│                                                        │
│ │ ⚠ Ollama unreachable at     ││  ┌──────────────────────────────────────────────┐    │
│ │ ai-lab:11434 — start Ollama ││  │ You                                       14:02 │    │
│ │ [ Retry ]  [ Skip for now ] ││  │ How does progressive summarization actually  │    │
│ └─────────────────────────────┘│  │ work in a PARA setup?                        │    │
│                                 │  └──────────────────────────────────────────────┘    │
│  SOURCES              [+ Add]   │                                                        │
│  📁 Notes               [ + ]   │  ┌──────────────────────────────────────────────┐    │
│   📄 capture-theory.txt  🟢    │  │ Binder · Learning Guide              14:02    │    │
│   📄 para-overview.pdf   🟢    │  │ Good — before I answer, one probe:          │    │
│  📁 Reading               [ + ] │  │ When you *file* a note, do you already know  │    │
│   📄 evergreen.pdf  p.34  🟢   │  │ where it lives, or is filing the retrieval?   │    │
│     ⏳ page 12/34 · ▓▓▓░░ 85%  │  │ That decides which pattern [1] matters more… │    │
│   🔴 slides-v1.pdf            │  │  ⏹ Stop                                     │    │
│     ↳ "No text found on pages │  └──────────────────────────────────────────────┘    │
│     3–17 (image-only?)"  [↻]  │                                                        │
│  (root level)      [ + ]      │  ┌──────────────────────────────────────────────┐    │
│   📄 paste-ideas.txt   🟢     │  │ Binder · Default                14:05         │    │
│   📄 https://tinyurl…  🟢     │  │ Short answer: pattern in [1] — summarize as   │    │
│                                 │  │ you go; [2] warns against pre-filing…        │    │
│                                 │  │  ┌────────────┐   ┌─────────────────────┐   │    │
│                                 │  │  │ ¹  evergreen │   │ ²  para-overview.pdf│   │    │
│                                 │  │  │   p.12, chunk│   │   p.3, chunk 7       │   │    │
│                                 │  │  │   "Progressive │  │   "Don't organize… │   │    │
│                                 │  │  │   summarization│  │   by topic up front"│   │    │
│                                 │  │  └────────────┘   └─────────────────────┘   │    │
│                                 │  └──────────────────────────────────────────────┘    │
├───────────────────────────────┴──────────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────────────────────────────────────────┐  │
│  │  [ 📎 Files ]  [ 🔗 URL ]  [ ▤ Paste ]    Style: [ Default │ Learning Guide ]   │  │
│  │  Ask about your sources…                                    [ ➤ Send ] [ ⏹ ]   │  │
│  └────────────────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

### 5.2 Left pane — Sections & Sources (FR-001, FR-002, FR-003, FR-004)

Per [[Binder - Blueprint - How to Create a Binder]]: **sections are nested containers of sources**; a binder also holds root-level sources directly. Each source is ingested into the binder's ChromaDB, with a copy kept under `inputs/`.

| Element | Spec | SRS |
|---|---|---|
| **Binder header** | Title (click → rename inline), description (1 line, click → edit), source total | FR-001 |
| **Section node** | Folder row; `[+]` adds a **section** or **source** (menu); sections nest (rendered as an indented tree; cap depth at 3 in v1 with a tooltip) | binder model |
| **Source row** | Icon by origin: 📄 file · 🔗 URL · ▤ paste; title; page count for PDFs; status dot | FR-002…004 |
| **Ingest progress** | Row turns 🟡 with inline progress (`page 12/34 · ▓▓▓░░ 85%`) driven by server events (SSE or poll) — **per file**, not global | FR-002 |
| **Per-file failure** | Row turns 🔴, reason under it, `[↻ Retry]`; **other files continue** — this is an explicit acceptance criterion | FR-002 |
| **`[+ Add]` (binder/section level)** | Opens the **Add Source dialog** (§5.4) | FR-002…004 |
| **Source actions** | Row hover → `[⋮]`: *Preview (opens the extracted text)* · *Remove from binder (confirms: removes vectors + `inputs/` copy)* | FR-001 (cascade) |
| **Ordering** | Sections A–Z, sources newest-first within a section; manual reorder = v2 | — |

### 5.3 Right pane — Chat (FR-008…FR-012)

| Element | Spec | SRS |
|---|---|---|
| **Conversation header** | `Conversation N of M`, `[+ New Chat]`, `[🗑]` delete with confirm; **history persists across restarts** | FR-012 |
| **Messages** | You = left-aligned card; Binder = right-aligned; style label on each answer (`Default` / `Learning Guide`) | FR-009 |
| **Streaming** | Tokens appear incrementally (SSE from Flask → browser); `[⏹ Stop]` visible *only* while streaming; Stop **keeps the partial answer** | FR-011 |
| **Citations** | Inline `[n]` superscripts; **click expands an inline quote card** showing: source title · file/page or URL · chunk text verbatim (*quote-is-proof*). Expansion is in-place, not a modal — the user's eye must never leave the answer | FR-010 |
| **Refusal** | When evidence is insufficient: styled refusal card — *"I can't answer this from your sources. Closest material: [1] [2]"* (links the near-misses so the gap is visible) | FR-008 |
| **Style toggle** | Segmented control in the composer: `Default` / `Learning Guide`; switchable **mid-conversation**; the *next* message uses the new style and is labeled as such | FR-009 |
| **Learning Guide mode** | Visually distinct (accent left-border on answer cards) so the Socratic probing is recognizable; model thinking mode is server-side — show a discreet *"thinking…"* shimmer while the model plans | FR-009 |
| **Composer** | Single input row + mode tabs for *what you're adding/asking*: plain question send is the default; the `📎 Files / 🔗 URL / ▤ Paste` tabs double as the **add-source** entry points (see §5.4 — one dialog, two destinations) | FR-002…004 |

### 5.4 The Add-Source dialog (FR-002, FR-003, FR-004)

One modal, three tabs — used both from the left pane `[+ Add]` and from the composer tabs:

```
┌──────────────────────── Add to: Notes ▾ ──────────────── × ─┐
│  [ 📎 Files ]  [ 🔗 URL ]  [ ▤ Paste ]                      │
│                                                              │
│  Files:  [ drop zone — PDF, DOCX, TXT, MD · multi-select ]   │
│            "100-page PDF → searchable in under 3 minutes"    │
│                                                              │
│  URL:     [ https://____________________________ ]  [ Fetch ]│
│            JS-only pages: "unsupported in v1" — say so,      │
│            don't fail silently                               │
│                                                              │
│  Paste:   [ title (optional, defaults to first line) ]       │
│            [ textarea… ]                                     │
│                                                              │
│                              [ Cancel ]  [ Add to binder ]   │
└──────────────────────────────────────────────────────────────┘
```

- **Destination selector** (`Add to: Notes ▾`) lets the user file the source into a section — important because that *is* the binder's organization model.
- Unsupported extensions → row appears instantly as 🔴 *"Unsupported format in v1: .pptx"* (no upload, no hang).
- On success → rows appear 🟡 with progress; toast: *"Added evergreen.pdf — ingesting…"*

### 5.5 Binder empty state (right after New Binder)

```
┌──────────────────────────────────────────────────────────────────┐
│  📓 Chapter 4                                                    │
│                                                                  │
│        This binder has no sources yet.                           │
│        Chat stays locked until at least one is ingested.         │
│                                                                  │
│        [ 📎 Add files ]   [ 🔗 Add URL ]   [ ▤ Paste text ]      │
│        [ + New section ]                                       │
└──────────────────────────────────────────────────────────────────┘
```

The chat pane shows the disabled composer with the hint *"Add a source to start asking questions."* — the grounding rule (FR-008) is made *visible*, not just enforced.

---

## 6. Screen 3 — Settings (FR-013)

Single scrolling page, form-per-section, **Save** at the bottom (no autosave — a local tool should be explicit). All values live in `.env` via pydantic-settings; this page edits them and writes the file.

| Section | Fields (defaults in parens) |
|---|---|
| **Models** | LLM primary (`qwen3:14b`) · LLM quality mode (`qwen3.5:27b`) · Embedding model (`qwen3-embedding:0.6b` — with a *warning* that changing it orphans existing collections: "existing binders must be re-ingested") |
| **Retrieval** | Top-k (5, range 3–10) · Chunk size (1000) · Chunk overlap (200) |
| **Servers & paths** | Ollama base URL (`ai-lab:11434`) · SQLite path · ChromaDB path · **Bind address** (`127.0.0.1` — the LAN flag is a checkbox with an explicit warning) |
| **Diagnostics** | Ollama status + list of pulled models (fetched from `/api/tags`) · trace-log location + "[open last log]" link (FR-014 made inspectable) |

Each section shows a **"reset to default"** link. Changing embedding model → modal: *"This breaks retrieval for all existing binders (model mismatch is refused by design, FR-006). Re-ingest required after saving."*

---

## 7. Global Chrome, States & Feedback

### 7.1 Top bar (all pages, 40px)

`← Shelf` (on inner pages) · binder/brand · **Ollama status chip** (green dot + active model; red + "unreachable" when down — clicking opens the retry banner) · Settings link.

### 7.2 Ollama-down banner (NFR Reliability)

Full-width amber banner under the top bar:
`⚠ Ollama unreachable at ai-lab:11434 — generation and new ingestion are paused. Your data is safe. [ Retry ] [ Dismiss ]`
Chat composer stays visible but sends are refused with the same message *in context*; browsing, renaming, and deleting always work.

### 7.3 Toast inventory

| Toast | Trigger | Style |
|---|---|---|
| "Added X — ingesting…" | Source added | Info, auto-dismiss |
| "✓ X is searchable" | Ingest completes | Success |
| "✗ X failed: <reason>" | Ingest fails per-file | Error, persists until acknowledged |
| "Conversation deleted" | 🗑 confirmed | Info |

### 7.4 Loading & waiting

- **Ingest:** per-row progress bar (§5.2).
- **First token (budget: < 5 s):** answer placeholder shows *"Retrieving…"* → swaps to streaming at first token; if > 5 s, adds *"— Ollama is busy, this may take a moment"*.
- **Page loads:** skeleton spines on the shelf (3 shimmer placeholders); no spinners anywhere else — everything else is instant local data.

### 7.5 Accessibility floor

Keyboard-reachable everything (spines, rows, composer, citations); focus rings in `--binder-accent`; status never conveyed by color alone (dots are paired with icons/tooltips); streaming text is announced via `aria-live=polite`.

---

## 8. Requirements Traceability

| SRS | Where it lives in this spec |
|---|---|
| FR-001 Notebook create/rename/delete, cascade confirm | §4.2 (shelf context menu + type-to-confirm) |
| FR-002 File ingestion, multi-file, progress, per-file failure, originals retained | §5.2, §5.4, §7.3 |
| FR-003 URL ingestion, JS-only pages declined clearly | §5.4 URL tab |
| FR-004 Pasted text as `.txt` source | §5.4 Paste tab |
| FR-005 Chunking defaults configurable | §6 Retrieval section |
| FR-006 Embedding model + mismatch refusal | §6 (warning modal), §7.2 (banner) |
| FR-007 One collection per binder, survives restart | implicit in binder model (§5.2); no UI surface needed |
| FR-008 Grounded answers + insufficient-evidence refusal | §5.3 refusal card |
| FR-009 Default / Learning Guide styles, mid-conversation switch | §5.3 style toggle |
| FR-010 Citations resolve to used chunks, click-to-expand | §5.3 citation cards |
| FR-011 Streaming + Stop keeps partial | §5.3, §7.4 |
| FR-012 History per binder, persisted, deletable | §5.3 conversation header |
| FR-013 Settings via `.env`, no hardcoding | §6 entire screen |
| FR-014 Trace logging inspectable | §6 Diagnostics |
| NFR Local-only / localhost binding | §1, §6 (bind address), no cloud surfaces anywhere |

**Deliberately absent from all wireframes** (SRS §9 deferred backlog — do not scope-creep): Studio artifacts, audio, images, YouTube, TTS, response-length presets, tags, archiving, bulk actions.

---

## 9. Open Questions

1. **Spine overflow model** — next shelf vs. horizontal scroll vs. "view all" card? Spec currently: shelf + overflow card (§4.1). Confirm before implementing.
2. **Section depth cap** — 3 levels proposed; the filesystem model supports unlimited. Does the UI cap or allow "as deep as the tree goes"?
3. **Chat destination of pasted text** — can the composer's *Paste* tab mean *"add as source"* AND *"ask about this"?* Current spec: it always adds as source (FR-004); asking is plain typing.
4. **Preview surface** — extracted-text preview (§5.2) as modal vs. replacing the chat pane? Leaning modal.
5. **Conversation naming** — auto-name from first question? Not in SRS; propose: auto-title = first question truncated to 40 chars, editable.
6. **Traceability:** does [[Software-Requirements-Specification]] A-2 (Stack: Streamlit) need a decision-log entry recording the 2026-11-06 Streamlit → Flask/Bootstrap reversal? Recommend yes, to keep the SRS honest.
