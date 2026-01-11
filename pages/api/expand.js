import axios from 'axios';

// Function to expand URL by following redirects
async function expandUrl(shortUrl) {
  try {
    // Make a HEAD request first (lighter than GET)
    const response = await axios.head(shortUrl, {
      maxRedirects: 10,
      validateStatus: function (status) {
        return status >= 200 && status < 400; // Accept redirects and success
      },
      timeout: 10000 // 10 second timeout
    });

    // Return the final URL after following all redirects
    return response.request.res.responseUrl || shortUrl;

  } catch (error) {
    // If HEAD fails, try GET request
    try {
      const response = await axios.get(shortUrl, {
        maxRedirects: 10,
        validateStatus: function (status) {
          return status >= 200 && status < 400;
        },
        timeout: 10000
      });

      return response.request.res.responseUrl || shortUrl;

    } catch (getError) {
      throw new Error(`Unable to expand URL: ${getError.message}`);
    }
  }
}

// Validate URL format
function isValidUrl(string) {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (err) {
    return false;
  }
}

export default async function handler(req, res) {
  // Handle GET and POST requests
  if (req.method === 'POST') {
    try {
      const { url } = req.body;

      if (!url) {
        return res.status(400).json({
          error: 'URL is required',
          message: 'Please provide a URL in the request body'
        });
      }

      // Validate URL format
      if (!isValidUrl(url)) {
        return res.status(400).json({
          error: 'Invalid URL format',
          message: 'Please provide a valid URL'
        });
      }

      const expandedUrl = await expandUrl(url);

      res.json({
        success: true,
        shortUrl: url,
        expandedUrl: expandedUrl,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Error expanding URL:', error.message);
      res.status(500).json({
        error: 'Failed to expand URL',
        message: error.message
      });
    }
  } else if (req.method === 'GET') {
    try {
      const { url } = req.query;

      if (!url) {
        return res.status(400).json({
          error: 'URL is required',
          message: 'Please provide a URL as a query parameter: /api/expand?url=your_url'
        });
      }

      // Validate URL format
      if (!isValidUrl(url)) {
        return res.status(400).json({
          error: 'Invalid URL format',
          message: 'Please provide a valid URL'
        });
      }

      const expandedUrl = await expandUrl(url);

      res.json({
        success: true,
        shortUrl: url,
        expandedUrl: expandedUrl,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Error expanding URL:', error.message);
      res.status(500).json({
        error: 'Failed to expand URL',
        message: error.message
      });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
