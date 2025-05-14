# Shopify App Frontend

This is the frontend for a Shopify app built with React, Vite, and Material UI.

## Features

- SEO optimization with JSON-LD generation
- LLM-powered content generation
- Analytics tracking
- Script Tag injection
- Settings management

## Setup Instructions

### Prerequisites

- Node.js 16+
- npm or yarn
- Backend server running (see server/README.md)

### Installation

1. Install dependencies:
   ```
   npm install
   # or
   yarn
   ```

2. Start the development server:
   ```
   npm run dev
   # or
   yarn dev
   ```

3. Build for production:
   ```
   npm run build
   # or
   yarn build
   ```

## Project Structure

- `src/components/` - Reusable UI components
- `src/pages/` - Page components
- `src/services/` - API services and utilities
- `src/assets/` - Static assets like images
- `src/App.jsx` - Main application component
- `src/main.jsx` - Application entry point

## API Integration

The frontend communicates with the Flask backend through the API service. The Vite development server is configured to proxy API requests to the backend server.

### API Service

The `apiService` in `src/services/api.js` provides methods for interacting with the backend API:

- `injectScriptTag(data)` - Inject a script tag into a Shopify store
- `getSettings()` - Get application settings
- `updateSettings(data)` - Update application settings

## Components

### ScriptTagInjector

The `ScriptTagInjector` component allows users to inject JavaScript files into their Shopify store. It sends a POST request to the backend API with the following data:

```json
{
  "shop": "store-name.myshopify.com",
  "script_url": "https://example.com/script.js"
}
```

## Development

### Adding New Features

1. Create new components in the `src/components/` directory
2. Create new pages in the `src/pages/` directory
3. Add routes to `App.jsx`
4. Add API methods to `src/services/api.js`

### Proxy Configuration

The Vite development server is configured to proxy API requests to the backend server. See `vite.config.js` for details.
