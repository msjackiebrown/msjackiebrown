"""API routes for AJAX/REST endpoints"""
from flask import Blueprint, request, jsonify, current_app
from ..storage import (
    create_binder, get_binder, get_all_binders, update_binder, delete_binder,
    create_source, get_source, get_sources_for_binder, delete_source,
    create_chunk, get_chunks_for_source,
    create_conversation, get_conversation, get_conversations_for_binder, delete_conversation,
    create_message, get_messages_for_conversation, delete_message
)

api_bp = Blueprint('api', __name__)


# ============================================================
# BINDERS API
# ============================================================

@api_bp.route('/binders', methods=['GET'])
def get_binders_list():
    """Get all binders"""
    try:
        binders = get_all_binders(current_app.store)
        return jsonify(binders), 200
    except Exception as e:
        current_app.logger.error(f"Error fetching binders: {str(e)}")
        return jsonify({'error': str(e)}), 500


@api_bp.route('/binders', methods=['POST'])
def create_binder_route():
    """Create a new binder"""
    try:
        data = request.get_json()
        
        if not data.get('title'):
            return jsonify({'error': 'Title is required'}), 400
        
        binder = create_binder(
            current_app.store,
            title=data['title'],
            description=data.get('description', '')
        )
        
        return jsonify(binder), 201
    except Exception as e:
        current_app.logger.error(f"Error creating binder: {str(e)}")
        return jsonify({'error': str(e)}), 500


@api_bp.route('/binders/<binder_id>', methods=['PUT'])
def update_binder_route(binder_id):
    """Update a binder"""
    try:
        binder = get_binder(current_app.store, binder_id)
        if not binder:
            return jsonify({'error': 'Binder not found'}), 404
        
        data = request.get_json()
        
        updated = update_binder(current_app.store, binder_id,
                               title=data.get('title'),
                               description=data.get('description'))
        
        return jsonify(updated), 200
    except Exception as e:
        current_app.logger.error(f"Error updating binder: {str(e)}")
        return jsonify({'error': str(e)}), 500


@api_bp.route('/binders/<binder_id>', methods=['DELETE'])
def delete_binder_route(binder_id):
    """Delete a binder"""
    try:
        if not delete_binder(current_app.store, binder_id):
            return jsonify({'error': 'Binder not found'}), 404
        
        return jsonify({'message': f'Binder {binder_id} deleted'}), 200
    except Exception as e:
        current_app.logger.error(f"Error deleting binder: {str(e)}")
        return jsonify({'error': str(e)}), 500


# ============================================================
# SOURCES API
# ============================================================

@api_bp.route('/binders/<binder_id>/sources', methods=['GET'])
def get_sources_list(binder_id):
    """Get sources for a binder"""
    try:
        # Verify binder exists
        if not get_binder(current_app.store, binder_id):
            return jsonify({'error': 'Binder not found'}), 404
        
        sources = get_sources_for_binder(current_app.store, binder_id)
        return jsonify(sources), 200
    except Exception as e:
        current_app.logger.error(f"Error fetching sources: {str(e)}")
        return jsonify({'error': str(e)}), 500


@api_bp.route('/binders/<binder_id>/sources', methods=['POST'])
def create_source_route(binder_id):
    """Add a source to a binder"""
    try:
        # Verify binder exists
        if not get_binder(current_app.store, binder_id):
            return jsonify({'error': 'Binder not found'}), 404
        
        data = request.get_json()
        
        if not data.get('title'):
            return jsonify({'error': 'Title is required'}), 400
        
        source = create_source(
            current_app.store,
            binder_id=binder_id,
            title=data['title'],
            source_type=data.get('source_type', 'file')
        )
        
        return jsonify(source), 201
    except Exception as e:
        current_app.logger.error(f"Error creating source: {str(e)}")
        return jsonify({'error': str(e)}), 500


@api_bp.route('/sources/<source_id>', methods=['DELETE'])
def delete_source_route(source_id):
    """Delete a source"""
    try:
        if not delete_source(current_app.store, source_id):
            return jsonify({'error': 'Source not found'}), 404
        
        return jsonify({'message': f'Source {source_id} deleted'}), 200
    except Exception as e:
        current_app.logger.error(f"Error deleting source: {str(e)}")
        return jsonify({'error': str(e)}), 500


# ============================================================
# CONVERSATIONS API
# ============================================================

@api_bp.route('/binders/<binder_id>/conversations', methods=['GET'])
def get_conversations_list(binder_id):
    """Get conversations for a binder"""
    try:
        # Verify binder exists
        if not get_binder(current_app.store, binder_id):
            return jsonify({'error': 'Binder not found'}), 404
        
        conversations = get_conversations_for_binder(current_app.store, binder_id)
        return jsonify(conversations), 200
    except Exception as e:
        current_app.logger.error(f"Error fetching conversations: {str(e)}")
        return jsonify({'error': str(e)}), 500


@api_bp.route('/binders/<binder_id>/conversations', methods=['POST'])
def create_conversation_route(binder_id):
    """Create a new conversation"""
    try:
        # Verify binder exists
        if not get_binder(current_app.store, binder_id):
            return jsonify({'error': 'Binder not found'}), 404
        
        data = request.get_json() or {}
        
        conversation = create_conversation(
            current_app.store,
            binder_id=binder_id,
            title=data.get('title', '')
        )
        
        return jsonify(conversation), 201
    except Exception as e:
        current_app.logger.error(f"Error creating conversation: {str(e)}")
        return jsonify({'error': str(e)}), 500


@api_bp.route('/conversations/<conversation_id>', methods=['DELETE'])
def delete_conversation_route(conversation_id):
    """Delete a conversation"""
    try:
        if not delete_conversation(current_app.store, conversation_id):
            return jsonify({'error': 'Conversation not found'}), 404
        
        return jsonify({'message': f'Conversation {conversation_id} deleted'}), 200
    except Exception as e:
        current_app.logger.error(f"Error deleting conversation: {str(e)}")
        return jsonify({'error': str(e)}), 500


# ============================================================
# MESSAGES API
# ============================================================

@api_bp.route('/conversations/<conversation_id>/messages', methods=['GET'])
def get_messages_list(conversation_id):
    """Get messages for a conversation"""
    try:
        # Verify conversation exists
        if not get_conversation(current_app.store, conversation_id):
            return jsonify({'error': 'Conversation not found'}), 404
        
        messages = get_messages_for_conversation(current_app.store, conversation_id)
        return jsonify(messages), 200
    except Exception as e:
        current_app.logger.error(f"Error fetching messages: {str(e)}")
        return jsonify({'error': str(e)}), 500


@api_bp.route('/conversations/<conversation_id>/messages', methods=['POST'])
def create_message_route(conversation_id):
    """Add a message to a conversation"""
    try:
        # Verify conversation exists
        if not get_conversation(current_app.store, conversation_id):
            return jsonify({'error': 'Conversation not found'}), 404
        
        data = request.get_json()
        
        if not data.get('content') or not data.get('role'):
            return jsonify({'error': 'Content and role are required'}), 400
        
        message = create_message(
            current_app.store,
            conversation_id=conversation_id,
            role=data['role'],
            content=data['content'],
            style=data.get('style', 'Default'),
            citations=data.get('citations', [])
        )
        
        return jsonify(message), 201
    except Exception as e:
        current_app.logger.error(f"Error creating message: {str(e)}")
        return jsonify({'error': str(e)}), 500


# ============================================================
# SYSTEM API
# ============================================================

@api_bp.route('/ollama/status', methods=['GET'])
def ollama_status():
    """Check Ollama status"""
    try:
        import requests
        ollama_url = current_app.config.get('OLLAMA_BASE_URL', 'http://localhost:11434')
        response = requests.get(f"{ollama_url}/api/tags", timeout=2)
        
        if response.status_code == 200:
            return jsonify({'status': 'online', 'message': 'Ollama is reachable'}), 200
        else:
            return jsonify({'status': 'offline', 'message': 'Ollama returned error'}), 503
    except Exception as e:
        current_app.logger.error(f"Error checking Ollama status: {str(e)}")
        return jsonify({'status': 'offline', 'message': str(e)}), 503


@api_bp.route('/settings', methods=['GET'])
def get_settings():
    """Get current settings"""
    try:
        settings = {
            'models': {
                'llm_primary': current_app.config.get('LLM_PRIMARY', 'qwen3:14b'),
                'llm_quality': current_app.config.get('LLM_QUALITY', 'qwen3.5:27b'),
                'embedding_model': current_app.config.get('EMBEDDING_MODEL', 'qwen3-embedding:0.6b')
            },
            'retrieval': {
                'top_k': current_app.config.get('TOP_K', 5),
                'chunk_size': current_app.config.get('CHUNK_SIZE', 1000),
                'chunk_overlap': current_app.config.get('CHUNK_OVERLAP', 200)
            },
            'servers': {
                'ollama_url': current_app.config.get('OLLAMA_BASE_URL', 'http://localhost:11434'),
                'bind_address': current_app.config.get('BIND_ADDRESS', '127.0.0.1')
            }
        }
        return jsonify(settings), 200
    except Exception as e:
        current_app.logger.error(f"Error fetching settings: {str(e)}")
        return jsonify({'error': str(e)}), 500


@api_bp.route('/settings', methods=['PUT'])
def update_settings():
    """Update settings"""
    try:
        data = request.get_json()
        
        # Settings are read-only from API (configured via .env)
        # But we can validate them here
        
        return jsonify({'message': 'Settings are managed via .env configuration'}), 200
    except Exception as e:
        current_app.logger.error(f"Error updating settings: {str(e)}")
        return jsonify({'error': str(e)}), 500
