# Binder Flask Application Architecture

## 📊 System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Web Browser                              │
│                                                                  │
│  Home Page       Binder Page      Settings Page                │
│  (Bookshelf)     (Workspace)      (Config Form)                │
└──────────────────────────────────────────────────────────────────┘
                                 │
                    ┌────────────┼────────────┐
                    │            │            │
                    ▼            ▼            ▼
            ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
            │  home.js     │  │ binder.js    │  │settings.js   │
            │(API calls)   │  │(Chat logic)  │  │(Form handler)│
            └──────────────┘  └──────────────┘  └──────────────┘
                    │            │            │
                    └────────────┼────────────┘
                                 │
                         ┌───────▼────────┐
                         │  REST API      │
                         │  /api/*        │
                         └────────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         │                       │                       │
         ▼                       ▼                       ▼
    ┌─────────────┐         ┌─────────────┐        ┌─────────────┐
    │ Binders     │         │ Sources     │        │ Conversations
    │ /api/       │         │ /api/       │        │ /api/
    │ binders/*   │         │ sources/*   │        │ conversations/*
    └─────────────┘         └─────────────┘        └─────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │  SQLAlchemy ORM        │
                    │  (Model Layer)         │
                    └────────────────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         │                       │                       │
         ▼                       ▼                       ▼
    ┌─────────────┐         ┌─────────────┐        ┌─────────────┐
    │  Binder     │         │  Source     │        │ Conversation│
    │  Model      │         │  Model      │        │  Model      │
    └─────────────┘         └─────────────┘        └─────────────┘
         │                       │                       │
         │                       ▼                       │
         │                   ┌─────────────┐            │
         │                   │  Chunk      │            │
         │                   │  Model      │            │
         │                   └─────────────┘            │
         │                                              │
         │                       ┌─────────────┐        │
         │                       │  Section    │        │
         │                       │  Model      │        │
         │                       └─────────────┘        │
         │                                              │
         └──────────────────────┬───────────────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │   SQLite Database      │
                    │  (Development)         │
                    │  or PostgreSQL         │
                    │  (Production)          │
                    └────────────────────────┘
```

## 🔄 Request/Response Flow

### User Creates a Binder

```
Browser (UI)
    │
    └─→ fetch POST /api/binders
            {title: "Chapter 4", description: "Notes"}
            │
            ▼
        Flask Router
            │
            └─→ routes/api.py
                create_binder()
                    │
                    ▼
                Validate data
                    │
                    ▼
                Create Binder model instance
                    │
                    ▼
                db.session.add(binder)
                db.session.commit()
                    │
                    ▼
                Return binder.to_dict() as JSON
            │
            ▼
        Browser receives JSON
        JavaScript: loadBinders() called
        Re-renders spines
        Toast: "✓ Binder created"
```

### User Sends a Message

```
Browser (Chat UI)
    │
    ├─→ fetch POST /api/conversations/<id>/messages
    │       {role: "user", content: "What is...?"}
    │
    └─→ Server receives message
            │
            ▼
        Create Message model
        db.session.add(message)
        db.session.commit()
            │
            ▼
        Return message JSON
            │
        Browser renders message
        Calls loadMessages() to refresh
```

## 🏗️ Directory Structure & Dependencies

```
binder/
│
├── flask_app/                     ← Main application package
│   │
│   ├── __init__.py               ← App factory
│   │   └─→ imports: config, SQLAlchemy, blueprints
│   │   └─→ exports: create_app(), db
│   │
│   ├── config.py                 ← Configuration classes
│   │   └─→ BaseConfig
│   │   └─→ DevelopmentConfig
│   │   └─→ ProductionConfig
│   │   └─→ TestingConfig
│   │
│   ├── models/
│   │   └── __init__.py           ← ORM models
│   │       └─→ Binder, Source, Chunk, Conversation, Message, Section
│   │       └─→ db instance (SQLAlchemy)
│   │
│   ├── routes/                   ← Flask blueprints
│   │   ├── home.py              ← home_bp (GET /)
│   │   ├── binder_routes.py     ← binder_bp (GET /binder/<id>)
│   │   ├── settings.py          ← settings_bp (GET /settings)
│   │   └── api.py               ← api_bp (REST endpoints)
│   │
│   ├── templates/                ← Jinja2 templates
│   │   ├── base.html            ← Layout (inherited by others)
│   │   ├── home.html            ← Bookshelf page
│   │   ├── binder.html          ← Workspace page
│   │   └── settings.html        ← Settings page
│   │
│   ├── static/                   ← Static assets
│   │   ├── css/
│   │   │   └── app.css          ← Global styling + design tokens
│   │   └── js/
│   │       ├── home.js          ← Bookshelf JavaScript
│   │       ├── binder.js        ← Workspace JavaScript
│   │       └── settings.js      ← Settings JavaScript
│   │
│   ├── requirements.txt          ← Python dependencies
│   └── .env.example             ← Configuration template
│
├── run.py                        ← Entry point
│
├── README_FLASK_APP.md          ← Quick start
├── FLASK_SETUP.md               ← Detailed setup
├── DEPLOYMENT_CHECKLIST.md      ← Next steps
├── IMPLEMENTATION_SUMMARY.md    ← Delivery summary
└── docs/                        ← Documentation
    └── Binder - Blueprint - Wireframe Spec.md  ← Original spec
```

## 🔗 API Endpoint Organization

```
/                          ← Static Pages (Jinja2)
├── GET /                  routes/home.py → render home.html
├── GET /binder/<id>       routes/binder_routes.py → render binder.html
└── GET /settings/         routes/settings.py → render settings.html

/api/                      ← REST API (JSON)
├── /api/binders
│   ├── GET                routes/api.py::get_binders()
│   ├── POST               routes/api.py::create_binder()
│   ├── /<id>
│   │   ├── PUT            routes/api.py::update_binder()
│   │   ├── DELETE         routes/api.py::delete_binder()
│   │   ├── /sources
│   │   │   ├── GET        routes/api.py::get_sources()
│   │   │   └── POST       routes/api.py::add_source()
│   │   └── /conversations
│   │       ├── GET        routes/api.py::get_conversations()
│   │       └── POST       routes/api.py::create_conversation()
│   └── /sources/<id>
│       └── DELETE         routes/api.py::delete_source()
│
├── /api/conversations/<id>
│   ├── DELETE             routes/api.py::delete_conversation()
│   ├── /messages
│   │   ├── GET            routes/api.py::get_messages()
│   │   └── POST           routes/api.py::add_message()
│   └── /stream            [FUTURE] Server-Sent Events
│
├── /api/ollama
│   └── /status            routes/api.py::ollama_status()
│
└── /api/settings
    ├── GET                routes/api.py::get_settings()
    └── PUT                routes/api.py::update_settings()
```

## 📊 Database Schema Overview

```
┌─────────────┐         ┌─────────────┐
│   Binder    │◄────────│   Section   │ (Hierarchical)
│             │         │             │
│ - id        │         │ - id        │
│ - title     │         │ - binder_id │
│ - desc      │         │ - parent_id │
│ - status    │         │ - title     │
│ - created   │         └─────────────┘
│ - updated   │
└──────┬──────┘
       │ 1:∞
       ├──────────────────────┬──────────────────────┐
       │                      │                      │
       ▼                      ▼                      ▼
┌──────────────┐    ┌──────────────────┐   ┌──────────────────┐
│   Source     │    │   Conversation   │   │   Message        │
│              │    │                  │   │                  │
│ - id         │    │ - id             │   │ - id             │
│ - title      │    │ - binder_id      │   │ - convo_id       │
│ - type       │    │ - title          │   │ - role           │
│ - status     │    │ - created        │   │ - content        │
│ - binder_id  │    │ - updated        │   │ - style          │
└──────┬───────┘    └──────────────────┘   │ - citations      │
       │ 1:∞               ▲               │ - created        │
       │                   │ 1:∞           └──────────────────┘
       ▼                   │
┌──────────────┐           │
│   Chunk      │           │
│              │           │
│ - id         │           │
│ - source_id  │           │
│ - text       │           │
│ - embedding  │           │
│ - metadata   │           │
└──────────────┘           │
                           │
                    [Future Connection]
                    Message → Chunks (Citations)
```

## ⚙️ Configuration Flow

```
┌─────────────────────────────┐
│  .env file                  │
│  (Environment variables)    │
└──────────────┬──────────────┘
               │
               ▼
       ┌───────────────────┐
       │  python-dotenv    │
       │  (Loader)         │
       └───────────────────┘
               │
               ▼
       ┌───────────────────┐
       │  config.py        │
       │  (Config classes) │
       └───────────────────┘
               │
               ├─→ BaseConfig
               │   (All environments)
               │
               ├─→ DevelopmentConfig
               │   (DEBUG=True)
               │
               ├─→ ProductionConfig
               │   (DEBUG=False)
               │
               └─→ TestingConfig
                   (SQLite memory DB)
               │
               ▼
       ┌───────────────────┐
       │  create_app()     │
       │  (app factory)    │
       └───────────────────┘
               │
               ▼
       ┌───────────────────┐
       │  Flask app.config │
       │  (Runtime config) │
       └───────────────────┘
```

## 🔐 Error Handling Flow

```
User Request
    │
    ▼
Flask Router
    │
    ├─→ Route not found
    │   │
    │   └─→ @app.errorhandler(404)
    │       └─→ Return 404 JSON
    │
    ├─→ Invalid request data
    │   │
    │   └─→ @app.errorhandler(400)
    │       └─→ Return 400 JSON
    │
    ├─→ Database error / Unhandled exception
    │   │
    │   └─→ @app.errorhandler(500)
    │       └─→ Return 500 JSON + log error
    │
    └─→ Success (200, 201)
        │
        └─→ Return JSON response
```

## 🔄 Data Flow: File Upload (Future)

```
User selects file
    │
    ▼
HTML <input type="file">
    │
    ▼
JavaScript: POST /api/binders/<id>/sources/upload
    (multipart/form-data)
    │
    ▼
Flask: Upload handler (routes/api.py)
    │
    ├─→ Save file to data/uploads/
    ├─→ Extract text (PDF/DOCX/TXT parser)
    ├─→ Create Source record
    ├─→ Split text into chunks
    ├─→ Create Chunk records
    ├─→ Generate embeddings (Ollama)
    ├─→ Store in ChromaDB
    └─→ Update Source status → "ready"
    │
    ▼
Return Source JSON
    │
    ▼
Browser updates source list
    │
    ▼
User can now ask questions about the source
```

---

## Legend

```
┌─────┐      Box = Component/Module
│     │
└─────┘      
   │
   ▼         Arrow = Data flow / Dependency
   
1:∞          Relationship = One-to-many
∞←1          Relationship = Many-to-one
```
