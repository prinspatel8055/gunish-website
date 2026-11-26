import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { unlink, writeFile, stat } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import sharp from 'sharp';
import { requirePermission } from '@/lib/auth';

interface RouteParams {
  params: Promise<{ id: string }>;
}

const ALLOWED_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif', '.gif', '.pdf', '.svg']);
const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15 MB

// Helper: delete all responsive image variants generated during upload
async function deleteImageVariants(uploadsDir: string, baseName: string) {
  const variants = [
    `${baseName}.avif`,
    `${baseName}.webp`,
    `${baseName}-mobile.avif`,
    `${baseName}-tablet.avif`,
    `${baseName}-desktop.avif`,
  ];
  await Promise.all(
    variants.map(async (v) => {
      const p = path.join(uploadsDir, v);
      if (existsSync(p)) {
        try { await unlink(p); } catch {}
      }
    })
  );
}

// Helper: compress and generate all responsive variants (mirrors /api/media/route.ts)
async function processAndSaveImage(filePath: string, buffer: Buffer) {
  const ext = path.extname(filePath).toLowerCase();
  const outputDir = path.dirname(filePath);
  const baseName = path.basename(filePath, ext);

  const isSupportedImage = ['.png', '.jpg', '.jpeg', '.webp'].includes(ext);

  if (!isSupportedImage) {
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

    // 2–6. Generate all responsive variants in parallel
    await Promise.all([
      sharp(buffer).webp({ quality: 80 }).toFile(path.join(outputDir, `${baseName}.webp`)),
      sharp(buffer).avif({ quality: 75 }).toFile(path.join(outputDir, `${baseName}.avif`)),
      sharp(buffer).resize({ width: 480 }).avif({ quality: 60 }).toFile(path.join(outputDir, `${baseName}-mobile.avif`)),
      sharp(buffer).resize({ width: 800 }).avif({ quality: 70 }).toFile(path.join(outputDir, `${baseName}-tablet.avif`)),
      sharp(buffer).resize({ width: 1200 }).avif({ quality: 75 }).toFile(path.join(outputDir, `${baseName}-desktop.avif`)),
    ]);
  } catch (error) {
    console.error(`Failed to process image ${filePath}:`, error);
    await writeFile(filePath, buffer);
    throw error; // Re-throw so the caller can return a proper error response
  }
}

// DELETE /api/media/[id]
export async function DELETE(request: Request, { params }: RouteParams) {
  const { errorResponse } = await requirePermission(request, 'manage_media');
  if (errorResponse) return errorResponse;

  try {
    const { id } = await params;
    const media = await (prisma as any).media.findUnique({ where: { id } });

    if (!media) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 });
    }

    const publicDir = path.resolve(process.cwd(), 'public');
    const uploadsDir = path.resolve(publicDir, 'uploads');
    const ext = path.extname(media.filename);
    const baseName = path.basename(media.filename, ext);

    // Delete the primary file safely within public directory
    const filePath = path.resolve(publicDir, media.url.replace(/^\/+/, ''));
    if (filePath.startsWith(publicDir) && existsSync(filePath)) {
      await unlink(filePath);
    }

    // Delete all generated responsive variants
    await deleteImageVariants(uploadsDir, baseName);

    await (prisma as any).media.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/media/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete media' }, { status: 500 });
  }
}

// PATCH /api/media/[id] - Update alt text
export async function PATCH(request: Request, { params }: RouteParams) {
  const { errorResponse } = await requirePermission(request, 'manage_media');
  if (errorResponse) return errorResponse;

  try {
    const { id } = await params;
    const { alt } = await request.json();

    const media = await (prisma as any).media.update({
      where: { id },
      data: { alt: (alt || '').slice(0, 200) },
    });

    return NextResponse.json(media);
  } catch (error) {
    console.error('PATCH /api/media/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update media' }, { status: 500 });
  }
}

// PUT /api/media/[id] - Replace file contents
export async function PUT(request: Request, { params }: RouteParams) {
  const { errorResponse } = await requirePermission(request, 'manage_media');
  if (errorResponse) return errorResponse;

  try {
    const { id } = await params;
    const media = await (prisma as any).media.findUnique({ where: { id } });

    if (!media) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File exceeds maximum 15MB size limit' }, { status: 400 });
    }

    const ext = path.extname(file.name).toLowerCase();
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      return NextResponse.json({ error: 'Disallowed file extension' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Stored XSS defense
    if (ext === '.svg') {
      const svgText = buffer.toString('utf-8').toLowerCase();
      const dangerousPatterns = ['<script', 'javascript:', 'onload=', 'onerror=', 'onclick=', '<iframe', '<object', '<embed', '<!entity'];
      if (dangerousPatterns.some(p => svgText.includes(p))) {
        return NextResponse.json({ error: 'Disallowed script content in SVG' }, { status: 400 });
      }
    }

    const uploadsDir = path.resolve(process.cwd(), 'public', 'uploads');
    const oldExt = path.extname(media.filename);
    const oldBaseName = path.basename(media.filename, oldExt);

    let filename = media.filename;
    let url = media.url;

    if (ext.toLowerCase() === oldExt.toLowerCase()) {
      // Same extension — overwrite in-place, delete old variants first then regenerate
      const filePath = path.resolve(uploadsDir, filename);
      if (!filePath.startsWith(uploadsDir)) {
        return NextResponse.json({ error: 'Invalid file path' }, { status: 403 });
      }
      await deleteImageVariants(uploadsDir, oldBaseName);
      await processAndSaveImage(filePath, buffer);
    } else {
      // Different extension — delete old file + variants, create new file
      const publicDir = path.resolve(process.cwd(), 'public');
      const oldFilePath = path.resolve(publicDir, media.url.replace(/^\/+/, ''));
      if (oldFilePath.startsWith(publicDir) && existsSync(oldFilePath)) {
        await unlink(oldFilePath);
      }
      await deleteImageVariants(uploadsDir, oldBaseName);

      const rawBase = path.basename(media.filename, oldExt)
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 40) || 'upload';

      filename = `${rawBase}-${Date.now()}${ext}`;
      url = `/uploads/${filename}`;
      const filePath = path.resolve(uploadsDir, filename);
      if (!filePath.startsWith(uploadsDir)) {
        return NextResponse.json({ error: 'Invalid file path' }, { status: 403 });
      }
      await processAndSaveImage(filePath, buffer);
    }

    // Query compressed file size on disk
    let finalSize = file.size;
    try {
      const filePath = path.join(uploadsDir, filename);
      if (existsSync(filePath)) {
        finalSize = (await stat(filePath)).size;
      }
    } catch {}

    const updatedMedia = await (prisma as any).media.update({
      where: { id },
      data: {
        filename,
        originalName: file.name,
        mimeType: file.type,
        size: finalSize,
        url,
      },
    });

    return NextResponse.json(updatedMedia);
  } catch (error) {
    console.error('PUT /api/media/[id] error:', error);
    return NextResponse.json({ error: 'Failed to replace media', details: String(error) }, { status: 500 });
  }
}
