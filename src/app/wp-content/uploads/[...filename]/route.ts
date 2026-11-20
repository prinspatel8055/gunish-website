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

const searchRoots = [
  path.join(process.cwd(), 'public', 'wp-content', 'uploads'),
  path.join(process.cwd(), 'public', 'uploads'),
  path.join('d:/..111 web/gunish-website/public/wp-content/uploads'),
  path.join('d:/..111 web/gunish-website/public/uploads'),
];

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { filename: segments } = await params;
    if (!segments || segments.length === 0) {
      return new NextResponse('File Not Found', { status: 404 });
    }

    const decodedSegments = segments.map((s) => decodeURIComponent(s));
    const relativePath = decodedSegments.join('/');
    const basename = decodedSegments[decodedSegments.length - 1];
    const ext = path.extname(basename).toLowerCase();

    let resolvedPath: string | null = null;

    // 1. Try exact relative path in search roots
    for (const root of searchRoots) {
      const candidate = path.join(root, relativePath);
      if (existsSync(candidate)) {
        resolvedPath = candidate;
        break;
      }
    }

    // 2. Try flat basename in search roots
    if (!resolvedPath) {
      for (const root of searchRoots) {
        const candidate = path.join(root, basename);
        if (existsSync(candidate)) {
          resolvedPath = candidate;
          break;
        }
      }
    }

    // 3. Case-insensitive search
    if (!resolvedPath) {
      for (const root of searchRoots) {
        if (!existsSync(root)) continue;
        try {
          const files = readdirSync(root);
          const lowerBasename = basename.toLowerCase();
          const match = files.find((f) => f.toLowerCase() === lowerBasename);
          if (match) {
            resolvedPath = path.join(root, match);
            break;
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
      },
    });
  } catch (error) {
    console.error('Error serving wp-content upload:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
