"""Binder page routes"""
from flask import Blueprint, render_template, request, current_app, jsonify
from ..storage import get_binder, get_sources_for_binder, get_conversations_for_binder

binder_bp = Blueprint('binder', __name__, url_prefix='/binder')


@binder_bp.route('/<binder_id>')
def view_binder(binder_id):
    """View a specific binder"""
    try:
        binder = get_binder(current_app.store, binder_id)
        if not binder:
            return render_template('error.html', 
                                 title='Binder Not Found',
                                 message=f'Binder {binder_id} not found'), 404
        
        # Get sources and conversations
        sources = get_sources_for_binder(current_app.store, binder_id)
        conversations = get_conversations_for_binder(current_app.store, binder_id)
        
        # Attach sources and conversations to binder for template
        binder['sources'] = sources
        binder['conversations'] = conversations
        
        return render_template('binder.html', 
                             binder=binder,
                             conversations=conversations)
    except Exception as e:
        current_app.logger.error(f"Error loading binder {binder_id}: {str(e)}")
        return render_template('error.html',
                             title='Error Loading Binder',
                             message=str(e)), 500
