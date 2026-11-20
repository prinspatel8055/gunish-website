import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { prisma } from './prisma';
import { JWT_SECRET } from './config';

export interface AuthUser {
  id: string;
  username: string;
  name: string;
  role: string;
  permissions: string[];
  clientIp?: string;
  userAgent?: string;
}

export async function getAuthUser(request: Request): Promise<{ user?: AuthUser; error?: string; status?: number }> {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const authHeader = request.headers.get('authorization') || '';
    let token = '';

    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7).trim();
    } else {
      const match = cookieHeader.split(';').find(c => c.trim().startsWith('admin-token='));
      if (match) token = match.split('=')[1]?.trim();
    }

    if (!token) return { error: 'Unauthorized', status: 401 };

    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (!payload.userId) return { error: 'Invalid token payload', status: 401 };

    const dbUser = await prisma.user.findUnique({
      where: { id: payload.userId as string },
      select: { id: true, username: true, name: true, role: true, isActive: true }
    });

    if (!dbUser || !dbUser.isActive) return { error: 'Account inactive or revoked', status: 401 };

    // Resolve dynamic permissions from app_settings
    let permissions: string[] = [];
    if (dbUser.role === 'SUPER_ADMIN') {
      permissions = ['*']; // Full bypass
    } else {
      const appSettingsRecord = await prisma.setting.findUnique({ where: { key: 'app_settings' } });
      if (appSettingsRecord) {
        try {
          const appSettings = JSON.parse(appSettingsRecord.value);
          permissions = appSettings.rolePermissions?.[dbUser.role] || [];
        } catch {
          permissions = [];
        }
      }
      // If no custom role permissions configured, provide sensible defaults based on role
      if (permissions.length === 0) {
        if (dbUser.role === 'ADMIN') {
          permissions = ['manage_global', 'edit_people', 'create_people', 'delete_people', 'manage_pages', 'manage_media', 'manage_theme', 'manage_settings'];
        } else if (dbUser.role === 'EDITOR') {
          permissions = ['manage_global', 'edit_people', 'create_people', 'manage_pages', 'manage_media'];
        }
      }
    }

    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
    const userAgent = request.headers.get('user-agent') || 'Unknown';

    return {
      user: {
        id: dbUser.id,
        username: dbUser.username,
        name: dbUser.name || dbUser.username,
        role: dbUser.role,
        permissions,
        clientIp,
        userAgent
      }
    };
  } catch {
    return { error: 'Session expired', status: 401 };
  }
}

export async function requirePermission(request: Request, permissionKey: string) {
  const authResult = await getAuthUser(request);
  if (!authResult.user) {
    return { errorResponse: NextResponse.json({ error: authResult.error || 'Unauthorized' }, { status: authResult.status || 401 }) };
  }

  const { user } = authResult;
  if (user.role === 'SUPER_ADMIN' || user.permissions.includes('*') || user.permissions.includes(permissionKey)) {
    return { user };
  }

  return {
    errorResponse: NextResponse.json({ error: `Forbidden: Missing '${permissionKey}' permission` }, { status: 403 })
  };
}
