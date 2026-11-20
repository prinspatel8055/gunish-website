/**
 * Custom production server for Gunish website.
 *
 * WHY THIS EXISTS:
 * Next.js caches the public/ directory at startup in production mode.
 * Images uploaded via the CMS to public/uploads/ after the server starts
 * would return 404 until PM2 is restarted.
 *
 * This server intercepts /uploads/ and /wp-content/uploads/ requests and reads files directly from
 * disk in real-time, bypassing the Next.js static cache.
 *
 * USAGE (via PM2):
 *   PORT=30000 pm2 start server.js --name "gunish"
 */

const next = require('next')
const http = require('http')
const path = require('path')
const fs = require('fs')
const url = require('url')

const app = next({ dev: false, dir: __dirname })
const handle = app.getRequestHandler()

const allowedExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.avif', '.svg', '.pdf']

app.prepare().then(() => {
  const server = http.createServer((req, res) => {
    const pathname = url.parse(req.url).pathname

    // Intercept /uploads/ and /wp-content/uploads/ requests and serve from disk directly
    if (pathname.startsWith('/uploads/') || pathname.startsWith('/wp-content/uploads/')) {
      const decodedPath = decodeURIComponent(pathname)
      let filePath = path.join(__dirname, 'public', decodedPath)
      
      // Fallback 1: If not found directly, check if it's wp-content/uploads
      if (!fs.existsSync(filePath)) {
        if (decodedPath.startsWith('/wp-content/uploads/')) {
          filePath = path.join(__dirname, 'public', decodedPath.replace('/wp-content', ''))
        }
      }

      // Fallback 2: Check flat in public/uploads/<basename>
      if (!fs.existsSync(filePath)) {
        const basename = path.basename(decodedPath)
        const flatCandidate = path.join(__dirname, 'public', 'uploads', basename)
        if (fs.existsSync(flatCandidate)) {
          filePath = flatCandidate
        }
      }

      const ext = path.extname(filePath).toLowerCase()

      // Security: Only allow known image/document extensions
      if (!allowedExtensions.includes(ext)) {
        res.statusCode = 403
        return res.end('Forbidden')
      }

      fs.stat(filePath, (err, stat) => {
        if (err || !stat.isFile()) {
          res.statusCode = 404
          return res.end('Not found')
        }

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

        res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream')
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
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
    console.log(`> Gunish server ready on port ${port}`)
  })
})
