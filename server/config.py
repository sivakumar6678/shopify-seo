# server/config.py

import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import models after app initialization to avoid circular imports
# The ShopifyStore model will be imported in the functions that need it

# Shopify API Config
SHOPIFY_API_VERSION = os.getenv("SHOPIFY_API_VERSION", "2024-01")
SHOPIFY_API_KEY = os.getenv("SHOPIFY_API_KEY")
SHOPIFY_API_SECRET = os.getenv("SHOPIFY_API_SECRET")
APP_URL = os.getenv("APP_URL", "https://your-app-url.com")

# Get shop token from database
def get_shop_token(shop_url):
    """
    Retrieve the access token for a given shop from the database
    """
    if not shop_url:
        return None
    
    try:
        # Import here to avoid circular imports
        from models.model import ShopifyStore
        
        # Query the database for the shop's token
        store = ShopifyStore.query.filter_by(shop_url=shop_url).first()
        
        if store and store.access_token:
            return store.access_token
    except Exception as e:
        print(f"Error getting shop token: {str(e)}")
    
    # For development only - should be removed in production
    if os.getenv("FLASK_ENV") == "development":
        return os.getenv("SHOPIFY_ACCESS_TOKEN")
    
    return None

# Verify Shopify webhook
def verify_webhook(data, hmac_header):
    """
    Verify that webhook request came from Shopify
    """
    import hmac
    import hashlib
    import base64
    
    # Calculate HMAC using the shop's shared secret
    digest = hmac.new(
        SHOPIFY_API_SECRET.encode('utf-8'),
        data,
        hashlib.sha256
    ).digest()
    
    calculated_hmac = base64.b64encode(digest).decode('utf-8')
    
    # Compare our calculated HMAC with the one from Shopify
    return hmac.compare_digest(calculated_hmac, hmac_header)
