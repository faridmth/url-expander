# URL Expander API - Next.js Version

A REST API built with Next.js that expands shortened URLs to reveal their final destination URL.

## Features

- Expands short URLs (bit.ly, tinyurl, t.co, etc.) to their real destination
- Follows multiple redirects automatically
- Supports both GET and POST requests
- Built with Next.js API Routes
- Error handling and validation
- Modern React frontend with API documentation

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The app will run on `http://localhost:3000` by default.

For production:
```bash
npm run build
npm start
```

## API Endpoints

### 1. Expand URL (POST)

**Endpoint:** `POST /api/expand`

**Request Body:**
```json
{
  "url": "https://bit.ly/example"
}
```

**Response:**
```json
{
  "success": true,
  "shortUrl": "https://bit.ly/example",
  "expandedUrl": "https://actual-destination.com",
  "timestamp": "2026-01-11T12:00:00.000Z"
}
```

**Example using curl:**
```bash
curl -X POST http://localhost:3000/api/expand \
  -H "Content-Type: application/json" \
  -d '{"url": "https://bit.ly/3pZlSQP"}'
```

**Example using fetch:**
```javascript
fetch('http://localhost:3000/api/expand', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    url: 'https://bit.ly/3pZlSQP'
  })
})
  .then(response => response.json())
  .then(data => console.log(data));
```

### 2. Expand URL (GET)

**Endpoint:** `GET /api/expand?url={short_url}`

**Query Parameters:**
- `url` (required): The shortened URL to expand

**Example:**
```bash
curl "http://localhost:3000/api/expand?url=https://bit.ly/3pZlSQP"
```

**Response:**
```json
{
  "success": true,
  "shortUrl": "https://bit.ly/3pZlSQP",
  "expandedUrl": "https://actual-destination.com",
  "timestamp": "2026-01-11T12:00:00.000Z"
}
```

## Error Handling

The API returns appropriate HTTP status codes and error messages:

**400 Bad Request** - Missing or invalid URL:
```json
{
  "error": "Invalid URL format",
  "message": "Please provide a valid URL"
}
```

**500 Internal Server Error** - Failed to expand URL:
```json
{
  "error": "Failed to expand URL",
  "message": "Unable to expand URL: Connection timeout"
}
```

## Tech Stack

- **Next.js** - React framework with API routes
- **React** - Frontend UI
- **Axios** - HTTP client for following redirects

## Project Structure

```
urlexpanderapi/
├── pages/
│   ├── api/
│   │   ├── expand.js      # Main API endpoint
│   │   └── index.js       # API info endpoint
│   ├── _app.js            # Next.js app wrapper
│   ├── _document.js       # Custom document
│   └── index.js           # Homepage with documentation
├── next.config.js         # Next.js configuration
├── package.json
└── README.md
```

## Development

The API uses Next.js API Routes which run as serverless functions. Each API route is a serverless function that can be individually deployed.

To add new endpoints, create new files in the `pages/api/` directory.

## License

ISC
