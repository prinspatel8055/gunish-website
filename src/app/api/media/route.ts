import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { writeFile, mkdir, stat } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import sharp from 'sharp';
import { requirePermission } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const ALLOWED_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif', '.gif', '.pdf', '.svg']);
const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15 MB

// Helper function to optimize and save images in multiple responsive formats and sizes
async function processAndSaveImage(filePath: string, buffer: Buffer) {
  const ext = path.extname(filePath).toLowerCase();
  const outputDir = path.dirname(filePath);
  const baseName = path.basename(filePath, ext);

  const isSupportedImage = ['.png', '.jpg', '.jpeg', '.webp'].includes(ext);

  if (!isSupportedImage) {
    // Save as-is for non-image formats like PDF, SVG
    await writeFile(filePath, buffer);
    return;
  }

  try {
    // 1. Compress the original in-place
    const pipeline = sharp(buffer);
    if (ext === '.png') {
      await pipeline.png({ compressionLevel: 9, quality: 75, force: true }).toFile(filePath);
    } else if (ext === '.jpg' || ext === '.jpeg') {
      await pipeline.jpeg({ quality: 75, progressive: true, force: true }).toFile(filePath);
    } else if (ext === '.webp') {
      await pipeline.webp({ quality: 80, force: true }).toFile(filePath);
    }

    // 2–6. Generate all responsive variants in parallel (4x faster than sequential)
    await Promise.all([
      sharp(buffer).webp({ quality: 80 }).toFile(path.join(outputDir, `${baseName}.webp`)),
      sharp(buffer).avif({ quality: 75 }).toFile(path.join(outputDir, `${baseName}.avif`)),
      sharp(buffer).resize({ width: 480 }).avif({ quality: 60 }).toFile(path.join(outputDir, `${baseName}-mobile.avif`)),
      sharp(buffer).resize({ width: 800 }).avif({ quality: 70 }).toFile(path.join(outputDir, `${baseName}-tablet.avif`)),
      sharp(buffer).resize({ width: 1200 }).avif({ quality: 75 }).toFile(path.join(outputDir, `${baseName}-desktop.avif`)),
    ]);

  } catch (error) {
    console.error(`Failed to process and optimize image ${filePath}:`, error);
    // Fallback to saving original unmodified buffer if sharp fails
    await writeFile(filePath, buffer);
    throw error; // Re-throw so the caller can surface a proper error response
  }
}

// GET /api/media - List all media (requires admin auth)
export async function GET(request: Request) {
  const { errorResponse } = await requirePermission(request, 'manage_media');
  if (errorResponse) return errorResponse;

  try {
    const media = await (prisma as any).media.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(media, {
      headers: {
        'Cache-Control': 'no-store, max-age=0, must-revalidate',
      },
    });
  } catch (error) {
    console.error('GET /api/media error:', error);
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 });
  }
}

// POST /api/media - Upload a file (strict validation, extension whitelist, path traversal defense)
export async function POST(request: Request) {
  const { errorResponse } = await requirePermission(request, 'manage_media');
  if (errorResponse) return errorResponse;

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const alt = (formData.get('alt') as string) || '';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // 1. File size check
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File size exceeds the 15MB limit (${(file.size / 1024 / 1024).toFixed(1)}MB)` },
        { status: 400 }
      );
    }

    // 2. Extension validation against strict whitelist
    const ext = path.extname(file.name).toLowerCase();
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      return NextResponse.json(
        { error: `Disallowed file type (${ext}). Only images (JPG, PNG, WEBP, AVIF, GIF, SVG) and PDFs are permitted.` },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 3. Stored XSS defense: Sanitize SVG content
    if (ext === '.svg') {
      const svgText = buffer.toString('utf-8').toLowerCase();
      const dangerousPatterns = ['<script', 'javascript:', 'onload=', 'onerror=', 'onclick=', '<iframe', '<object', '<embed', '<!entity'];
      const hasDanger = dangerousPatterns.some(p => svgText.includes(p));
      if (hasDanger) {
        return NextResponse.json(
          { error: 'SVG file rejected: file contains active scripts or disallowed tags.' },
          { status: 400 }
        );
      }
    }

    // Ensure uploads directory exists
    const uploadsDir = path.resolve(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Generate safe sanitized filename
    const rawBase = path.basename(file.name, ext)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 40) || 'upload';

    const filename = `${rawBase}-${Date.now()}${ext}`;
    const filePath = path.resolve(uploadsDir, filename);

    // Path traversal check
    if (!filePath.startsWith(uploadsDir)) {
      return NextResponse.json({ error: 'Security violation: invalid file path' }, { status: 403 });
    }

    // Save and optimize the file
    try {
      await processAndSaveImage(filePath, buffer);
    } catch (sharpError) {
      console.error('Image compression failed:', sharpError);
      return NextResponse.json(
        { error: 'Image processing failed. Ensure valid image data is supplied.' },
        { status: 500 }
      );
    }

    // Query file size on disk after compression
    let finalSize = file.size;
    try {
      if (existsSync(filePath)) {
        finalSize = (await stat(filePath)).size;
      }
    } catch {}

    const media = await (prisma as any).media.create({
      data: {
        filename,
        originalName: file.name,
        mimeType: file.type || 'application/octet-stream',
        size: finalSize,
        url: `/uploads/${filename}`,
        alt: alt.slice(0, 200),
      },
    });

    return NextResponse.json(media, { status: 201 });
  } catch (error) {
    console.error('POST /api/media error:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
