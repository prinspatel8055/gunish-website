import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { variant, subpageHeight, subpageAlign, lightBgStyle, lightGradientPos } = body;

    if (!variant) {
      return NextResponse.json({ error: 'variant is required' }, { status: 400 });
    }

    // Fetch all pages
    const pages = await prisma.page.findMany();
    let updatedCount = 0;

    for (const page of pages) {
      // Skip homepage
      if (page.slug === 'home') {
        continue;
      }

      let sections: any[] = [];
      if (typeof page.sections === 'string') {
        sections = JSON.parse(page.sections);
      } else if (Array.isArray(page.sections)) {
        sections = page.sections as any[];
      }

      let updated = false;

      const newSections = sections.map((section) => {
        if (section.type === 'hero') {
          updated = true;
          return {
            ...section,
            data: {
              ...section.data,
              variant,
              subpageHeight: subpageHeight || 'medium',
              subpageAlign: subpageAlign || 'left',
              lightBgStyle: lightBgStyle || 'grid-dots',
              lightGradientPos: lightGradientPos || 'none',
              isSubpage: true,
            },
          };
        }
        return section;
      });

      if (updated) {
        await prisma.page.update({
          where: { id: page.id },
          data: {
            sections: newSections,
          },
        });
        updatedCount++;
      }
    }

    return NextResponse.json({ message: `Successfully synced layout settings to ${updatedCount} subpages.` });
  } catch (error) {
    console.error('POST /api/pages/sync-hero error:', error);
    return NextResponse.json({ error: 'Failed to sync layout settings to subpages' }, { status: 500 });
  }
}
