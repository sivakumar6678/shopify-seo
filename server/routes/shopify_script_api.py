# server/routes/shopify_script_api.py

import requests
import os
import logging
from flask import Blueprint, request, jsonify, abort, current_app
from config import get_shop_token, SHOPIFY_API_VERSION, verify_webhook, APP_URL
from utils.shopify_api import authenticate_shopify, save_shop_token
from functools import wraps
import os

logger = logging.getLogger(__name__)
shopify_script_bp = Blueprint('shopify_script', __name__)

def verify_shopify_request(f):
    """Decorator to verify that request came from Shopify"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Skip verification in development mode if configured
        if os.getenv('FLASK_ENV') == 'development' and os.getenv('SKIP_SHOPIFY_VERIFICATION') == 'true':
            return f(*args, **kwargs)
            
        # Get the HMAC header
        hmac_header = request.headers.get('X-Shopify-Hmac-Sha256')
        if not hmac_header:
            logger.warning("Request missing X-Shopify-Hmac-Sha256 header")
            abort(401)
            
        # Get the raw request body
        request_data = request.get_data()
        if not request_data:
            logger.warning("Empty request body")
            abort(400)
            
        # Verify the HMAC
        if not verify_webhook(request_data, hmac_header):
            logger.warning("HMAC verification failed")
            abort(401)
            
        return f(*args, **kwargs)
    return decorated_function

@shopify_script_bp.route('/install_script_tag', methods=['POST'])
def install_script_tag():
    """Install a script tag in the shop"""
    try:
        data = request.json
        if not data or 'shop' not in data:
            return jsonify({"error": "Missing shop parameter"}), 400
            
        shop = data['shop']
        access_token = get_shop_token(shop)
        
        if not access_token:
            return jsonify({"error": "No access token found for shop"}), 401
            
        # Get the app's script URL from environment or config
        script_url = f"{APP_URL}/static/shopify-app.js"
        
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
        
        res = requests.post(
            f"https://{shop}/admin/api/{SHOPIFY_API_VERSION}/script_tags.json",
            headers=headers,
            json=payload
        )
        
        if res.status_code >= 400:
            logger.error(f"Error installing script tag: {res.text}")
            
        return jsonify(res.json()), res.status_code
    except Exception as e:
        logger.error(f"Error in install_script_tag: {str(e)}")
        return jsonify({"error": str(e)}), 500

@shopify_script_bp.route('/oauth/callback', methods=['GET'])
def oauth_callback():
    """Handle OAuth callback from Shopify"""
    try:
        # Get the authorization code and shop
        code = request.args.get('code')
        shop = request.args.get('shop')
        
        if not code or not shop:
            return jsonify({"error": "Missing required parameters"}), 400
            
        # Exchange the code for an access token
        api_key = os.getenv('SHOPIFY_API_KEY')
        api_secret = os.getenv('SHOPIFY_API_SECRET')
        
        if not api_key or not api_secret:
            logger.error("Missing Shopify API credentials")
            return jsonify({"error": "Configuration error"}), 500
            
        payload = {
            'client_id': api_key,
            'client_secret': api_secret,
            'code': code
        }
        
        response = requests.post(f"https://{shop}/admin/oauth/access_token", json=payload)
        
        if response.status_code != 200:
            logger.error(f"Error getting access token: {response.text}")
            return jsonify({"error": "Failed to get access token"}), 400
            
        # Extract the access token and scope
        result = response.json()
        access_token = result.get('access_token')
        scope = result.get('scope')
        
        if not access_token:
            return jsonify({"error": "No access token received"}), 400
            
        # Save the token to the database
        if not save_shop_token(shop, access_token, scope):
            return jsonify({"error": "Failed to save access token"}), 500
            
        # Redirect to the app
        return jsonify({"success": True, "shop": shop})
    except Exception as e:
        logger.error(f"Error in oauth_callback: {str(e)}")
        return jsonify({"error": str(e)}), 500

@shopify_script_bp.route('/webhooks/app_uninstalled', methods=['POST'])
@verify_shopify_request
def app_uninstalled():
    """Handle app uninstalled webhook"""
    try:
        data = request.json
        shop = data.get('myshopify_domain')
        
        if not shop:
            return jsonify({"error": "Missing shop domain"}), 400
            
        # Mark the store as inactive
        try:
            # Import here to avoid circular imports
            from models.model import ShopifyStore, db
            
            store = ShopifyStore.query.filter_by(shop_url=shop).first()
            if store:
                store.is_active = False
                store.access_token = None  # Clear the token for security
                db.session.commit()
        except Exception as e:
            logger.error(f"Error updating store status: {str(e)}")
            try:
                from models.model import db
                db.session.rollback()
            except:
                pass
            
        return jsonify({"success": True}), 200
    except Exception as e:
        logger.error(f"Error in app_uninstalled webhook: {str(e)}")
        try:
            from models.model import db
            db.session.rollback()
        except:
            pass
        return jsonify({"error": str(e)}), 500
