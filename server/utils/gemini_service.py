import requests

def generate_faq_schema(api_key, content):
    url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + api_key

    prompt = f"""
    Generate SEO-friendly JSON-LD FAQ schema for the following product description:

    {content}

    Format it in valid JSON-LD (type: FAQPage).
    """

    response = requests.post(url, json={
        "contents": [{
            "parts": [{"text": prompt}]
        }]
    })

    try:
        text = response.json()['candidates'][0]['content']['parts'][0]['text']
        return text
    except Exception as e:
        return "{}"
