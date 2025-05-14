from flask import Flask
from flask_cors import CORS
from models.model import db
from routes.seo import seo_bp
from routes.llms import llms_bp
from routes.analytics import analytics_bp
from routes.settings import settings_bp
from routes.shopify_script_api import shopify_script_bp
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Get database configuration from environment variables
db_user = os.getenv('DB_USER', 'root')
db_password = os.getenv('DB_PASSWORD', 'CSKsiva%4066')
db_host = os.getenv('DB_HOST', 'localhost')
db_name = os.getenv('DB_NAME', 'shopify')

app.config['SQLALCHEMY_DATABASE_URI'] = f'mysql+pymysql://{db_user}:{db_password}@{db_host}/{db_name}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-key-change-in-production')

# Configure CORS with appropriate restrictions
CORS(app, resources={r"/*": {"origins": os.getenv('ALLOWED_ORIGINS', '*')}})

db.init_app(app)

# Register Blueprints
app.register_blueprint(seo_bp)
app.register_blueprint(llms_bp)
app.register_blueprint(analytics_bp)
app.register_blueprint(settings_bp)
app.register_blueprint(shopify_script_bp)

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=os.getenv('FLASK_ENV') == 'development')
