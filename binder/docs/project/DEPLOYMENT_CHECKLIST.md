# Binder Flask Application — Deployment Checklist

## ✅ Completed

### Project Structure
- [x] `flask_app/` directory with app factory pattern
- [x] `models/__init__.py` with 6 SQLAlchemy models
- [x] `routes/` with 4 blueprints (home, binder, settings, api)
- [x] `templates/` with Jinja2 inheritance (base + 3 pages)
- [x] `static/css/` with design token CSS
- [x] `static/js/` with 3 interactive pages
- [x] `config.py` with dev/prod/test configs
- [x] `requirements.txt` with all dependencies
- [x] `.env.example` template
- [x] `run.py` entry point

### Database & Models
- [x] Binder model (title, description, status, relationships)
- [x] Source model (title, type, status, chunks)
- [x] Chunk model (text, embedding, metadata)
- [x] Conversation model (title, messages)
- [x] Message model (role, content, style, citations)
- [x] Section model (hierarchical, parent_section_id)
- [x] All models have `to_dict()` serialization
- [x] All relationships use cascade delete

### REST API
- [x] GET/POST/PUT/DELETE `/api/binders`
- [x] GET/POST `/api/binders/<id>/sources`
- [x] DELETE `/api/sources/<id>`
- [x] GET/POST `/api/binders/<id>/conversations`
- [x] DELETE `/api/conversations/<id>`
- [x] GET/POST `/api/conversations/<id>/messages`
- [x] GET `/api/ollama/status`
- [x] GET/PUT `/api/settings`

### Page Routes
- [x] GET `/` → Home (bookshelf)
- [x] GET `/binder/<id>` → Binder workspace
- [x] GET `/settings/` → Settings form

### Templates & Frontend
- [x] `base.html` with Bootstrap 5 CDN
- [x] `home.html` with spine rendering
- [x] `binder.html` with two-pane layout
- [x] `settings.html` with form fields
- [x] `app.css` with 13 design tokens
- [x] `home.js` with API integration
- [x] `binder.js` with chat logic
- [x] `settings.js` with form handling

### Configuration & Deployment
- [x] Environment variable support (.env)
- [x] Debug mode for development
- [x] CORS headers (if needed)
- [x] Error handlers (404, 500, 400)
- [x] Database initialization CLI commands
- [x] Sample data generation CLI commands

### Testing & Verification
- [x] All imports use relative paths (fixed)
- [x] Flask app initializes without errors
- [x] All 18 API routes registered
- [x] Flask development server starts successfully
- [x] HTTP 200 response on `/`
- [x] Database tables created on startup

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd binder/flask_app
python -m pip install -r requirements.txt
```

### 2. Configure Environment
```bash
cd binder
cp flask_app/.env.example flask_app/.env
# Edit .env if needed (Ollama URL, model names, etc.)
```

### 3. Initialize Database
```bash
cd binder
python run.py
# Server starts on http://127.0.0.1:5000
```

### 4. Test Pages
- Bookshelf: http://127.0.0.1:5000/
- Settings: http://127.0.0.1:5000/settings/
- Create a binder, then visit /binder/<id>

---

## 📋 Next Steps (Priority Order)

### Phase 1: File Handling (Required for MVP)
- [ ] Create `/api/binders/<id>/sources/upload` endpoint
- [ ] Handle multipart/form-data in Flask
- [ ] Extract text from files (PDF, DOCX, TXT)
- [ ] Store in `data/uploads/` directory
- [ ] Create Source records + Chunks

### Phase 2: Embeddings & Retrieval (Required for MVP)
- [ ] Integrate ChromaDB client in `utils/chromadb.py`
- [ ] Call Ollama embedding API for chunks
- [ ] Store vectors in ChromaDB collections
- [ ] Implement similarity search on chat queries
- [ ] Return top-K chunks with scores

### Phase 3: LLM Generation (Required for MVP)
- [ ] Call Ollama generate API with context
- [ ] Format retrieved chunks as context
- [ ] Handle streaming responses (SSE)
- [ ] Format inline citations [1], [2], etc.
- [ ] Handle Ollama errors gracefully

### Phase 4: UI/UX Polish (Nice to Have)
- [ ] File upload progress bar
- [ ] Spinner during ingestion
- [ ] Error messages for failed chunks
- [ ] Conversation auto-naming
- [ ] Source list in left pane

### Phase 5: Production Readiness (Before Deploy)
- [ ] Add Alembic migrations
- [ ] Implement logging (Python logging module)
- [ ] Add request validation (marshmallow or Pydantic)
- [ ] Write unit tests (pytest)
- [ ] Add database connection pooling
- [ ] Set up WSGI server (Gunicorn)
- [ ] Configure reverse proxy (Nginx)

---

## 🔧 Configuration Reference

### `.env` Variables

```env
# Flask Runtime
FLASK_ENV=development
FLASK_DEBUG=1

# Database
DATABASE_URL=sqlite:///binder.db

# LLM & Embeddings
OLLAMA_BASE_URL=http://localhost:11434
LLM_PRIMARY=qwen3:14b
LLM_QUALITY=qwen3.5:27b
EMBEDDING_MODEL=qwen3-embedding:0.6b

# Retrieval Settings
TOP_K=5                    # Number of chunks to retrieve
CHUNK_SIZE=1000           # Characters per chunk
CHUNK_OVERLAP=200         # Overlap between chunks

# Server
BIND_ADDRESS=127.0.0.0    # 127.0.0.1 = localhost only
BIND_PORT=5000
```

---

## 📊 Database Schema

```sql
-- Binders (Root entity)
CREATE TABLE binder (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'empty',
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Sources (Files, URLs, pasted text)
CREATE TABLE source (
  id TEXT PRIMARY KEY,
  binder_id TEXT FOREIGN KEY,
  title TEXT NOT NULL,
  source_type TEXT,  -- 'file', 'url', 'paste'
  status TEXT,
  created_at TIMESTAMP
);

-- Chunks (Embeddings for retrieval)
CREATE TABLE chunk (
  id TEXT PRIMARY KEY,
  source_id TEXT FOREIGN KEY,
  text TEXT,
  embedding BLOB,  -- Vector from Ollama
  metadata JSON
);

-- Conversations (Chat sessions)
CREATE TABLE conversation (
  id TEXT PRIMARY KEY,
  binder_id TEXT FOREIGN KEY,
  title TEXT,
  created_at TIMESTAMP
);

-- Messages (Chat history)
CREATE TABLE message (
  id TEXT PRIMARY KEY,
  conversation_id TEXT FOREIGN KEY,
  role TEXT,  -- 'user', 'assistant'
  content TEXT,
  style TEXT,  -- 'Default', 'Learning Guide'
  citations JSON,  -- [[source_id, chunk_id], ...]
  created_at TIMESTAMP
);

-- Sections (Hierarchical folders)
CREATE TABLE section (
  id TEXT PRIMARY KEY,
  binder_id TEXT FOREIGN KEY,
  parent_section_id TEXT FOREIGN KEY,
  title TEXT,
  status TEXT
);
```

---

## 🧪 Manual Testing Commands

### Test API with curl

```bash
# Get all binders
curl http://127.0.0.1:5000/api/binders

# Create a binder
curl -X POST http://127.0.0.1:5000/api/binders \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","description":"My test"}'

# Check Ollama status
curl http://127.0.0.1:5000/api/ollama/status

# Get settings
curl http://127.0.0.1:5000/api/settings
```

### Test Pages in Browser

| URL | Expected |
|-----|----------|
| http://127.0.0.1:5000/ | Bookshelf with "Your shelf is empty" message |
| http://127.0.0.1:5000/settings/ | Settings form with Ollama URL, models, etc. |
| http://127.0.0.1:5000/binder/invalid | 404 error |

---

## 🐛 Common Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| "ModuleNotFoundError: No module named 'flask_sqlalchemy'" | Wrong Python environment | `python -m pip install -r requirements.txt` |
| Address already in use | Port 5000 is taken | Change `BIND_PORT` in `.env` |
| Database locked | SQLite concurrency | Switch to PostgreSQL for production |
| Ollama unreachable banner | Ollama not running | `ollama serve` or adjust `OLLAMA_BASE_URL` |
| Static files 404 | Flask not finding CSS/JS | Ensure `flask_app/static/` exists with subdirectories |
| "Jinja2 undefined variable" | Template variable not passed | Check `render_template()` in route |

---

## 📚 File Manifest

### Critical Files (Must Exist)
- `flask_app/__init__.py` — App factory
- `flask_app/config.py` — Configuration
- `flask_app/models/__init__.py` — Database models
- `flask_app/routes/*.py` — All 4 blueprints
- `flask_app/templates/base.html` — Layout
- `flask_app/static/css/app.css` — Styling
- `run.py` — Entry point
- `requirements.txt` — Dependencies

### Important Files (Enable Features)
- `flask_app/templates/home.html` — Bookshelf rendering
- `flask_app/templates/binder.html` — Workspace
- `flask_app/templates/settings.html` — Settings
- `flask_app/static/js/home.js` — Bookshelf logic
- `flask_app/static/js/binder.js` — Workspace + chat
- `flask_app/static/js/settings.js` — Settings form
- `.env` — Environment configuration

### Documentation
- `FLASK_SETUP.md` — Detailed setup guide
- `DEPLOYMENT_CHECKLIST.md` — This file

---

## ✨ Key Features Implemented

✅ **Full ORM**: All entities modeled with proper relationships
✅ **REST API**: Comprehensive endpoints for CRUD operations
✅ **Server-Side Rendering**: Jinja2 templates + Flask routes
✅ **Frontend Integration**: JavaScript files call API endpoints
✅ **Design System**: CSS with 13 custom properties
✅ **Configuration**: Environment-based settings
✅ **Error Handling**: 404, 500, 400 handlers
✅ **Database CLI**: init-db and create-sample-data commands
✅ **Development Mode**: Auto-reload + debug output

---

**Status:** ✅ Ready for Phase 1 (File Handling)

Next: Implement file upload + text extraction → Chunk storage → Embedding integration
