import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { writeFile, mkdir, stat } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import sharp from 'sharp';

export const dynamic = 'force-dynamic';

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

// GET /api/media - List all media
export async function GET() {
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

// POST /api/media - Upload a file
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const alt = (formData.get('alt') as string) || '';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Generate unique filename
    const ext = path.extname(file.name);
    const baseName = path.basename(file.name, ext)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .slice(0, 50);
    const filename = `${baseName}-${Date.now()}${ext}`;
    const filePath = path.join(uploadsDir, filename);

    // Save and optimize the file
    try {
      await processAndSaveImage(filePath, buffer);
    } catch (sharpError) {
      console.error('Image compression failed:', sharpError);
      return NextResponse.json(
        { error: 'Image upload failed: could not compress or process the image. Ensure sharp is installed correctly on the server.' },
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
        mimeType: file.type,
        size: finalSize,
        url: `/uploads/${filename}`,
        alt,
      },
    });

    return NextResponse.json(media, { status: 201 });
  } catch (error) {
    console.error('POST /api/media error:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
