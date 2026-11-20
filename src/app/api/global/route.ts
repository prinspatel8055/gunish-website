import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { requirePermission } from '@/lib/auth';
import { logAction } from '@/lib/audit';

export const dynamic = 'force-dynamic';

// GET /api/global - Get header and footer settings
export async function GET() {
  try {
    const [headerSetting, footerSetting] = await Promise.all([
      prisma.setting.findUnique({ where: { key: 'global_header' } }),
      prisma.setting.findUnique({ where: { key: 'global_footer' } }),
    ]);

    const defaultHeader = {
      siteName: 'GUNICSH',
      subheading: 'Faculty of Social Sciences & Humanities — Ganpat University',
      logoUrl: '/uploads/LOGO-1.png',
      logoSize: 'md',
      navLinks: [],
      ctaLabel: 'Register Now',
      ctaUrl: '/registration-fess',
    };

    const defaultFooter = {
      tagline: '',
      copyright: '',
      logoUrl: '',
      logoSize: 'md',
      columns: [],
      socials: [],
    };

    const safeParse = (value: string | undefined, defaultVal: any) => {
      if (!value) return defaultVal;
      try {
        return JSON.parse(value);
      } catch (e) {
        return defaultVal;
      }
    };

    return NextResponse.json({
      header: safeParse(headerSetting?.value, defaultHeader),
      footer: safeParse(footerSetting?.value, defaultFooter),
      lastUpdatedHeader: headerSetting?.updatedAt?.toISOString() || null,
      lastUpdatedFooter: footerSetting?.updatedAt?.toISOString() || null,
    }, {
      headers: {
        'Cache-Control': 'no-store, max-age=0, must-revalidate',
      },
    });
  } catch (error) {
    console.error('GET /api/global error:', error);
    return NextResponse.json({ error: 'Failed to fetch global settings' }, { status: 500 });
  }
}

// PUT /api/global - Update header and/or footer settings with concurrency check and zero-trust auth
export async function PUT(request: Request) {
  const { user, errorResponse } = await requirePermission(request, 'manage_global');
  if (errorResponse) return errorResponse;

  try {
    const body = await request.json();
    const { header, footer, lastUpdatedHeader, lastUpdatedFooter } = body;

    // Check concurrency conflicts for Header
    if (header !== undefined && lastUpdatedHeader) {
      const existingHeader = await prisma.setting.findUnique({
        where: { key: 'global_header' },
        select: { updatedAt: true },
      });
      if (existingHeader) {
        const dbTime = new Date(existingHeader.updatedAt).getTime();
        const clientTime = new Date(lastUpdatedHeader).getTime();
        if (dbTime > clientTime) {
          return NextResponse.json(
            { error: 'Header settings have been updated by another user. Save cancelled to prevent overwrite. Please reload and try again.' },
            { status: 409 }
          );
        }
      }
    }

    // Check concurrency conflicts for Footer
    if (footer !== undefined && lastUpdatedFooter) {
      const existingFooter = await prisma.setting.findUnique({
        where: { key: 'global_footer' },
        select: { updatedAt: true },
      });
      if (existingFooter) {
        const dbTime = new Date(existingFooter.updatedAt).getTime();
        const clientTime = new Date(lastUpdatedFooter).getTime();
        if (dbTime > clientTime) {
          return NextResponse.json(
            { error: 'Footer settings have been updated by another user. Save cancelled to prevent overwrite. Please reload and try again.' },
            { status: 409 }
          );
        }
      }
    }

    const updates = [];

    if (header !== undefined) {
      updates.push(
        prisma.setting.upsert({
          where: { key: 'global_header' },
          update: { value: JSON.stringify(header) },
          create: { key: 'global_header', value: JSON.stringify(header) },
        })
      );
    }

    if (footer !== undefined) {
      updates.push(
        prisma.setting.upsert({
          where: { key: 'global_footer' },
          update: { value: JSON.stringify(footer) },
          create: { key: 'global_footer', value: JSON.stringify(footer) },
        })
      );
    }

    await Promise.all(updates);
    revalidatePath('/', 'layout');

    await logAction(request, {
      action: 'UPDATE',
      entity: 'GlobalSettings',
      entityId: header !== undefined ? 'global_header' : 'global_footer',
      details: {
        headerUpdated: header !== undefined,
        footerUpdated: footer !== undefined,
        siteName: header?.siteName,
      },
      user,
    });

    // Fetch new timestamps
    const [newHeader, newFooter] = await Promise.all([
      prisma.setting.findUnique({ where: { key: 'global_header' }, select: { updatedAt: true } }),
      prisma.setting.findUnique({ where: { key: 'global_footer' }, select: { updatedAt: true } }),
    ]);

    return NextResponse.json({
      success: true,
      lastUpdatedHeader: newHeader?.updatedAt?.toISOString() || null,
      lastUpdatedFooter: newFooter?.updatedAt?.toISOString() || null,
    });
  } catch (error) {
    console.error('PUT /api/global error:', error);
    return NextResponse.json({ error: 'Failed to update global settings' }, { status: 500 });
  }
}
