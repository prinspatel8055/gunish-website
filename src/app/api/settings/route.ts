import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jwtVerify } from 'jose';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';


import { JWT_SECRET } from '@/lib/config';

// Helper to verify admin auth in API routes
async function verifyAdmin(request: Request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const tokenCookie = cookieHeader
    .split(';')
    .find((c) => c.trim().startsWith('admin-token='));
  
  if (!tokenCookie) return false;
  
  const token = tokenCookie.split('=')[1];
  try {
    await jwtVerify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}

// GET /api/settings - Publicly fetch current theme and typography config
export async function GET() {
  try {
    const [themeSetting, fontSetting, appSettingsSetting] = await Promise.all([
      prisma.setting.findUnique({ where: { key: 'theme' } }),
      prisma.setting.findUnique({ where: { key: 'fontPairing' } }),
      prisma.setting.findUnique({ where: { key: 'app_settings' } }),
    ]);

    return NextResponse.json({
      theme: themeSetting?.value || 'theme-ivy-league',
      fontPairing: fontSetting?.value || 'pairing-classic',
      appSettings: appSettingsSetting?.value || null,
    }, {
      headers: {
        'Cache-Control': 'no-store, max-age=0, must-revalidate',
      },
    });
  } catch (error) {
    console.error('GET /api/settings error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

// PUT /api/settings - Update site theme and typography (requires admin auth)
export async function PUT(request: Request) {
  const isAuthorized = await verifyAdmin(request);
  if (!isAuthorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { theme, fontPairing, appSettings } = body;

    const updates = [];

    if (theme !== undefined) {
      updates.push(
        prisma.setting.upsert({
          where: { key: 'theme' },
          update: { value: theme },
          create: { key: 'theme', value: theme },
        })
      );
    }

    if (fontPairing !== undefined) {
      updates.push(
        prisma.setting.upsert({
          where: { key: 'fontPairing' },
          update: { value: fontPairing },
          create: { key: 'fontPairing', value: fontPairing },
        })
      );
    }

    if (appSettings !== undefined) {
      updates.push(
        prisma.setting.upsert({
          where: { key: 'app_settings' },
          update: { value: appSettings },
          create: { key: 'app_settings', value: appSettings },
        })
      );
    }

    await Promise.all(updates);

    revalidatePath('/', 'layout');
    return NextResponse.json({ success: true, message: 'Settings updated successfully' });
  } catch (error) {
    console.error('PUT /api/settings error:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
