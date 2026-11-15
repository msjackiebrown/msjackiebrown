"""Settings page routes"""
from flask import Blueprint, render_template, request, jsonify, current_app
from ..config import DevelopmentConfig
import os

settings_bp = Blueprint('settings', __name__, url_prefix='/settings')


@settings_bp.route('/')
def view_settings():
    """View settings page"""
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
            'bind_address': current_app.config.get('BIND_ADDRESS', '127.0.0.1'),
            'lan_mode': current_app.config.get('BIND_ADDRESS', '127.0.0.1') == '0.0.0.0'
        }
    }
    
    return render_template('settings.html', settings=settings)
