"""
In-memory data storage for Binder
Simple dict-based storage for binders, sources, conversations, messages
"""

import uuid
from datetime import datetime


def init_storage(store):
    """Initialize empty data store"""
    store.update({
        'binders': {},
        'sources': {},
        'chunks': {},
        'conversations': {},
        'messages': {},
        'sections': {}
    })


def generate_id():
    """Generate a unique ID"""
    return str(uuid.uuid4())


def get_timestamp():
    """Get current timestamp"""
    return datetime.utcnow().isoformat()


# ============================================================
# BINDER OPERATIONS
# ============================================================

def create_binder(store, title, description=''):
    """Create a new binder"""
    binder_id = generate_id()
    binder = {
        'id': binder_id,
        'title': title,
        'description': description,
        'status': 'empty',
        'created_at': get_timestamp(),
        'updated_at': get_timestamp()
    }
    store['binders'][binder_id] = binder
    return binder


def get_binder(store, binder_id):
    """Get a specific binder"""
    return store['binders'].get(binder_id)


def get_all_binders(store):
    """Get all binders"""
    binders = list(store['binders'].values())
    # Add source count to each binder
    for binder in binders:
        binder['source_count'] = len([s for s in store['sources'].values() if s['binder_id'] == binder['id']])
    return sorted(binders, key=lambda b: b['updated_at'], reverse=True)


def update_binder(store, binder_id, **kwargs):
    """Update a binder"""
    binder = store['binders'].get(binder_id)
    if not binder:
        return None
    
    for key in ['title', 'description', 'status']:
        if key in kwargs:
            binder[key] = kwargs[key]
    
    binder['updated_at'] = get_timestamp()
    return binder


def delete_binder(store, binder_id):
    """Delete a binder and all associated data"""
    if binder_id not in store['binders']:
        return False
    
    # Delete all sources, chunks, conversations, messages for this binder
    source_ids = [s['id'] for s in store['sources'].values() if s['binder_id'] == binder_id]
    conv_ids = [c['id'] for c in store['conversations'].values() if c['binder_id'] == binder_id]
    
    for source_id in source_ids:
        delete_source(store, source_id)
    
    for conv_id in conv_ids:
        delete_conversation(store, conv_id)
    
    del store['binders'][binder_id]
    return True


# ============================================================
# SOURCE OPERATIONS
# ============================================================

def create_source(store, binder_id, title, source_type='file'):
    """Create a new source"""
    source_id = generate_id()
    source = {
        'id': source_id,
        'binder_id': binder_id,
        'title': title,
        'source_type': source_type,
        'status': 'empty',
        'created_at': get_timestamp()
    }
    store['sources'][source_id] = source
    return source


def get_source(store, source_id):
    """Get a specific source"""
    return store['sources'].get(source_id)


def get_sources_for_binder(store, binder_id):
    """Get all sources for a binder"""
    return [s for s in store['sources'].values() if s['binder_id'] == binder_id]


def delete_source(store, source_id):
    """Delete a source and all associated chunks"""
    if source_id not in store['sources']:
        return False
    
    # Delete all chunks for this source
    chunk_ids = [c['id'] for c in store['chunks'].values() if c['source_id'] == source_id]
    for chunk_id in chunk_ids:
        if chunk_id in store['chunks']:
            del store['chunks'][chunk_id]
    
    del store['sources'][source_id]
    return True


# ============================================================
# CHUNK OPERATIONS
# ============================================================

def create_chunk(store, source_id, text, metadata=None):
    """Create a new chunk"""
    chunk_id = generate_id()
    chunk = {
        'id': chunk_id,
        'source_id': source_id,
        'text': text,
        'embedding': None,
        'metadata': metadata or {}
    }
    store['chunks'][chunk_id] = chunk
    return chunk


def get_chunks_for_source(store, source_id):
    """Get all chunks for a source"""
    return [c for c in store['chunks'].values() if c['source_id'] == source_id]


# ============================================================
# CONVERSATION OPERATIONS
# ============================================================

def create_conversation(store, binder_id, title=''):
    """Create a new conversation"""
    conv_id = generate_id()
    if not title:
        title = f"Conversation {len([c for c in store['conversations'].values() if c['binder_id'] == binder_id]) + 1}"
    
    conversation = {
        'id': conv_id,
        'binder_id': binder_id,
        'title': title,
        'created_at': get_timestamp(),
        'updated_at': get_timestamp()
    }
    store['conversations'][conv_id] = conversation
    return conversation


def get_conversation(store, conv_id):
    """Get a specific conversation"""
    return store['conversations'].get(conv_id)


def get_conversations_for_binder(store, binder_id):
    """Get all conversations for a binder"""
    return [c for c in store['conversations'].values() if c['binder_id'] == binder_id]


def delete_conversation(store, conv_id):
    """Delete a conversation and all messages"""
    if conv_id not in store['conversations']:
        return False
    
    # Delete all messages for this conversation
    msg_ids = [m['id'] for m in store['messages'].values() if m['conversation_id'] == conv_id]
    for msg_id in msg_ids:
        if msg_id in store['messages']:
            del store['messages'][msg_id]
    
    del store['conversations'][conv_id]
    return True


# ============================================================
# MESSAGE OPERATIONS
# ============================================================

def create_message(store, conversation_id, role, content, style='Default', citations=None):
    """Create a new message"""
    msg_id = generate_id()
    message = {
        'id': msg_id,
        'conversation_id': conversation_id,
        'role': role,
        'content': content,
        'style': style,
        'citations': citations or [],
        'created_at': get_timestamp()
    }
    store['messages'][msg_id] = message
    
    # Update conversation updated_at
    if conversation_id in store['conversations']:
        store['conversations'][conversation_id]['updated_at'] = get_timestamp()
    
    return message


def get_messages_for_conversation(store, conv_id):
    """Get all messages for a conversation"""
    return sorted(
        [m for m in store['messages'].values() if m['conversation_id'] == conv_id],
        key=lambda m: m['created_at']
    )


def delete_message(store, msg_id):
    """Delete a message"""
    if msg_id not in store['messages']:
        return False
    del store['messages'][msg_id]
    return True


# ============================================================
# SECTION OPERATIONS (HIERARCHICAL)
# ============================================================

def create_section(store, binder_id, title, parent_section_id=None):
    """Create a new section"""
    section_id = generate_id()
    section = {
        'id': section_id,
        'binder_id': binder_id,
        'parent_section_id': parent_section_id,
        'title': title,
        'status': 'ready',
        'created_at': get_timestamp()
    }
    store['sections'][section_id] = section
    return section


def get_sections_for_binder(store, binder_id):
    """Get all sections for a binder"""
    return [s for s in store['sections'].values() if s['binder_id'] == binder_id]
