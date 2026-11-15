"""Tests for application factory and basic functionality"""
import pytest
from app import create_app


def test_app_creation():
    """Test that app can be created"""
    app = create_app('testing')
    assert app is not None
    assert app.config['TESTING'] is True


def test_app_context():
    """Test that app context works"""
    app = create_app('testing')
    with app.app_context():
        assert app.store is not None


def test_home_page(client):
    """Test that home page exists"""
    response = client.get('/')
    assert response.status_code == 200


def test_404_error(client):
    """Test 404 error handling"""
    response = client.get('/nonexistent')
    assert response.status_code == 404
