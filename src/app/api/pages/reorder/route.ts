import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requirePermission } from '@/lib/auth';

export async function PUT(request: Request) {
  const { errorResponse } = await requirePermission(request, 'manage_pages');
  if (errorResponse) return errorResponse;

  try {
    const { order } = await request.json(); // order: [{ id, index }]

    if (!Array.isArray(order)) {
      return NextResponse.json({ error: 'Invalid order format' }, { status: 400 });
    }

    // Perform all updates in a transaction for safety
    await prisma.$transaction(
      order.map((item: { id: string; index: number }) =>
        prisma.page.update({
          where: { id: item.id },
          data: { order: item.index },
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('PUT /api/pages/reorder error:', error);
    return NextResponse.json({ error: 'Failed to reorder pages' }, { status: 500 });
  }
}
