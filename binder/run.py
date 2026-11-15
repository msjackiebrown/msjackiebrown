#!/usr/bin/env python
"""
Binder Flask Application Entry Point

Usage:
    python run.py                    # Run in development
    python run.py production         # Run in production
"""

import os
import sys
from app import create_app
from app.storage import init_storage, create_binder

# Get environment
env = os.getenv('FLASK_ENV', 'development')
if len(sys.argv) > 1:
    env = sys.argv[1]

# Create app
app = create_app(env)


@app.shell_context_processor
def make_shell_context():
    """Create shell context for flask shell"""
    return {
        'store': app.store,
    }


@app.cli.command()
def create_sample_data():
    """Create sample data for testing"""
    # Check if data already exists
    if app.store['binders']:
        print('Database already has data')
        return
    
    # Create sample binder
    binder = create_binder(app.store, title='Chapter 4', description='Latest course notes')
    print(f'✓ Sample data created: {binder["id"]}')


if __name__ == '__main__':
    # Ensure data directories exist
    os.makedirs('data/uploads', exist_ok=True)
    os.makedirs('data/chroma', exist_ok=True)
    
    # Run the app
    app.run(
        host=app.config.get('BIND_ADDRESS', '127.0.0.1'),
        port=app.config.get('BIND_PORT', 5000),
        debug=app.config.get('DEBUG', False)
    )
