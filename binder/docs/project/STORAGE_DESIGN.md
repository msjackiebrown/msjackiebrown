# Storage Layer Design

## Overview

The Binder Flask app uses a **simple, framework-agnostic storage layer** with CRUD operations organized by entity type. This design allows you to:

1. **Develop quickly** with in-memory data (no database setup needed)
2. **Defer database decisions** until the architecture is finalized
3. **Swap backends easily** by implementing `load_store()` and `save_store()`
4. **Keep business logic separate** from persistence logic

## Architecture

### Storage Dictionary

All data is organized in a single nested dictionary:

```python
store = {
    'binders': {
        'uuid-1': {binder_dict},
        'uuid-2': {binder_dict},
        ...
    },
    'sources': {
        'uuid-1': {source_dict},
        'uuid-2': {source_dict},
        ...
    },
    'chunks': {
        'uuid-1': {chunk_dict},
        ...
    },
    'conversations': {
        'uuid-1': {conversation_dict},
        ...
    },
    'messages': {
        'uuid-1': {message_dict},
        ...
    },
    'sections': {
        'uuid-1': {section_dict},
        ...
    }
}
```

### Key Features

| Feature | Implementation |
|---------|-----------------|
| **ID Generation** | `uuid.uuid4()` — Unique, collision-free, globally distributed |
| **Timestamps** | ISO format strings (`datetime.utcnow().isoformat()`) — Language-agnostic, sortable |
| **Data Access** | Flask app context (`current_app.store`) — Accessible from all routes |
| **Cascade Delete** | Manual implementation — Deleting a binder removes all sources, chunks, conversations, messages |
| **Validation** | In route handlers — Check binder exists before adding sources |
| **Error Handling** | Storage functions return `None` on not found, routes return HTTP 404 |

## Storage Module (`flask_app/storage.py`)

Contains 30+ helper functions organized by entity type:

### Utilities

```python
def init_storage(store):
    """Initialize empty storage dict"""
    store['binders'] = {}
    store['sources'] = {}
    store['chunks'] = {}
    store['conversations'] = {}
    store['messages'] = {}
    store['sections'] = {}
    return store
```

### Binder Operations

```python
create_binder(store, title, description='')
get_binder(store, binder_id)
get_all_binders(store)
update_binder(store, binder_id, **kwargs)
delete_binder(store, binder_id)  # Cascade deletes sources, chunks, conversations
```

**Example:**
```python
binder = create_binder(store, title="My Binder", description="RAG workspace")
# Returns: {'id': 'uuid', 'title': 'My Binder', 'description': '...', 'status': 'empty', 'created_at': '...', 'updated_at': '...'}
```

### Source Operations

```python
create_source(store, binder_id, title, source_type='file')
get_source(store, source_id)
get_sources_for_binder(store, binder_id)
delete_source(store, source_id)  # Cascade deletes chunks
```

**Example:**
```python
source = create_source(store, binder_id, title="paper.pdf", source_type="file")
sources = get_sources_for_binder(store, binder_id)  # Returns list of dicts
```

### Chunk Operations

```python
create_chunk(store, source_id, text, metadata={})
get_chunks_for_source(store, source_id)
```

**Example:**
```python
chunk = create_chunk(store, source_id, text="First paragraph of the paper...", metadata={'page': 1})
chunks = get_chunks_for_source(store, source_id)  # Returns list of dicts
```

### Conversation Operations

```python
create_conversation(store, binder_id, title='')
get_conversation(store, conversation_id)
get_conversations_for_binder(store, binder_id)
delete_conversation(store, conversation_id)  # Cascade deletes messages
```

**Example:**
```python
conv = create_conversation(store, binder_id, title="Exploring section 3")
convs = get_conversations_for_binder(store, binder_id)  # Returns list
```

### Message Operations

```python
create_message(store, conversation_id, role, content, style='Default', citations=[])
get_messages_for_conversation(store, conversation_id)
delete_message(store, message_id)
```

**Example:**
```python
msg = create_message(store, conversation_id, 
                    role='user', 
                    content="What's on page 5?",
                    citations=[['src-id', 'chunk-id']])
messages = get_messages_for_conversation(store, conversation_id)  # Returns list
```

### Section Operations

```python
create_section(store, binder_id, title, parent_section_id=None)
get_sections_for_binder(store, binder_id)
get_subsections(store, section_id)
```

**Example:**
```python
section = create_section(store, binder_id, title="Chapter 1", parent_section_id=None)
subsection = create_section(store, binder_id, title="Section 1.1", parent_section_id=section['id'])
```

## Using Storage in Routes

### Pattern 1: Import and Use

```python
from flask import Blueprint, request, jsonify, current_app
from ..storage import create_binder, get_all_binders

binder_bp = Blueprint('binder', __name__)

@binder_bp.route('/binders', methods=['GET'])
def list_binders():
    binders = get_all_binders(current_app.store)
    return jsonify(binders), 200
```

### Pattern 2: Validate Before Mutating

```python
@binder_bp.route('/binders/<binder_id>/sources', methods=['POST'])
def add_source(binder_id):
    # Verify binder exists
    if not get_binder(current_app.store, binder_id):
        return jsonify({'error': 'Binder not found'}), 404
    
    data = request.get_json()
    source = create_source(current_app.store, binder_id, 
                          title=data['title'],
                          source_type=data.get('source_type', 'file'))
    return jsonify(source), 201
```

### Pattern 3: Cascade Operations

```python
@binder_bp.route('/binders/<binder_id>', methods=['DELETE'])
def delete_binder_route(binder_id):
    # delete_binder() automatically removes all sources, chunks, conversations, messages
    if delete_binder(current_app.store, binder_id):
        return jsonify({'message': 'Deleted'}), 200
    return jsonify({'error': 'Not found'}), 404
```

## Adding Persistence

### Option 1: JSON Files

Save/load the entire store from a JSON file:

```python
# storage.py
import json

def load_store(path='data/store.json'):
    """Load store from JSON file"""
    try:
        with open(path, 'r') as f:
            store = json.load(f)
    except FileNotFoundError:
        store = {}
    return init_storage(store)

def save_store(store, path='data/store.json'):
    """Save store to JSON file"""
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w') as f:
        json.dump(store, f, indent=2)
```

Then in `flask_app/__init__.py`:

```python
from .storage import load_store, save_store

store = load_store('data/store.json')

def create_app(config_name='development'):
    app = Flask(__name__, ...)
    app.store = store
    
    @app.teardown_appcontext
    def shutdown(exception=None):
        save_store(store, 'data/store.json')
    
    return app
```

### Option 2: SQLite

Replace the dict with SQLAlchemy models:

```python
# storage.py
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Binder(db.Model):
    id = db.Column(db.String(36), primary_key=True)
    title = db.Column(db.String(256), nullable=False)
    # ... other fields

def create_binder(store, title, description=''):
    """Store ignored; uses SQLAlchemy"""
    binder = Binder(id=generate_id(), title=title, description=description)
    db.session.add(binder)
    db.session.commit()
    return binder.to_dict()
```

Then routes remain **exactly the same** — they don't know the difference!

### Option 3: PostgreSQL / MongoDB

Same approach as SQLite — wrap the storage functions with database operations:

```python
def create_binder(store, title, description=''):
    """Store ignored; uses MongoDB"""
    binder = {
        '_id': generate_id(),
        'title': title,
        'description': description,
        # ...
    }
    db.binders.insert_one(binder)
    return binder
```

Routes stay unchanged.

## Testing Storage

Create a test store without file I/O:

```python
# test_api.py
import pytest
from flask_app.storage import init_storage, create_binder, get_binder

def test_create_binder():
    store = {}
    init_storage(store)
    
    binder = create_binder(store, title="Test")
    assert binder['title'] == "Test"
    
    fetched = get_binder(store, binder['id'])
    assert fetched is not None
    assert fetched['id'] == binder['id']
```

## Data Model Details

### Binder
```python
{
    'id': str,                  # UUID
    'title': str,               # Display name
    'description': str,         # One-line summary
    'status': str,              # 'empty', 'processing', 'ready', 'error'
    'created_at': str,          # ISO timestamp
    'updated_at': str           # ISO timestamp
}
```

### Source
```python
{
    'id': str,                  # UUID
    'binder_id': str,           # Parent binder
    'title': str,               # File name or URL
    'source_type': str,         # 'file', 'url', 'paste'
    'status': str,              # 'empty', 'processing', 'ready', 'error'
    'created_at': str,          # ISO timestamp
    'updated_at': str           # ISO timestamp
}
```

### Chunk
```python
{
    'id': str,                  # UUID
    'source_id': str,           # Parent source
    'text': str,                # Chunk content
    'embedding': list|None,     # Float vector (future)
    'metadata': dict            # {'page': 1, 'section': '...', ...}
}
```

### Conversation
```python
{
    'id': str,                  # UUID
    'binder_id': str,           # Parent binder
    'title': str,               # Auto-generated or user-set
    'created_at': str,          # ISO timestamp
    'updated_at': str           # ISO timestamp
}
```

### Message
```python
{
    'id': str,                  # UUID
    'conversation_id': str,     # Parent conversation
    'role': str,                # 'user' or 'assistant'
    'content': str,             # Message text
    'style': str,               # 'Default', 'Learning Guide'
    'citations': list,          # [[source_id, chunk_id], ...]
    'created_at': str           # ISO timestamp
}
```

### Section (Hierarchical)
```python
{
    'id': str,                  # UUID
    'binder_id': str,           # Parent binder
    'parent_section_id': str|None,  # For nesting
    'title': str,               # Folder/section name
    'status': str               # 'empty', 'processing', 'ready', 'error'
}
```

## Summary

This design gives you:

✅ **Rapid development** — No database setup, just Python dicts  
✅ **Flexibility** — Swap backends later without changing route code  
✅ **Simplicity** — 30+ functions vs complex ORM patterns  
✅ **Testing** — Easy to mock and test without fixtures  
✅ **Scalability** — Ready for PostgreSQL, MongoDB, etc.

When you decide on a database, update `storage.py` and leave routes untouched. The Flask app doesn't care.
