import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const response = NextResponse.json({ success: true, message: 'Logged out' });
  const isHttps = request.url.startsWith('https://');
  response.cookies.set('admin-token', '', {
    httpOnly: true,
    secure: isHttps,
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
  return response;
}
