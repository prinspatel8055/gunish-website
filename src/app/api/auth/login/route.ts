import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

import { JWT_SECRET } from '@/lib/config';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // Input validation
    if (!username || typeof username !== 'string' || !password || typeof password !== 'string') {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }

    const cleanUsername = username.trim();
    if (cleanUsername.length > 100 || password.length > 200) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // First check if any users exist in the database
    const userCount = await prisma.user.count();

    let user;

    if (userCount === 0) {
      // Emergency/Seed mode: use .env credentials to create the first user
      const adminUsername = process.env.ADMIN_USERNAME;
      const adminPassword = process.env.ADMIN_PASSWORD;

      if (!adminUsername || !adminPassword) {
        return NextResponse.json(
          { error: 'Admin credentials not configured in .env' },
          { status: 500 }
        );
      }

      if (cleanUsername !== adminUsername) {
        return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
      }

      const passwordMatch =
        adminPassword.startsWith('$2')
          ? await bcrypt.compare(password, adminPassword)
          : password === adminPassword;

      if (!passwordMatch) {
        return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
      }

      // Automatically seed the first SUPER_ADMIN user
      const hashedPassword = await bcrypt.hash(password, 10);
      user = await prisma.user.create({
        data: {
          username: cleanUsername,
          passwordHash: hashedPassword,
          name: 'Super Admin',
          role: 'SUPER_ADMIN',
          isActive: true,
        },
      });
    } else {
      // Normal flow: check against database
      user = await prisma.user.findUnique({
        where: { username: cleanUsername },
      });

      if (!user || !user.isActive) {
        // Uniform error response to prevent account enumeration
        return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
      }

      const passwordMatch = await bcrypt.compare(password, user.passwordHash);

      if (!passwordMatch) {
        return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
      }
    }

    // Sign JWT valid for 8 hours
    const token = await new SignJWT({
      userId: user.id,
      username: user.username,
      role: user.role,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('8h')
      .sign(JWT_SECRET);

    const response = NextResponse.json({ success: true, message: 'Login successful' });

    // Set secure httpOnly cookie (supports reverse proxies like Nginx/Cloudflare)
    const isHttps =
      request.url.startsWith('https://') ||
      request.headers.get('x-forwarded-proto') === 'https' ||
      process.env.NODE_ENV === 'production';

    response.cookies.set('admin-token', token, {
      httpOnly: true,
      secure: isHttps,
      sameSite: 'lax',
      maxAge: 60 * 60 * 8, // 8 hours
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
