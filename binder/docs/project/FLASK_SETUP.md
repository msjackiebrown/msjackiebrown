# Binder Flask Application — Setup & Quickstart

## Overview

This is a complete Flask backend implementation of the **Binder** wireframes with:

- ✅ In-memory data storage (dictionary-based CRUD operations)
- ✅ REST API with 18+ endpoints for CRUD operations
- ✅ Jinja2 templates for server-side rendering
- ✅ Static assets (CSS, JavaScript) integrated with Flask
- ✅ Configuration management with environment variables
- ✅ Storage layer abstraction (ready to swap with database backend)

## Project Structure

```
binder/
├── flask_app/                      # Main Flask application
│   ├── __init__.py                 # App factory with storage init
│   ├── config.py                   # Configuration classes (dev/prod/test)
│   ├── storage.py                  # In-memory CRUD operations
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── home.py                 # Bookshelf page (GET /)
│   │   ├── binder_routes.py        # Binder workspace (GET /binder/<id>)
│   │   ├── settings.py             # Settings page (GET /settings)
│   │   └── api.py                  # REST API endpoints (/api/*)
│   ├── templates/
│   │   ├── base.html               # Base layout with Bootstrap 5 CDN
│   │   ├── home.html               # Bookshelf page template
│   │   ├── binder.html             # Binder workspace template
│   │   ├── settings.html           # Settings form template
│   │   └── error.html              # Error page template
│   ├── static/
│   │   ├── css/
│   │   │   └── app.css             # Global styling with design tokens
│   │   └── js/
│   │       ├── home.js             # Bookshelf page logic
│   │       ├── binder.js           # Workspace & chat logic
│   │       └── settings.js         # Settings form logic
│   └── requirements.txt            # Python dependencies
│
├── run.py                          # Flask entry point
├── .env.example                    # Environment variable template
└── FLASK_SETUP.md                 # This file
```

## Setup Instructions

### 1. Install Dependencies

```bash
cd binder/flask_app
pip install -r requirements.txt
```

**Key packages:**
- Flask 3.0.0 — Web framework
- python-dotenv — Environment variable loading
- requests — HTTP library

### 2. Configure Environment

Copy `.env.example` to `.env`:

```bash
cd binder
cp flask_app/.env.example flask_app/.env
```

Edit `.env` to customize:

```env
# Flask
FLASK_ENV=development
FLASK_DEBUG=1

# Database
DATABASE_URL=sqlite:///binder.db

# Ollama (LLM & Embeddings)
OLLAMA_BASE_URL=http://localhost:11434
LLM_PRIMARY=qwen3:14b
LLM_QUALITY=qwen3.5:27b
EMBEDDING_MODEL=qwen3-embedding:0.6b

# Retrieval
TOP_K=5
CHUNK_SIZE=1000
CHUNK_OVERLAP=200

# Server
BIND_ADDRESS=127.0.0.1
BIND_PORT=5000
```

### 3. Run the Application

```bash
cd binder
python run.py
```

Runs on `http://127.0.0.1:5000/` with auto-reload.

**Expected output:**
```
 * Running on http://127.0.0.1:5000
 * Debug mode: on
 * Press CTRL+C to quit
```

The app uses in-memory storage, so data persists only while the server runs. To add persistence (JSON files, PostgreSQL, etc.), modify `flask_app/storage.py`.

### 4. (Optional) Production Mode

```bash
cd binder
python run.py production
```

Uses production config with debug disabled.

## API Endpoints

All REST endpoints are under `/api/`.

### Binders

| Method | Route | Purpose |
|--------|-------|---------|
| GET | `/api/binders` | List all binders |
| POST | `/api/binders` | Create new binder |
| PUT | `/api/binders/<id>` | Update binder |
| DELETE | `/api/binders/<id>` | Delete binder |

### Sources

| Method | Route | Purpose |
|--------|-------|---------|
| GET | `/api/binders/<id>/sources` | List sources in binder |
| POST | `/api/binders/<id>/sources` | Add source to binder |
| DELETE | `/api/sources/<id>` | Delete source |

### Conversations & Messages

| Method | Route | Purpose |
|--------|-------|---------|
| GET | `/api/binders/<id>/conversations` | List conversations |
| POST | `/api/binders/<id>/conversations` | Create conversation |
| DELETE | `/api/conversations/<id>` | Delete conversation |
| GET | `/api/conversations/<id>/messages` | List messages |
| POST | `/api/conversations/<id>/messages` | Add message |

### System

| Method | Route | Purpose |
|--------|-------|---------|
| GET | `/api/ollama/status` | Check Ollama health |
| GET | `/api/settings` | Get config values |
| PUT | `/api/settings` | Update config values |

## Page Routes

| Route | Purpose |
|-------|---------|
| GET `/` | Bookshelf (home page with binder spines) |
| GET `/binder/<id>` | Binder workspace (two-pane layout) |
| GET `/settings/` | Settings form |

## Storage Architecture

The app uses a simple, framework-agnostic storage layer (`flask_app/storage.py`) with these features:

### In-Memory Data Store

Data is organized as nested dictionaries:

```python
store = {
    'binders': {id: {binder_dict}, ...},
    'sources': {id: {source_dict}, ...},
    'chunks': {id: {chunk_dict}, ...},
    'conversations': {id: {conversation_dict}, ...},
    'messages': {id: {message_dict}, ...},
    'sections': {id: {section_dict}, ...}
}
```

### CRUD Operations

30+ helper functions in `storage.py` handle all operations:

| Operation | Functions |
|-----------|-----------|
| **Binders** | `create_binder()`, `get_binder()`, `get_all_binders()`, `update_binder()`, `delete_binder()` |
| **Sources** | `create_source()`, `get_source()`, `get_sources_for_binder()`, `delete_source()` |
| **Chunks** | `create_chunk()`, `get_chunks_for_source()` |
| **Conversations** | `create_conversation()`, `get_conversation()`, `get_conversations_for_binder()`, `delete_conversation()` |
| **Messages** | `create_message()`, `get_messages_for_conversation()`, `delete_message()` |
| **Sections** | `create_section()`, `get_sections_for_binder()` |

### Cascade Deletes

Deleting a binder automatically removes associated:
- All sources
- All chunks for those sources
- All conversations
- All messages in those conversations

### Data Access

Routes access the store via Flask's application context:

```python
from flask import current_app
binders = get_all_binders(current_app.store)
```

### Future: Adding Persistence

To add persistence (JSON files, PostgreSQL, MongoDB, etc.), implement `load_store()` and `save_store()` functions in `storage.py` and call them from the app factory:

```python
# flask_app/__init__.py
store = load_store('data/store.json')  # Load from disk
app.store = store

@app.teardown_appcontext
def save_on_shutdown(exception):
    save_store(store, 'data/store.json')  # Save on shutdown
```

## Frontend Integration

### JavaScript Files

The three JavaScript files (`home.js`, `binder.js`, `settings.js`) are already set up to call the backend API:

**home.js** (`/static/js/home.js`):
- `loadBinders()` — Fetches `/api/binders`
- `createSpineElement(binder)` — Renders spine from API response
- `showNewBinderModal()` — Posts to `/api/binders`
- `showRenameModal(binder)` — Puts to `/api/binders/<id>`
- `showDeleteModal(binder)` — Deletes `/api/binders/<id>`
- `checkOllamaStatus()` — Polls `/api/ollama/status`

**binder.js** (`/static/js/binder.js`):
- `loadConversations()` — Fetches `/api/binders/<id>/conversations`
- `loadMessages(convoId)` — Fetches `/api/conversations/<id>/messages`
- `sendMessage()` — Posts to `/api/conversations/<id>/messages`
- Simulates assistant response with 1-second delay

**settings.js** (`/static/js/settings.js`):
- `saveSettings()` — Puts to `/api/settings`
- Includes validation for Top K (3–10), chunk sizes, etc.

### Design Tokens

CSS uses 13 root custom properties (`--binder-accent`, `--status-ready`, etc.) from `app.css`:

```css
:root {
  --binder-accent: #4A90D9;          /* Main brand color */
  --binder-bg: #FAF8F4;              /* Warm paper background */
  --status-ready: #27AE60;           /* Green check */
  --status-processing: #F39C12;      /* Orange spinner */
  --status-error: #E74C3C;           /* Red X */
  --status-empty: #95A5A6;           /* Gray */
  /* ... plus 7 more */
}
```

## Configuration Classes

### Base Config
All environments inherit from `BaseConfig`:
- Database path: `sqlite:///binder.db`
- Ollama URL: `http://localhost:11434`
- Default models and retrieval params
- Loaded from `.env` file

### DevelopmentConfig
- `FLASK_DEBUG = True`
- Auto-reload on file changes
- Detailed error pages

### ProductionConfig
- `FLASK_DEBUG = False`
- SQLALCHEMY_ECHO = False (no query logging)
- Stricter error handling

### TestingConfig
- In-memory SQLite: `sqlite:///:memory:`
- Disable CSRF for testing

## Common Tasks

### Add a New API Endpoint

1. Edit `flask_app/routes/api.py`
2. Create a new route function:

```python
@api_bp.route('/my-endpoint', methods=['POST'])
def my_endpoint():
    data = request.get_json()
    # Process data
    return jsonify({'result': ...}), 200
```

3. JavaScript can call it:

```javascript
fetch('/api/my-endpoint', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key: 'value' })
})
.then(r => r.json())
.then(data => console.log(data))
```

### Add a New Page

1. Create template in `flask_app/templates/mypage.html`
2. Create route in `flask_app/routes/mypage.py`
3. Create blueprint and register in `__init__.py`
4. Add CSS to `static/css/app.css`
5. Add JavaScript to `static/js/mypage.js`

### Update Database Schema

Edit models in `flask_app/models/__init__.py`, then:

```bash
flask --app flask_app init-db
```

⚠️ **Warning:** This recreates the database (data loss). For production, use [Alembic migrations](https://alembic.sqlalchemy.org/).

## Troubleshooting

### "ModuleNotFoundError: No module named 'flask'"

Make sure you installed dependencies in the correct Python environment:

```bash
python -m pip install -r flask_app/requirements.txt
```

### "Address already in use" on port 5000

Either:
1. Kill the previous Flask process
2. Change port in `.env`: `BIND_PORT=5001`

### Data loss on server restart

The in-memory store doesn't persist data. To add persistence:

1. Implement `load_store()` and `save_store()` in `storage.py`
2. Call in `flask_app/__init__.py`:
   ```python
   store = load_store('data/store.json')
   app.store = store
   ```

3. Example (JSON files):
   ```python
   import json
   def load_store(path):
       try:
           with open(path, 'r') as f:
               return json.load(f)
       except FileNotFoundError:
           return init_storage({})
   
   def save_store(store, path):
       with open(path, 'w') as f:
           json.dump(store, f)
   ```

### Ollama unreachable banner

If Ollama status check fails, make sure:

```bash
curl http://localhost:11434/api/tags
```

Returns JSON. If it doesn't, install [Ollama](https://ollama.ai) or adjust `OLLAMA_BASE_URL` in `.env`.

## Next Steps

### High Priority

1. **Add persistence** (JSON files or SQLite)
   - Implement `load_store()` and `save_store()` in `storage.py`
   - Load on startup, save on shutdown

2. **Implement file upload** (`/api/binders/<id>/sources/upload`)
   - Handle multipart/form-data
   - Extract text from PDF/DOCX
   - Chunk and embed with Ollama

3. **Integrate embeddings** (`utils/embeddings.py`)
   - Send chunks to Ollama embedding model
   - Store vectors in chunks
   - Implement semantic search

4. **Stream chat responses** (`/api/conversations/<id>/stream`)
   - Use Server-Sent Events (SSE)
   - Stream tokens from Ollama
   - Update UI in real-time

5. **Implement LLM generation**
   - Take top-K chunks + user question
   - Call Ollama generate API
   - Format citations inline

### Medium Priority

6. Add comprehensive error handling and validation
7. Implement logging throughout
8. Write unit tests for storage and API endpoints
9. Add pagination for large result sets
10. Implement caching (in-memory or Redis)

### Lower Priority

11. Authentication & authorization
12. User profiles & sharing
13. Export/backup functionality
14. Performance monitoring
15. Full-text search

## References

- [Flask Documentation](https://flask.palletsprojects.com/)
- [SQLAlchemy ORM](https://docs.sqlalchemy.org/)
- [Bootstrap 5 Docs](https://getbootstrap.com/docs/5.0/)
- [Ollama API](https://github.com/ollama/ollama/blob/main/docs/api.md)

---

**Last Updated:** 2024
