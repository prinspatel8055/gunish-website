import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logAction } from '@/lib/audit';
import { requirePermission } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const record = await prisma.setting.findUnique({ where: { key: 'people_data' } });
    if (!record) {
      return NextResponse.json({ categories: [], designations: [], people: [] }, {
        headers: { 'Cache-Control': 'no-store, max-age=0, must-revalidate' }
      });
    }
    return NextResponse.json(JSON.parse(record.value), {
      headers: { 'Cache-Control': 'no-store, max-age=0, must-revalidate' }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch people config' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const { user, errorResponse } = await requirePermission(request, 'edit_people');
  if (errorResponse) {
    const fallback = await requirePermission(request, 'create_people');
    if (fallback.errorResponse) return errorResponse;
  }

  try {
    const body = await request.json();
    const { categories, people, designations } = body;

    if (!categories || !people) {
      return NextResponse.json({ error: 'Missing categories or people' }, { status: 400 });
    }

    // Auto-discover and deduplicate designations
    const normalizedDesignations: string[] = [];
    const seen = new Map<string, string>();

    if (Array.isArray(designations)) {
      designations.forEach(d => {
        if (typeof d === 'string' && d.trim()) {
          const formatted = d.trim().replace(/\s+/g, ' ');
          seen.set(formatted.toLowerCase(), formatted);
        }
      });
    }

    if (Array.isArray(people)) {
      people.forEach((p: any) => {
        const rolesToCheck = [p.role, p.designation].filter(Boolean);
        if (p.roles && typeof p.roles === 'object') {
          Object.values(p.roles).forEach(r => {
            if (typeof r === 'string' && r.trim()) rolesToCheck.push(r);
          });
        }
        rolesToCheck.forEach(r => {
          const formatted = String(r).split('\n')[0].trim().replace(/\s+/g, ' ');
          if (formatted) seen.set(formatted.toLowerCase(), formatted);
        });
      });
    }

    normalizedDesignations.push(...Array.from(seen.values()).sort());

    const payload = JSON.stringify({
      categories,
      people,
      designations: normalizedDesignations
    });

    await prisma.setting.upsert({
      where: { key: 'people_data' },
      update: { value: payload },
      create: { key: 'people_data', value: payload }
    });

    revalidatePath('/', 'layout');

    await logAction(request, {
      action: 'UPDATE',
      entity: 'Faculty',
      entityId: 'people_data',
      details: {
        message: 'Updated people registry categories, designations, and members list',
        peopleCount: Array.isArray(people) ? people.length : 0,
      },
      user,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('PUT /api/people error:', error);
    return NextResponse.json({ error: 'Failed to save people config' }, { status: 500 });
  }
}
