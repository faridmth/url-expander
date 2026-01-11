export default function Home() {
  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '50px 20px', 
      fontFamily: 'system-ui, -apple-system, sans-serif' 
    }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>
        URL Expander API
      </h1>
      
      <div style={{ 
        background: '#f5f5f5', 
        padding: '20px', 
        borderRadius: '8px',
        marginBottom: '20px' 
      }}>
        <h2>API Endpoints</h2>
        
        <div style={{ marginBottom: '20px' }}>
          <h3>1. Expand URL (POST)</h3>
          <p><strong>Endpoint:</strong> <code>/api/expand</code></p>
          <p><strong>Method:</strong> POST</p>
          <p><strong>Request Body:</strong></p>
          <pre style={{ 
            background: '#fff', 
            padding: '10px', 
            borderRadius: '4px',
            overflow: 'auto'
          }}>
{`{
  "url": "https://bit.ly/example"
}`}
          </pre>
        </div>

        <div>
          <h3>2. Expand URL (GET)</h3>
          <p><strong>Endpoint:</strong> <code>/api/expand?url=short_url_here</code></p>
          <p><strong>Method:</strong> GET</p>
          <p><strong>Example:</strong></p>
          <pre style={{ 
            background: '#fff', 
            padding: '10px', 
            borderRadius: '4px',
            overflow: 'auto'
          }}>
{`/api/expand?url=https://bit.ly/3pZlSQP`}
          </pre>
        </div>
      </div>

      <div style={{ 
        background: '#e8f5e9', 
        padding: '20px', 
        borderRadius: '8px' 
      }}>
        <h2>Features</h2>
        <ul>
          <li>Expands short URLs (bit.ly, tinyurl, t.co, etc.) to their real destination</li>
          <li>Follows multiple redirects automatically</li>
          <li>Supports both GET and POST requests</li>
          <li>Error handling and validation</li>
        </ul>
      </div>
    </div>
  );
}
