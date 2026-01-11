export default function handler(req, res) {
  res.json({
    message: 'URL Expander API',
    endpoints: {
      expand: {
        method: 'POST',
        path: '/api/expand',
        body: { url: 'short_url_here' }
      },
      expandGet: {
        method: 'GET',
        path: '/api/expand?url=short_url_here'
      }
    }
  });
}
