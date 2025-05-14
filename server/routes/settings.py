from flask import Blueprint, request, jsonify
from models.model import db, AppSettings
import requests
import os
import logging
from config import SHOPIFY_API_VERSION
from utils.shopify_api import authenticate_shopify

logger = logging.getLogger(__name__)
settings_bp = Blueprint('settings', __name__)

@settings_bp.route('/settings', methods=['GET'])
def get_settings():
    settings = AppSettings.query.first()
    if not settings:
        settings = AppSettings()
        db.session.add(settings)
        db.session.commit()
    return jsonify({
        "gemini_api_key": settings.gemini_api_key,
        "auto_generate_seo": settings.auto_generate_seo,
        "auto_generate_llms": settings.auto_generate_llms
    })

@settings_bp.route('/settings', methods=['POST'])
def update_settings():
    data = request.json
    settings = AppSettings.query.first()
    if not settings:
        settings = AppSettings()
    settings.gemini_api_key = data.get('gemini_api_key', '')
    settings.auto_generate_seo = data.get('auto_generate_seo', False)
    settings.auto_generate_llms = data.get('auto_generate_llms', False)
    db.session.add(settings)
    db.session.commit()
    return jsonify({"message": "Settings updated"})

@settings_bp.route('/api/settings/inject', methods=['POST'])
def inject_script_tag():
    """
    Inject a script tag into a Shopify store
    
    Expected JSON payload:
    {
        "shop": "store-name.myshopify.com",
        "script_url": "https://example.com/script.js"
    }
    """
    try:
        data = request.json
        
        # Validate required fields
        if not data:
            return jsonify({"error": "Missing request body"}), 400
            
        shop = data.get('shop')
        script_url = data.get('script_url')
        
        if not shop:
            return jsonify({"error": "Missing shop parameter"}), 400
            
        if not script_url:
            return jsonify({"error": "Missing script_url parameter"}), 400
            
        # Validate script URL
        if not script_url.startswith('https://'):
            return jsonify({"error": "Script URL must use HTTPS"}), 400
            
        # Clean up shop URL if needed
        if shop.startswith('https://'):
            shop = shop.replace('https://', '')
            
        # Get access token for the shop
        try:
            # Import here to avoid circular imports
            from models.model import ShopifyStore
            
            store = ShopifyStore.query.filter_by(shop_url=shop).first()
            
            if not store or not store.access_token:
                # Try to authenticate with Shopify
                if not authenticate_shopify(shop):
                    return jsonify({"error": "No access token found for shop"}), 401
                    
                # Get the token again after authentication
                store = ShopifyStore.query.filter_by(shop_url=shop).first()
                
            access_token = store.access_token if store else None
        except Exception as e:
            logger.error(f"Error getting store: {str(e)}")
            # For development, use environment variable
            if os.getenv('FLASK_ENV') == 'development':
                access_token = os.getenv('SHOPIFY_ACCESS_TOKEN')
            else:
                return jsonify({"error": "Failed to get access token"}), 500
        
        if not access_token:
            return jsonify({"error": "Failed to authenticate with Shopify"}), 401
            
        # Prepare the request to Shopify
        headers = {
            "X-Shopify-Access-Token": access_token,
            "Content-Type": "application/json"
        }
        
        payload = {
            "script_tag": {
                "event": "onload",
                "src": script_url,
                "display_scope": "online_store"
            }
        }
        
        # Send the request to Shopify
        response = requests.post(
            f"https://{shop}/admin/api/{SHOPIFY_API_VERSION}/script_tags.json",
            headers=headers,
            json=payload
        )
        
        # Check for errors
        if response.status_code >= 400:
            logger.error(f"Error injecting script tag: {response.text}")
            return jsonify({"error": f"Shopify API error: {response.text}"}), response.status_code
            
        # Return the Shopify response
        return jsonify(response.json()), 201
        
    except Exception as e:
        logger.error(f"Error in inject_script_tag: {str(e)}")
        return jsonify({"error": str(e)}), 500
