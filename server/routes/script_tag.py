# server/routes/script_tag.py

from flask import Blueprint, request, make_response
from models.model import get_db_connection  # Your MySQL connection method

script_tag_bp = Blueprint('script_tag', __name__)

@script_tag_bp.route('/script_tag/<shop>', methods=['GET'])
def serve_script_tag(shop):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT json_ld FROM seo_data WHERE shop_url = %s ORDER BY created_at DESC LIMIT 1", (shop,))
    row = cursor.fetchone()
    conn.close()

    if not row:
        return "/* No JSON-LD found */", 404

    json_ld_script = f"""
    <script type="application/ld+json">
    {row['json_ld']}
    </script>
    """

    response = make_response(json_ld_script)
    response.headers['Content-Type'] = 'text/html'
    return response
