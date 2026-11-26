import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { requirePermission } from '@/lib/auth';

export const dynamic = 'force-dynamic';

function getMimeType(ext: string) {
  switch (ext.toLowerCase()) {
    case '.png': return 'image/png';
    case '.jpg':
    case '.jpeg': return 'image/jpeg';
    case '.webp': return 'image/webp';
    case '.svg': return 'image/svg+xml';
    case '.pdf': return 'application/pdf';
    default: return 'application/octet-stream';
  }
}

function formatAlt(filename: string) {
  const nameWithoutExt = path.parse(filename).name;
  return nameWithoutExt
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getMasterFiles(dir: string, prefix = '/uploads') {
  let list: Array<{ name: string; url: string; size: number; ext: string }> = [];
  if (!fs.existsSync(dir)) return list;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const ent of entries) {
    const fullPath = path.join(dir, ent.name);
    const relUrl = `${prefix}/${ent.name}`.replace(/\\/g, '/');
    if (ent.isDirectory()) {
      list = list.concat(getMasterFiles(fullPath, relUrl));
    } else {
      const ext = path.extname(ent.name).toLowerCase();
      if (['.png', '.jpg', '.jpeg', '.webp', '.pdf', '.svg'].includes(ext)) {
        // filter out WordPress resized variants like -300x200.jpg
        if (!/-\d+x\d+\.(png|jpg|jpeg|webp)$/i.test(ent.name)) {
          const stats = fs.statSync(fullPath);
          list.push({
            name: ent.name,
            url: relUrl,
            size: stats.size,
            ext,
          });
        }
      }
    }
  }
  return list;
}

export async function POST(request: Request) {
  const { errorResponse } = await requirePermission(request, 'manage_media');
  if (errorResponse) return errorResponse;

  try {
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    const publicDir = path.join(process.cwd(), 'public');

    // 1. Fetch current items in DB
    const currentDbMedia = await (prisma as any).media.findMany();

    // 2. Delete ghost records if physical file does not exist
    let deleted = 0;
    for (const item of currentDbMedia) {
      const filePath = path.join(publicDir, item.url.replace(/^\//, ''));
      if (!fs.existsSync(filePath)) {
        await (prisma as any).media.delete({ where: { id: item.id } });
        deleted++;
      }
    }

    // 3. Scan disk for master files
    const diskFiles = getMasterFiles(uploadsDir);
    const remainingDbMedia = await (prisma as any).media.findMany();
    const existingUrls = new Set(remainingDbMedia.map((m: any) => m.url));

    let added = 0;
    for (const f of diskFiles) {
      if (!existingUrls.has(f.url)) {
        const id = 'med-' + crypto.createHash('md5').update(f.url).digest('hex').slice(0, 12);
        await (prisma as any).media.create({
          data: {
            id,
            filename: f.name,
            originalName: f.name,
            mimeType: getMimeType(f.ext),
            size: f.size,
            url: f.url,
            alt: formatAlt(f.name),
          },
        });
        existingUrls.add(f.url);
        added++;
      }
    }

    const total = await (prisma as any).media.count();
    return NextResponse.json({ success: true, added, deleted, total });
  } catch (error: any) {
    console.error('Error syncing media:', error);
    return NextResponse.json({ error: error.message || 'Failed to sync media' }, { status: 500 });
  }
}
