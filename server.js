/**
 * Custom hardened production server for Gunish website.
 *
 * WHY THIS EXISTS:
 * Next.js caches the public/ directory at startup in production mode.
 * Images uploaded via the CMS to public/uploads/ after the server starts
 * would return 404 until PM2 is restarted.
 *
 * This server intercepts /uploads/ and /wp-content/uploads/ requests and reads files directly from
 * disk in real-time, with strict security checks (no path traversal, extension whitelist, security headers).
 *
 * USAGE (via PM2):
 *   PORT=5005 node server.js
 */

const next = require('next')
const http = require('http')
const path = require('path')
const fs = require('fs')
const url = require('url')

const app = next({ dev: false, dir: __dirname })
const handle = app.getRequestHandler()

const allowedExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.avif', '.svg', '.pdf']
const publicDir = path.resolve(__dirname, 'public')

const mimeTypes = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
}

app.prepare().then(() => {
  const server = http.createServer((req, res) => {
    // Security: Strip identifying server banners
    res.removeHeader('X-Powered-By')

    let pathname = '/'
    try {
      pathname = url.parse(req.url).pathname || '/'
    } catch {
      res.statusCode = 400
      return res.end('Bad Request')
    }

    // Intercept /uploads/ and /wp-content/uploads/ requests and serve from disk directly with strict security
    if (pathname.startsWith('/uploads/') || pathname.startsWith('/wp-content/uploads/')) {
      let decodedPath = ''
      try {
        decodedPath = decodeURIComponent(pathname).replace(/\0/g, '')
      } catch {
        res.statusCode = 400
        return res.end('Bad Request')
      }

      // Security: Block directory traversal attempts immediately
      if (decodedPath.includes('..')) {
        res.statusCode = 403
        return res.end('Forbidden: Invalid path')
      }

      let filePath = path.resolve(publicDir, decodedPath.replace(/^\/+/, ''))

      // Fallback 1: If not found directly, check if it's wp-content/uploads
      if (!fs.existsSync(filePath)) {
        if (decodedPath.startsWith('/wp-content/uploads/')) {
          const alternate = decodedPath.replace('/wp-content', '').replace(/^\/+/, '')
          filePath = path.resolve(publicDir, alternate)
        }
      }

      // Fallback 2: Check flat in public/uploads/<basename>
      if (!fs.existsSync(filePath)) {
        const basename = path.basename(decodedPath)
        const flatCandidate = path.resolve(publicDir, 'uploads', basename)
        if (fs.existsSync(flatCandidate)) {
          filePath = flatCandidate
        }
      }

      // Security: Ensure resolved filePath is strictly within publicDir
      if (!filePath.startsWith(publicDir)) {
        res.statusCode = 403
        return res.end('Forbidden: Directory traversal denied')
      }

      const ext = path.extname(filePath).toLowerCase()

      // Security: Only allow safe image/document extensions
      if (!allowedExtensions.includes(ext)) {
        res.statusCode = 403
        return res.end('Forbidden: Disallowed file type')
      }

      fs.stat(filePath, (err, stat) => {
        if (err || !stat.isFile()) {
          res.statusCode = 404
          return res.end('Not found')
        }

        // Apply strict HTTP security headers
        res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream')
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
        res.setHeader('X-Content-Type-Options', 'nosniff')
        res.setHeader('X-Frame-Options', 'SAMEORIGIN')
        res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
        fs.createReadStream(filePath).pipe(res)
      })
      return
    }

    // All other requests go to Next.js
    handle(req, res)
  })

  // IMPORTANT: Always use process.env.PORT — Webuzo sets this externally
  const port = process.env.PORT || 5000
  server.listen(port, () => {
    console.log(`> Gunish hardened server ready on port ${port}`)
  })
})
