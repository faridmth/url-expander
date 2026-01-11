module.exports = [
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/pages/api/expand.js [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>handler
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__ = __turbopack_context__.i("[externals]/axios [external] (axios, esm_import, [project]/node_modules/axios)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
// Browser-like headers to avoid 403 blocks from URL shorteners
const browserHeaders = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1'
};
// Function to expand URL by following redirects
async function expandUrl(shortUrl) {
    try {
        // Make a HEAD request first (lighter than GET)
        const response = await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__["default"].head(shortUrl, {
            maxRedirects: 10,
            headers: browserHeaders,
            validateStatus: function(status) {
                return status >= 200 && status < 400; // Accept redirects and success
            },
            timeout: 10000 // 10 second timeout
        });
        // Return the final URL after following all redirects
        return response.request.res.responseUrl || shortUrl;
    } catch (error) {
        // If HEAD fails, try GET request
        try {
            const response = await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$2c$__$5b$project$5d2f$node_modules$2f$axios$29$__["default"].get(shortUrl, {
                maxRedirects: 10,
                headers: browserHeaders,
                validateStatus: function(status) {
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
async function handler(req, res) {
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
        res.setHeader('Allow', [
            'GET',
            'POST'
        ]);
        res.status(405).json({
            error: `Method ${req.method} Not Allowed`
        });
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__225aaf8f._.js.map