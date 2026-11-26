import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

import { JWT_SECRET } from '@/lib/config';

// -------------------------------------------------------------
// Rate Limiter (In-Memory sliding window)
// -------------------------------------------------------------
interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();

function cleanExpiredRateLimits() {
  const now = Date.now();
  for (const [key, record] of rateLimitMap.entries()) {
    if (now > record.resetAt) {
      rateLimitMap.delete(key);
    }
  }
}

function checkRateLimit(ip: string, action: string, maxRequests: number, windowMs: number): boolean {
  if (rateLimitMap.size > 5000) {
    cleanExpiredRateLimits();
  }
  const key = `${action}:${ip}`;
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (record.count >= maxRequests) {
    return false;
  }

  record.count += 1;
  return true;
}

// -------------------------------------------------------------
// RBAC Definitions
// -------------------------------------------------------------
const rolePermissions = {
  SUPER_ADMIN: ['*'],
  ADMIN: ['/admin', '/admin/pages', '/admin/media', '/admin/global', '/admin/settings', '/admin/theme', '/admin/users', '/api'],
  EDITOR: ['/admin', '/admin/pages', '/admin/media', '/api/pages', '/api/media', '/api/auth'],
};

// Apply standard security headers to any outgoing response
function applySecurityHeaders(response: NextResponse) {
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  return response;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';

  // 1. Rate Limiting for Login (/api/auth/login) - Max 5 attempts per 60 seconds
  if (pathname === '/api/auth/login' && request.method === 'POST') {
    const isAllowed = checkRateLimit(clientIp, 'login', 5, 60 * 1000);
    if (!isAllowed) {
      const resp = NextResponse.json(
        { error: 'Too many login attempts. Please wait 1 minute before trying again.' },
        { status: 429 }
      );
      resp.headers.set('Retry-After', '60');
      return applySecurityHeaders(resp);
    }
  }

  // 2. Rate Limiting for all other /api routes - Max 120 requests per minute
  if (pathname.startsWith('/api')) {
    const isAllowed = checkRateLimit(clientIp, 'api', 120, 60 * 1000);
    if (!isAllowed) {
      const resp = NextResponse.json(
        { error: 'Too many requests. Please slow down.' },
        { status: 429 }
      );
      resp.headers.set('Retry-After', '60');
      return applySecurityHeaders(resp);
    }
  }

  // Only protect /admin and /api routes
  if (!pathname.startsWith('/admin') && !pathname.startsWith('/api')) {
    const response = NextResponse.next();
    return applySecurityHeaders(response);
  }

  // Exclude public admin routes (login page)
  if (pathname === '/admin/login' || pathname.startsWith('/admin/login/')) {
    return applySecurityHeaders(NextResponse.next());
  }

  // Exclude public auth API routes (login and logout handlers)
  if (pathname === '/api/auth/login' || pathname === '/api/auth/logout') {
    return applySecurityHeaders(NextResponse.next());
  }

  // Check for public GET API endpoints (used by frontend website)
  if (request.method === 'GET' && pathname.startsWith('/api')) {
    const isPublicGet =
      pathname === '/api/settings' ||
      pathname === '/api/global' ||
      pathname === '/api/global/status' ||
      pathname === '/api/pages' ||
      pathname === '/api/people' ||
      (pathname.startsWith('/api/pages/') && !pathname.startsWith('/api/pages/reorder') && !pathname.startsWith('/api/pages/sync-hero'));

    if (isPublicGet) {
      return applySecurityHeaders(NextResponse.next());
    }
  }

  // 3. Authenticate JWT Token for protected admin and api routes
  const token = request.cookies.get('admin-token')?.value;

  if (!token) {
    if (pathname.startsWith('/api')) {
      return applySecurityHeaders(NextResponse.json({ error: 'Unauthorized: Authentication required' }, { status: 401 }));
    }
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/admin/login';
    return applySecurityHeaders(NextResponse.redirect(redirectUrl));
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const userRole = (payload.role as string) || '';

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
        return applySecurityHeaders(NextResponse.json({ error: 'Forbidden: Insufficient privileges' }, { status: 403 }));
      }
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/admin';
      return applySecurityHeaders(NextResponse.redirect(redirectUrl));
    }

    // Security: Strip any incoming client spoofed headers and inject verified identity
    const requestHeaders = new Headers(request.headers);
    requestHeaders.delete('x-user-role');
    requestHeaders.delete('x-user-id');
    requestHeaders.set('x-user-role', userRole);
    if (payload.userId) {
      requestHeaders.set('x-user-id', payload.userId as string);
    }

    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

    return applySecurityHeaders(response);
  } catch {
    // Invalid, expired, or tampered token
    if (pathname.startsWith('/api')) {
      return applySecurityHeaders(NextResponse.json({ error: 'Unauthorized: Session invalid or expired' }, { status: 401 }));
    }
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/admin/login';
    const response = NextResponse.redirect(redirectUrl);
    response.cookies.delete('admin-token');
    return applySecurityHeaders(response);
  }
}

export const config = {
  matcher: ['/admin/:path*', '/api/:path*'],
};
