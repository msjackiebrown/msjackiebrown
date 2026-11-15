# Binder Wireframes — HTML/CSS/JavaScript Implementation

This directory contains the complete HTML, CSS, and JavaScript wireframe implementation for the **Binder** application based on the [Binder - Blueprint - Wireframe Spec](../docs/Binder%20-%20Blueprint%20-%20Wireframe%20Spec.md).

## Overview

The Binder wireframes implement three main pages:

1. **Home (Bookshelf)** — `index.html`
2. **Inside a Binder** — `binder.html`
3. **Settings** — `settings.html`

## Files

### HTML Pages
- **`index.html`** — Home page showing the bookshelf (grid of binder spines)
- **`binder.html`** — Two-pane workspace with sources tree (left) and chat interface (right)
- **`settings.html`** — Settings page for configuration (models, retrieval, servers)

### Stylesheets
- **`app.css`** — Complete Bootstrap 5 override with custom design tokens
  - Color scheme: `--binder-accent: #4A90D9`, warm paper background
  - Status indicators: 🟢 Ready, 🟡 Processing, 🔴 Error, ⚪ Empty
  - Responsive grid layout (1280px → 768px minimum)

### JavaScript
- **`bookshelf.js`** — Home page logic (create/rename/delete binders, shelf rendering)
- **`binder.js`** — Binder page logic (sources tree, chat, composer tabs)
- **`settings.js`** — Settings page logic (form validation, reset, Ollama status check)

## Getting Started

### Quick Start

1. Open `index.html` in a browser (no build required — vanilla HTML/CSS/JS)
2. Click "New Binder" to create a test binder
3. Click a spine to open the binder and explore the chat interface
4. Visit Settings to configure models and servers

### Dependencies

- **Bootstrap 5.3.0** — Loaded from CDN for form components and modals
- **Vanilla JavaScript** — No frameworks required

### File Structure

```
wireframes/
├── index.html         # Home page
├── binder.html        # Binder workspace
├── settings.html      # Settings page
├── app.css            # Global styles
├── bookshelf.js       # Home page logic
├── binder.js          # Binder page logic
├── settings.js        # Settings page logic
└── README.md          # This file
```

## Design Tokens

All colors, spacing, and transitions are defined as CSS variables in `app.css`:

```css
:root {
    --binder-accent: #4A90D9;      /* Primary blue */
    --binder-bg: #FAF8F4;          /* Warm paper background */
    --binder-shelf-bg: linear-gradient(to bottom, #3E2F23, #5A4632);  /* Wood shelf */
    --status-ready: #4CAF50;       /* Green */
    --status-processing: #FFC107;  /* Yellow */
    --status-empty: #9E9E9E;       /* Gray */
    --status-error: #F44336;       /* Red */
    --card-radius: 8px;
    --transition-speed: 200ms;
}
```

## Key Features Implemented

### Home Page (Bookshelf)
- [x] Bookshelf grid with book spines
- [x] Dynamic spine coloring based on status
- [x] Create/Rename/Delete binders
- [x] Type-to-confirm deletion
- [x] Context menu (right-click)
- [x] Sort by last updated
- [x] Empty state
- [x] Toast notifications

### Binder Page (Workspace)
- [x] Two-pane layout (sources + chat)
- [x] Sources tree with sections
- [x] Per-file progress tracking (mock)
- [x] Error states with retry
- [x] Message history
- [x] Citation markers `[n]` (expandable)
- [x] Composer with tabs (Ask, Files, URL, Paste)
- [x] Chat style toggle (Default / Learning Guide)
- [x] Conversation management
- [x] Empty state (no sources yet)

### Settings Page
- [x] Models configuration
- [x] Retrieval settings (Top K, chunk size, overlap)
- [x] Server configuration
- [x] LAN mode warning
- [x] Ollama status checker
- [x] Available models list
- [x] Reset to defaults
- [x] Form validation
- [x] Save and cancel

## Mock Data

All pages use **mock data** for demonstration:

- **Binders** — 6 sample binders with different statuses
- **Sources** — File, URL, and pasted text sources
- **Conversations** — Sample chat with citations
- **Models** — List of available Ollama models

To connect to a real backend, replace mock data with API calls:

```javascript
// Example: Fetch binders from backend
fetch('/api/binders')
    .then(res => res.json())
    .then(data => {
        binders = data;
        renderBookshelf();
    });
```

## Backend Integration Checklist

When connecting to the Flask backend, implement these endpoints:

### Binders API
- `GET /api/binders` — List all binders
- `POST /api/binders` — Create new binder
- `PUT /api/binders/<id>` — Rename/update
- `DELETE /api/binders/<id>` — Delete binder

### Sources API
- `GET /api/binders/<id>/sources` — List sources
- `POST /api/binders/<id>/sources` — Add file/URL/paste
- `DELETE /api/sources/<id>` — Remove source
- `GET /api/sources/<id>/preview` — Get extracted text

### Conversations API
- `GET /api/binders/<id>/conversations` — List chats
- `POST /api/binders/<id>/conversations` — Create chat
- `GET /api/conversations/<id>/messages` — Get messages
- `POST /api/conversations/<id>/messages` — Send message (SSE streaming)
- `DELETE /api/conversations/<id>` — Delete chat

### Settings API
- `GET /api/settings` — Current settings
- `PUT /api/settings` — Update settings
- `GET /api/ollama/status` — Check Ollama
- `GET /api/ollama/models` — List models

## Streaming & Progress

### Server-Sent Events (SSE)
For real-time progress and streaming:

```javascript
// Listen for ingestion progress
const evtSource = new EventSource(`/api/sources/progress?source_id=123`);
evtSource.onmessage = (event) => {
    const progress = JSON.parse(event.data);
    updateProgressBar(progress.page, progress.total);
};

// Listen for chat streaming
const chatSource = new EventSource(`/api/conversations/1/stream`);
chatSource.onmessage = (event) => {
    const token = event.data;
    appendTokenToAnswer(token);
};
```

## Accessibility

- [x] Keyboard navigation (Tab, Enter)
- [x] Focus rings (blue `--binder-accent`)
- [x] ARIA labels on interactive elements
- [x] Status never by color alone (paired with icons)
- [x] Streaming text announced via `aria-live="polite"`
- [x] Form validation and error messages

## Responsive Breakpoints

- **Desktop** (1280px+) — Full two-pane layout, grid shelves
- **Tablet** (768px–1023px) — Narrower sidebars, adjusted spine width
- **Mobile** (< 768px) — Stacked layout (out of scope for v1 per spec)

## Testing

### Manual Testing Checklist

#### Home Page
- [ ] Create a new binder
- [ ] Rename a binder
- [ ] Delete a binder (type-to-confirm)
- [ ] Right-click context menu
- [ ] Click spine to open
- [ ] Toast notifications

#### Binder Page
- [ ] Add sources (files, URL, paste)
- [ ] Type a message and send
- [ ] Click citation `[n]` to expand
- [ ] Switch chat style (Default ↔ Learning Guide)
- [ ] New conversation
- [ ] Delete conversation
- [ ] Switch between composer tabs

#### Settings
- [ ] Change a setting value
- [ ] Reset section to defaults
- [ ] Check Ollama status
- [ ] Validate form (e.g., Top K range)
- [ ] Save settings

## Known Limitations

- **Mock data only** — No real backend integration
- **No persistence** — Refreshing the page resets data
- **No file uploads** — File handling is UI-only
- **No SSE streaming** — Chat responses are instant (mock)
- **No real embedding** — Sources are placeholders

## Future Improvements

- [ ] Connect to Flask backend
- [ ] Implement server-sent events for streaming
- [ ] Add real file upload and ingestion progress
- [ ] Implement drag-and-drop within sections tree
- [ ] Add search/filter binders
- [ ] Add conversation history export
- [ ] Add dark mode toggle
- [ ] Add keyboard shortcuts (⌘K, ⌘/, etc.)

## Notes

- All CSS variables can be easily tweaked in `app.css`
- Bootstrap classes are used for modal/form structure; custom CSS overrides visual style
- JavaScript is vanilla (no jQuery, no frameworks) for minimal dependencies
- Design follows the spec exactly; refer to the Wireframe Spec for interaction details

## Questions & Issues

Refer to the [Wireframe Spec](../docs/Binder%20-%20Blueprint%20-%20Wireframe%20Spec.md) for:
- Interaction details (FR-001 through FR-014)
- Open design questions (§9)
- Requirements traceability (§8)
