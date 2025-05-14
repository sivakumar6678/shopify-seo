from flask import Blueprint, request, jsonify, Response
from models.model import db, LlmsSchema
from datetime import datetime

llms_bp = Blueprint('llms', __name__)

@llms_bp.route('/llms/generate', methods=['POST'])
def generate_llms():
    data = request.json
    shop_url = data.get('shop_url')
    products = data.get('products')  # List of { title, url }

    content_lines = [
        "# llms.txt",
        "# Auto-generated for LLM content discovery",
        f"Shop: {shop_url}",
        ""
    ]

    for product in products:
        content_lines.append(f"- title: {product['title']}")
        content_lines.append(f"  url: {product['url']}")
        content_lines.append("")

    content = "\n".join(content_lines)

    llms = LlmsSchema(
        shop_url=shop_url,
        content=content,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

    db.session.add(llms)
    db.session.commit()

    return jsonify({ "message": "llms.txt generated", "content": content })


@llms_bp.route('/llms.txt', methods=['GET'])
def serve_llms():
    shop_url = request.args.get('shop')
    llms = LlmsSchema.query.filter_by(shop_url=shop_url).order_by(LlmsSchema.updated_at.desc()).first()
    if not llms:
        return Response("No llms.txt available", mimetype='text/plain')

    return Response(llms.content, mimetype='text/plain')
