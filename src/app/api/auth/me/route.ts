import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { user } = await getAuthUser(request);
  if (!user) {
    return NextResponse.json({
      role: 'EDITOR',
      userId: null,
      name: null,
      username: null,
      permissions: [],
    });
  }

  return NextResponse.json({
    role: user.role,
    userId: user.id,
    name: user.name,
    username: user.username,
    permissions: user.permissions,
  });
}
