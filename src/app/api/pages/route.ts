import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';


// GET /api/pages - List all pages
export async function GET() {
  try {
    const pages = await prisma.page.findMany({
      select: {
        id: true,
        slug: true,
        title: true,
        metaTitle: true,
        metaDescription: true,
        isPublished: true,
        isMaintenance: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(pages, {
      headers: {
        'Cache-Control': 'no-store, max-age=0, must-revalidate',
      },
    });
  } catch (error) {
    console.error('GET /api/pages error:', error);
    return NextResponse.json({ error: 'Failed to fetch pages' }, { status: 500 });
  }
}

// POST /api/pages - Create a new page
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { slug, title, metaTitle, metaDescription, sections, isPublished } = body;

    if (!slug || !title) {
      return NextResponse.json({ error: 'slug and title are required' }, { status: 400 });
    }

    const page = await prisma.page.create({
      data: {
        slug,
        title,
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        sections: sections || [],
        isPublished: isPublished ?? true,
      },
    });

    revalidatePath('/', 'layout');
    return NextResponse.json(page, { status: 201 });
  } catch (error: unknown) {
    const err = error as { code?: string };
    if (err.code === 'P2002') {
      return NextResponse.json({ error: 'A page with this slug already exists' }, { status: 409 });
    }
    console.error('POST /api/pages error:', error);
    return NextResponse.json({ error: 'Failed to create page' }, { status: 500 });
  }
}
