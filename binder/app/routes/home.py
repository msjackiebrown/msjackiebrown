"""Home page routes"""
from flask import Blueprint, render_template, current_app
from ..storage import get_all_binders

home_bp = Blueprint('home', __name__)


@home_bp.route('/')
def index():
    """Home page - display all binders"""
    try:
        binders = get_all_binders(current_app.store)
        return render_template('home.html', binders=binders)
    except Exception as e:
        current_app.logger.error(f"Error loading home page: {str(e)}")
        return render_template('home.html', binders=[], error=str(e))
