import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { existsSync, readdirSync } from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

interface RouteParams {
  params: Promise<{ filename: string[] }>;
}

const mimeTypes: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.pdf': 'application/pdf',
};

const ALLOWED_EXTS = new Set(Object.keys(mimeTypes));

// Search root candidates strictly within public/
const searchRoots = [
  path.resolve(process.cwd(), 'public', 'uploads'),
  path.resolve(process.cwd(), 'public', 'wp-content', 'uploads'),
];

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { filename: segments } = await params;
    if (!segments || segments.length === 0) {
      return new NextResponse('File Not Found', { status: 404 });
    }

    // Security: Block null bytes or obvious path traversal attempts in URL
    const decodedSegments = segments.map((s) => decodeURIComponent(s).replace(/\0/g, ''));
    if (decodedSegments.some((s) => s.includes('..') || s.includes('/') || s.includes('\\'))) {
      return new NextResponse('Access Denied', { status: 403 });
    }

    const relativePath = decodedSegments.join(path.sep);
    const basename = decodedSegments[decodedSegments.length - 1];
    const ext = path.extname(basename).toLowerCase();

    // Security: Restrict strictly to permitted image/document extensions
    if (!ALLOWED_EXTS.has(ext)) {
      return new NextResponse('Access Denied', { status: 403 });
    }

    let resolvedPath: string | null = null;

    // 1. Try exact relative path in search roots with strict bounds check
    for (const root of searchRoots) {
      const candidate = path.resolve(root, relativePath);
      if (candidate.startsWith(root) && existsSync(candidate)) {
        resolvedPath = candidate;
        break;
      }
    }

    // 2. Try flat basename in search roots with strict bounds check
    if (!resolvedPath) {
      for (const root of searchRoots) {
        const candidate = path.resolve(root, basename);
        if (candidate.startsWith(root) && existsSync(candidate)) {
          resolvedPath = candidate;
          break;
        }
      }
    }

    // 3. Case-insensitive search for basename in public/uploads
    if (!resolvedPath) {
      for (const root of searchRoots) {
        if (!existsSync(root)) continue;
        try {
          const files = readdirSync(root);
          const lowerBasename = basename.toLowerCase();
          const match = files.find((f) => f.toLowerCase() === lowerBasename);
          if (match) {
            const candidate = path.resolve(root, match);
            if (candidate.startsWith(root) && existsSync(candidate)) {
              resolvedPath = candidate;
              break;
            }
          }
        } catch {
          // Ignore read errors
        }
      }
    }

    if (!resolvedPath || !existsSync(resolvedPath)) {
      return new NextResponse('File Not Found', { status: 404 });
    }

    const fileBuffer = await readFile(resolvedPath);
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    console.error('Error serving upload:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
