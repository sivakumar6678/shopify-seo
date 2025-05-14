from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class ShopifyStore(db.Model):
    """Model for storing Shopify store information and access tokens"""
    id = db.Column(db.Integer, primary_key=True)
    shop_url = db.Column(db.String(255), unique=True, nullable=False)
    access_token = db.Column(db.String(255))
    scope = db.Column(db.String(255))
    installed_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_active = db.Column(db.Boolean, default=True)
    
    # Relationships will be added back after database migration
    # seo_schemas = db.relationship('SeoSchema', backref='store', lazy=True)
    # llms_schemas = db.relationship('LlmsSchema', backref='store', lazy=True)
    # analytics = db.relationship('AnalyticsSchema', backref='store', lazy=True)

class SeoSchema(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    # Keep the original fields without the foreign key for now
    product_id = db.Column(db.String(100))
    generated_json_ld = db.Column(db.Text)
    created_at = db.Column(db.DateTime)
    updated_at = db.Column(db.DateTime)
    
    # This field will be added in a future migration
    # shop_id = db.Column(db.Integer, db.ForeignKey('shopify_store.id'), nullable=False)

class LlmsSchema(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    shop_url = db.Column(db.String(255))  # Keep the original field
    content = db.Column(db.Text)
    created_at = db.Column(db.DateTime)
    updated_at = db.Column(db.DateTime)
    
    # This field will be added in a future migration
    # shop_id = db.Column(db.Integer, db.ForeignKey('shopify_store.id'), nullable=False)

class AnalyticsSchema(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    shop_url = db.Column(db.String(255))  # Keep the original field
    user_agent = db.Column(db.String(255))
    path = db.Column(db.String(255))
    timestamp = db.Column(db.DateTime)
    
    # These fields will be added in a future migration
    # shop_id = db.Column(db.Integer, db.ForeignKey('shopify_store.id'), nullable=False)
    # ip_address = db.Column(db.String(45))

class AppSettings(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    # Keep the original fields without the foreign key for now
    gemini_api_key = db.Column(db.String(255))
    auto_generate_seo = db.Column(db.Boolean, default=False)
    auto_generate_llms = db.Column(db.Boolean, default=False)
    
    # These fields will be added in a future migration
    # shop_id = db.Column(db.Integer, db.ForeignKey('shopify_store.id'), nullable=True)
    # created_at = db.Column(db.DateTime, default=datetime.utcnow)
    # updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    # store = db.relationship('ShopifyStore', backref='settings', uselist=False)
