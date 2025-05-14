import shopify
from shopify import Session
import os
from flask import current_app
from datetime import datetime
import logging

# Import models inside functions to avoid circular imports

logger = logging.getLogger(__name__)

def initialize_shopify_api():
    """Initialize the Shopify API with app credentials"""
    api_key = os.getenv('SHOPIFY_API_KEY')
    api_secret = os.getenv('SHOPIFY_API_SECRET')
    api_version = os.getenv('SHOPIFY_API_VERSION', '2024-01')
    
    if not api_key or not api_secret:
        logger.error("Shopify API credentials not found in environment variables")
        raise ValueError("Missing Shopify API credentials")
    
    shopify.Session.setup(api_key=api_key, secret=api_secret)
    shopify.ShopifyResource.set_site(f"https://{api_key}:{api_secret}@shopify.com/admin/api/{api_version}")

def authenticate_shopify(shop_url, access_token=None):
    """
    Authenticate with Shopify API using the provided shop URL and access token
    
    Args:
        shop_url (str): The shop's myshopify.com URL
        access_token (str, optional): The shop's access token. If not provided, 
                                     it will be retrieved from the database.
    
    Returns:
        bool: True if authentication was successful, False otherwise
    """
    if not shop_url:
        logger.error("No shop URL provided for authentication")
        return False
    
    # Clean up shop URL if needed
    if not shop_url.startswith('https://'):
        shop_url = f"https://{shop_url}"
    
    if not access_token:
        try:
            # Import here to avoid circular imports
            from models.model import ShopifyStore
            
            # Try to get the access token from the database
            store = ShopifyStore.query.filter_by(shop_url=shop_url).first()
            if store and store.access_token:
                access_token = store.access_token
            else:
                logger.error(f"No access token found for shop: {shop_url}")
                return False
        except Exception as e:
            logger.error(f"Error retrieving access token: {str(e)}")
            return False
    
    try:
        api_version = os.getenv('SHOPIFY_API_VERSION', '2024-01')
        session = Session(shop_url, api_version, access_token)
        shopify.ShopifyResource.activate_session(session)
        
        # Verify the token works by making a simple API call
        shop = shopify.Shop.current()
        return True if shop else False
    except Exception as e:
        logger.error(f"Error authenticating with Shopify: {str(e)}")
        return False

def save_shop_token(shop_url, access_token, scope):
    """
    Save or update the shop's access token in the database
    
    Args:
        shop_url (str): The shop's myshopify.com URL
        access_token (str): The shop's access token
        scope (str): The permissions granted to the app
    """
    try:
        # Import here to avoid circular imports
        from models.model import ShopifyStore, db
        
        # Clean up shop URL if needed
        if shop_url.startswith('https://'):
            shop_url = shop_url.replace('https://', '')
        
        # Check if the store already exists
        store = ShopifyStore.query.filter_by(shop_url=shop_url).first()
        
        if store:
            # Update existing store
            store.access_token = access_token
            store.scope = scope
            store.updated_at = datetime.utcnow()
            store.is_active = True
        else:
            # Create new store record
            store = ShopifyStore(
                shop_url=shop_url,
                access_token=access_token,
                scope=scope,
                installed_at=datetime.utcnow(),
                updated_at=datetime.utcnow(),
                is_active=True
            )
            db.session.add(store)
        
        db.session.commit()
        return True
    except Exception as e:
        # Import here to avoid circular imports if not already imported
        try:
            from models.model import db
            db.session.rollback()
        except:
            pass
        logger.error(f"Error saving shop token: {str(e)}")
        return False

def get_shop_data(shop_url):
    """
    Get shop information from Shopify API
    
    Args:
        shop_url (str): The shop's myshopify.com URL
    
    Returns:
        dict: Shop information or None if there was an error
    """
    try:
        if authenticate_shopify(shop_url):
            shop = shopify.Shop.current()
            return {
                'id': shop.id,
                'name': shop.name,
                'email': shop.email,
                'domain': shop.domain,
                'country': shop.country_name,
                'plan_name': shop.plan_name
            }
        return None
    except Exception as e:
        logger.error(f"Error getting shop data: {str(e)}")
        return None

def get_products(shop_url, limit=50):
    """
    Get products from the shop
    
    Args:
        shop_url (str): The shop's myshopify.com URL
        limit (int): Maximum number of products to retrieve
    
    Returns:
        list: List of products or empty list if there was an error
    """
    try:
        if authenticate_shopify(shop_url):
            products = shopify.Product.find(limit=limit)
            return [
                {
                    'id': product.id,
                    'title': product.title,
                    'handle': product.handle,
                    'description': product.body_html,
                    'created_at': product.created_at,
                    'updated_at': product.updated_at,
                    'published_at': product.published_at,
                    'vendor': product.vendor,
                    'product_type': product.product_type,
                    'tags': product.tags
                }
                for product in products
            ]
        return []
    except Exception as e:
        logger.error(f"Error getting products: {str(e)}")
        return []
