from flask import Blueprint, request, jsonify
from models.model import db, AnalyticsSchema
from datetime import datetime

analytics_bp = Blueprint('analytics', __name__)

@analytics_bp.route('/track', methods=['GET'])
def track_llm_traffic():
    user_agent = request.headers.get('User-Agent')
    shop_url = request.args.get('shop')
    path = request.path
    timestamp = datetime.utcnow()

    # Detect if it's an LLM (for example, based on user-agent)
    llm_user_agents = ["ChatGPT", "Claude", "Perplexity"]
    is_llm = any(agent in user_agent for agent in llm_user_agents)

    if is_llm:
        analytics_entry = AnalyticsSchema(
            shop_url=shop_url,
            user_agent=user_agent,
            path=path,
            timestamp=timestamp
        )
        db.session.add(analytics_entry)
        db.session.commit()

    return '', 204  # Return no content for the pixel

@analytics_bp.route('/analytics', methods=['GET'])
def get_analytics():
    analytics_entries = AnalyticsSchema.query.all()
    data = [{
        "id": entry.id,
        "shop_url": entry.shop_url,
        "user_agent": entry.user_agent,
        "path": entry.path,
        "timestamp": entry.timestamp
    } for entry in analytics_entries]

    return jsonify(data)
