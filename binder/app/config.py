import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    """Base configuration"""
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
    DEBUG = os.getenv('DEBUG', 'False') == 'True'
    
    # Database
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'sqlite:///binder.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Ollama
    OLLAMA_BASE_URL = os.getenv('OLLAMA_BASE_URL', 'http://localhost:11434')
    LLM_PRIMARY = os.getenv('LLM_PRIMARY', 'qwen3:14b')
    LLM_QUALITY = os.getenv('LLM_QUALITY', 'qwen3.5:27b')
    EMBEDDING_MODEL = os.getenv('EMBEDDING_MODEL', 'qwen3-embedding:0.6b')
    
    # Retrieval
    TOP_K = int(os.getenv('TOP_K', '5'))
    CHUNK_SIZE = int(os.getenv('CHUNK_SIZE', '1000'))
    CHUNK_OVERLAP = int(os.getenv('CHUNK_OVERLAP', '200'))
    
    # ChromaDB
    CHROMA_DB_PATH = os.getenv('CHROMA_DB_PATH', './data/chroma')
    
    # File uploads
    UPLOAD_FOLDER = os.getenv('UPLOAD_FOLDER', './data/uploads')
    ALLOWED_EXTENSIONS = {'txt', 'pdf', 'docx', 'md'}
    MAX_CONTENT_LENGTH = 100 * 1024 * 1024  # 100 MB max file size
    
    # Server
    BIND_ADDRESS = os.getenv('BIND_ADDRESS', '127.0.0.1')
    BIND_PORT = int(os.getenv('BIND_PORT', '5000'))


class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    TESTING = False


class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    TESTING = False


class TestingConfig(Config):
    """Testing configuration"""
    DEBUG = True
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'


# Configuration dictionary
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}
