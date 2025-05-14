# Shopify App Backend

This is the backend for a Shopify app built with Flask and MySQL.

## Features

- SEO optimization with JSON-LD generation
- LLM-powered content generation
- Analytics tracking
- Shopify API integration

## Setup Instructions

### Prerequisites

- Python 3.8+
- MySQL
- Shopify Partner account

### Installation

1. Clone the repository
2. Create a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
4. Copy `.env.example` to `.env` and fill in your credentials:
   ```
   cp .env.example .env
   ```
5. Create the MySQL database:
   ```
   mysql -u root -p
   CREATE DATABASE shopify;
   exit;
   ```
6. Run the application:
   ```
   python app.py
   ```

### Environment Variables

See `.env.example` for all required environment variables.

### Shopify App Setup

1. Create a new app in your Shopify Partner account
2. Set the App URL to your backend URL
3. Configure the OAuth callback URL to `https://your-app-url.com/oauth/callback`
4. Add the required scopes:
   - `read_products`
   - `write_script_tags`
   - `read_themes`
   - `write_themes`
5. Copy your API key and secret to your `.env` file

## Security Considerations

- Never commit your `.env` file or any file containing credentials
- Use HTTPS in production
- Validate all Shopify webhook requests using HMAC verification
- Store access tokens securely in the database
- Implement proper error handling and logging

## API Endpoints

### Shopify Integration
- `GET /oauth/callback` - OAuth callback from Shopify
- `POST /install_script_tag` - Install script tag in shop
- `POST /webhooks/app_uninstalled` - Handle app uninstallation

### SEO
- `POST /seo/generate` - Generate JSON-LD schema for a product

### LLMs
- Check the routes/llms.py file for LLM-related endpoints

### Analytics
- Check the routes/analytics.py file for analytics-related endpoints

### Settings
- Check the routes/settings.py file for settings-related endpoints

## Database Models

- `ShopifyStore` - Store information and access tokens
- `SeoSchema` - Generated SEO schemas
- `LlmsSchema` - Generated LLM content
- `AnalyticsSchema` - Analytics data
- `AppSettings` - App configuration settings