import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

import { JWT_SECRET } from '@/lib/config';

// Define which roles can access which paths
const rolePermissions = {
  SUPER_ADMIN: ['*'], // Can access everything
  ADMIN: ['/admin', '/admin/pages', '/admin/media', '/admin/global', '/admin/settings', '/admin/theme', '/admin/users', '/api'],
  EDITOR: ['/admin', '/admin/pages', '/admin/media', '/api/pages', '/api/media', '/api/auth'],
};

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // We only want to protect the /admin and /api routes
  if (!pathname.startsWith('/admin') && !pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Exclude login and logout routes
  if (
    pathname.startsWith('/admin/login') || 
    pathname.startsWith('/api/auth/login') || 
    pathname.startsWith('/api/auth/logout')
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get('admin-token')?.value;

  if (!token) {
    if (pathname.startsWith('/api')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/admin/login';
    return NextResponse.redirect(redirectUrl);
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userRole = payload.role as string;

    // RBAC Check
    let hasAccess = false;

    if (userRole === 'SUPER_ADMIN') {
      hasAccess = true;
    } else if (userRole === 'ADMIN') {
      const allowedPaths = rolePermissions.ADMIN;
      hasAccess = allowedPaths.some(p => pathname === p || pathname.startsWith(p + '/'));
    } else if (userRole === 'EDITOR') {
      const allowedPaths = rolePermissions.EDITOR;
      hasAccess = allowedPaths.some(p => pathname === p || pathname.startsWith(p + '/'));
    }

    if (!hasAccess) {
      if (pathname.startsWith('/api')) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/admin';
      return NextResponse.redirect(redirectUrl);
    }

    // Clone the request headers and set the user role so API routes can use it if needed
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-role', userRole);
    if (payload.userId) {
      requestHeaders.set('x-user-id', payload.userId as string);
    }

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    // Invalid or expired token
    if (pathname.startsWith('/api')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/admin/login';
    const response = NextResponse.redirect(redirectUrl);
    response.cookies.delete('admin-token');
    return response;
  }
}

export const config = {
  matcher: ['/admin/:path*', '/api/:path*'],
};
