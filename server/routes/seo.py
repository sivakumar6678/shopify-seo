from flask import Blueprint, request, jsonify
from models.model import db, SeoSchema, AppSettings
from utils.gemini_service import generate_faq_schema
from datetime import datetime

seo_bp = Blueprint('seo', __name__)

@seo_bp.route('/seo/generate', methods=['POST'])
def generate_seo():
    data = request.json
    product_id = data.get('product_id')
    product_description = data.get('description')

    settings = AppSettings.query.first()
    api_key = settings.gemini_api_key if settings else None

    if not api_key:
        return jsonify({"error": "Gemini API key not set"}), 400

    json_ld = generate_faq_schema(api_key, product_description)

    # Create a new SeoSchema instance with the current timestamp
    now = datetime.utcnow()
    seo = SeoSchema(
        product_id=product_id,
        generated_json_ld=json_ld,
        created_at=now,
        updated_at=now
    )
    db.session.add(seo)
    db.session.commit()

    return jsonify({"json_ld": json_ld})
