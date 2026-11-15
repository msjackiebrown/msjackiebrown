"""Flask app factory"""
from flask import Flask
from .config import config
from .storage import init_storage

# In-memory data store (simple dict-based storage)
store = {}


def create_app(config_name='development'):
    """Application factory"""
    app = Flask(__name__, 
                static_folder='static',
                static_url_path='/static',
                template_folder='templates')
    
    # Load configuration
    app.config.from_object(config[config_name])
    
    # Initialize storage
    init_storage(store)
    
    # Make store accessible from app context
    app.store = store
    
    # Register blueprints
    from .routes.home import home_bp
    from .routes.binder_routes import binder_bp
    from .routes.settings import settings_bp
    from .routes.api import api_bp
    
    app.register_blueprint(home_bp)
    app.register_blueprint(binder_bp)
    app.register_blueprint(settings_bp)
    app.register_blueprint(api_bp, url_prefix='/api')
    
    # Register error handlers
    register_error_handlers(app)
    
    return app


def register_error_handlers(app):
    """Register error handlers"""
    
    @app.errorhandler(404)
    def page_not_found(error):
        return {'error': 'Page not found'}, 404
    
    @app.errorhandler(500)
    def server_error(error):
        return {'error': 'Server error'}, 500
    
    @app.errorhandler(400)
    def bad_request(error):
        return {'error': 'Bad request'}, 400
