import axios from 'axios';

// Browser-like headers to avoid 403 blocks from URL shorteners
const browserHeaders = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.5',
  'Accept-Encoding': 'gzip, deflate, br',
  'Connection': 'keep-alive',
  'Upgrade-Insecure-Requests': '1',
};

// Extract URL from HTML meta refresh or JavaScript redirects
function extractUrlFromHtml(html, originalUrl) {
  // Try meta refresh: <meta http-equiv="refresh" content="0;url=...">
  const metaRefreshMatch = html.match(/<meta[^>]+http-equiv=["']?refresh["']?[^>]+content=["']?\d+;\s*url=([^"'\s>]+)/i);
  if (metaRefreshMatch) {
    return metaRefreshMatch[1];
  }

  // Try meta property og:url or twitter:url
  const ogUrlMatch = html.match(/<meta[^>]+(?:property|name)=["']?(?:og:url|twitter:url)["']?[^>]+content=["']?([^"'\s>]+)/i);
  if (ogUrlMatch) {
    return ogUrlMatch[1];
  }

  // Try canonical link
  const canonicalMatch = html.match(/<link[^>]+rel=["']?canonical["']?[^>]+href=["']?([^"'\s>]+)/i);
  if (canonicalMatch) {
    return canonicalMatch[1];
  }

  // Try JavaScript redirect: window.location = "..." or location.href = "..."
  const jsRedirectMatch = html.match(/(?:window\.)?location(?:\.href)?\s*=\s*["']([^"']+)["']/i);
  if (jsRedirectMatch) {
    return jsRedirectMatch[1];
  }

  // Try title attribute with URL (t.co specific): <title>https://...</title>
  const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
  if (titleMatch && titleMatch[1].startsWith('http')) {
    return titleMatch[1];
  }

  // Try noscript meta refresh
  const noscriptMatch = html.match(/<noscript>.*?<meta[^>]+http-equiv=["']?refresh["']?[^>]+content=["']?\d+;\s*url=([^"'\s>]+)/is);
  if (noscriptMatch) {
    return noscriptMatch[1];
  }

  return null;
}

// Function to expand URL by following redirects
async function expandUrl(shortUrl) {
  try {
    // First, try a GET request to capture both HTTP redirects and HTML-based redirects
    const response = await axios.get(shortUrl, {
      maxRedirects: 10,
      headers: browserHeaders,
      validateStatus: function (status) {
        return status >= 200 && status < 400;
      },
      timeout: 10000,
      // Don't decompress to avoid issues
      decompress: true
    });

    // Check if we got redirected via HTTP
    const httpRedirectUrl = response.request.res?.responseUrl || response.request?.responseURL;
    
    // If HTTP redirect happened and it's different from original, use it
    if (httpRedirectUrl && httpRedirectUrl !== shortUrl) {
      // But also check HTML for further redirects
      if (typeof response.data === 'string') {
        const htmlUrl = extractUrlFromHtml(response.data, httpRedirectUrl);
        if (htmlUrl && htmlUrl !== httpRedirectUrl) {
          return htmlUrl;
        }
      }
      return httpRedirectUrl;
    }

    // No HTTP redirect, check HTML for meta refresh or JS redirect
    if (typeof response.data === 'string') {
      const htmlUrl = extractUrlFromHtml(response.data, shortUrl);
      if (htmlUrl) {
        return htmlUrl;
      }
    }

    // No redirect found, return original URL
    return shortUrl;

  } catch (error) {
    // If GET fails, try HEAD request as fallback
    try {
      const response = await axios.head(shortUrl, {
        maxRedirects: 10,
        headers: browserHeaders,
        validateStatus: function (status) {
          return status >= 200 && status < 400;
        },
        timeout: 10000
      });

      return response.request.res?.responseUrl || shortUrl;

    } catch (headError) {
      throw new Error(`Unable to expand URL: ${error.message}`);
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
      let { url } = req.body;
      
      // Strip surrounding quotes if present
      if (url) {
        url = url.replace(/^["']+|["']+$/g, '');
      }

      if (!url) {
        return res.json({
          success: true,
          shortUrl: url || '',
          expandedUrl: "you must skip this url because its not working",
          timestamp: new Date().toISOString()
        });
      }

      // Validate URL format
      if (!isValidUrl(url)) {
        return res.json({
          success: true,
          shortUrl: url,
          expandedUrl: "you must skip this url because its not working",
          timestamp: new Date().toISOString()
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
      res.json({
        success: true,
        shortUrl: url,
        expandedUrl: "you must skip this url because its not working",
        timestamp: new Date().toISOString()
      });
    }
  } else if (req.method === 'GET') {
    try {
      let { url } = req.query;
      
      // Strip surrounding quotes if present
      if (url) {
        url = url.replace(/^["']+|["']+$/g, '');
      }

      if (!url) {
        return res.json({
          success: true,
          shortUrl: url || '',
          expandedUrl: "you must skip this url because its not working",
          timestamp: new Date().toISOString()
        });
      }

      // Validate URL format
      if (!isValidUrl(url)) {
        return res.json({
          success: true,
          shortUrl: url,
          expandedUrl: "you must skip this url because its not working",
          timestamp: new Date().toISOString()
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
      res.json({
        success: true,
        shortUrl: url,
        expandedUrl: "you must skip this url because its not working",
        timestamp: new Date().toISOString()
      });
    }
  } else {
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
