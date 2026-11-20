import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

interface RouteParams {
  params: Promise<{ slug: string }>;
}

// GET /api/pages/[slug] - Get a single page by slug
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { slug } = await params;
    const page = await prisma.page.findUnique({ where: { slug } });

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    return NextResponse.json(page);
  } catch (error) {
    console.error('GET /api/pages/[slug] error:', error);
    return NextResponse.json({ error: 'Failed to fetch page' }, { status: 500 });
  }
}

// PUT /api/pages/[slug] - Update a page
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const { title, metaTitle, metaDescription, sections, isPublished, isMaintenance, lastUpdatedAt } = body;

    // Check for concurrency conflict
    if (lastUpdatedAt) {
      const existing = await prisma.page.findUnique({
        where: { slug },
        select: { updatedAt: true },
      });
      if (existing) {
        const dbTime = new Date(existing.updatedAt).getTime();
        const clientTime = new Date(lastUpdatedAt).getTime();
        
        // If the database has a newer timestamp, block the update
        if (dbTime > clientTime) {
          return NextResponse.json(
            { error: 'This page was recently updated by another user. To prevent losing their work, your save was cancelled. Please copy your edits, reload the page, and apply them again.' },
            { status: 409 }
          );
        }
      }
    }

    const page = await prisma.page.update({
      where: { slug },
      data: {
        ...(title !== undefined && { title }),
        ...(metaTitle !== undefined && { metaTitle }),
        ...(metaDescription !== undefined && { metaDescription }),
        ...(sections !== undefined && { sections }),
        ...(isPublished !== undefined && { isPublished }),
        ...(isMaintenance !== undefined && { isMaintenance }),
      },
    });

    if (slug === 'home') {
      revalidatePath('/');
    } else {
      revalidatePath(`/${slug}`);
    }
    revalidatePath('/', 'layout');
    
    return NextResponse.json(page);
  } catch (error: unknown) {
    const err = error as { code?: string };
    if (err.code === 'P2025') {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }
    console.error('PUT /api/pages/[slug] error:', error);
    return NextResponse.json({ error: 'Failed to update page' }, { status: 500 });
  }
}

// DELETE /api/pages/[slug] - Delete a page
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { slug } = await params;
    await prisma.page.delete({ where: { slug } });
    revalidatePath(`/${slug}`);
    revalidatePath('/', 'layout');
    return NextResponse.json({ message: 'Page deleted successfully' });
  } catch (error: unknown) {
    const err = error as { code?: string };
    if (err.code === 'P2025') {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }
    console.error('DELETE /api/pages/[slug] error:', error);
    return NextResponse.json({ error: 'Failed to delete page' }, { status: 500 });
  }
}
