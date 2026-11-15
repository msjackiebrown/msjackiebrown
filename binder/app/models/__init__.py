"""Database models for Binder"""
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import uuid

db = SQLAlchemy()


class Binder(db.Model):
    """Binder model"""
    __tablename__ = 'binders'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.String(500))
    chroma_collection_id = db.Column(db.String(255), unique=True)
    status = db.Column(db.String(50), default='ready')  # ready, processing, error, empty
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    sources = db.relationship('Source', backref='binder', lazy=True, cascade='all, delete-orphan')
    sections = db.relationship('Section', backref='binder', lazy=True, cascade='all, delete-orphan')
    conversations = db.relationship('Conversation', backref='binder', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'status': self.status,
            'source_count': len(self.sources),
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }


class Section(db.Model):
    """Section model (folder in binder)"""
    __tablename__ = 'sections'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    binder_id = db.Column(db.String(36), db.ForeignKey('binders.id'), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    parent_section_id = db.Column(db.String(36), db.ForeignKey('sections.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    subsections = db.relationship('Section', backref=db.backref('parent', remote_side=[id]), cascade='all, delete-orphan')
    sources = db.relationship('Source', backref='section', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'parent_section_id': self.parent_section_id,
            'source_count': len(self.sources)
        }


class Source(db.Model):
    """Source model (file, URL, paste)"""
    __tablename__ = 'sources'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    binder_id = db.Column(db.String(36), db.ForeignKey('binders.id'), nullable=False)
    section_id = db.Column(db.String(36), db.ForeignKey('sections.id'))
    
    source_type = db.Column(db.String(50), nullable=False)  # file, url, paste
    title = db.Column(db.String(255), nullable=False)
    content_path = db.Column(db.String(500))  # File path or URL
    
    status = db.Column(db.String(50), default='pending')  # pending, processing, ready, error
    error_message = db.Column(db.Text)
    
    # Ingestion progress
    total_pages = db.Column(db.Integer)
    processed_pages = db.Column(db.Integer, default=0)
    ingestion_progress = db.Column(db.Float, default=0.0)  # 0-100
    
    # ChromaDB reference
    chroma_document_ids = db.Column(db.JSON)  # List of chunk IDs in ChromaDB
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    chunks = db.relationship('Chunk', backref='source', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'source_type': self.source_type,
            'title': self.title,
            'status': self.status,
            'error_message': self.error_message,
            'progress': self.ingestion_progress,
            'created_at': self.created_at.isoformat()
        }


class Chunk(db.Model):
    """Chunk model (text chunks from sources for embedding)"""
    __tablename__ = 'chunks'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    source_id = db.Column(db.String(36), db.ForeignKey('sources.id'), nullable=False)
    
    content = db.Column(db.Text, nullable=False)
    page_number = db.Column(db.Integer)
    chunk_index = db.Column(db.Integer)
    
    # ChromaDB reference
    chroma_id = db.Column(db.String(255), unique=True)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'content': self.content,
            'page_number': self.page_number,
            'chunk_index': self.chunk_index
        }


class Conversation(db.Model):
    """Conversation model (chat history)"""
    __tablename__ = 'conversations'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    binder_id = db.Column(db.String(36), db.ForeignKey('binders.id'), nullable=False)
    
    title = db.Column(db.String(255))  # Auto-titled from first message
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    messages = db.relationship('Message', backref='conversation', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title or 'Conversation',
            'message_count': len(self.messages),
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }


class Message(db.Model):
    """Message model (chat messages)"""
    __tablename__ = 'messages'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    conversation_id = db.Column(db.String(36), db.ForeignKey('conversations.id'), nullable=False)
    
    role = db.Column(db.String(50), nullable=False)  # user, assistant
    content = db.Column(db.Text, nullable=False)
    style = db.Column(db.String(50), default='Default')  # Default, Learning Guide
    
    # Citations (JSON list of source IDs and chunks)
    citations = db.Column(db.JSON)
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'role': self.role,
            'content': self.content,
            'style': self.style,
            'citations': self.citations or [],
            'created_at': self.created_at.isoformat()
        }
