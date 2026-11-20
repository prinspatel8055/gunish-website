import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

import { JWT_SECRET } from '@/lib/config';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

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

      if (username !== adminUsername) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      }

      const passwordMatch =
        adminPassword.startsWith('$2')
          ? await bcrypt.compare(password, adminPassword)
          : password === adminPassword;

      if (!passwordMatch) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      }

      // Automatically seed the first SUPER_ADMIN user
      const hashedPassword = await bcrypt.hash(password, 10);
      user = await prisma.user.create({
        data: {
          username: username,
          passwordHash: hashedPassword,
          name: 'Super Admin',
          role: 'SUPER_ADMIN',
          isActive: true,
        },
      });
    } else {
      // Normal flow: check against database
      user = await prisma.user.findUnique({
        where: { username },
      });

      if (!user || !user.isActive) {
        return NextResponse.json({ error: 'Invalid credentials or inactive account' }, { status: 401 });
      }

      const passwordMatch = await bcrypt.compare(password, user.passwordHash);

      if (!passwordMatch) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
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

    // Set secure httpOnly cookie (only secure if accessed via HTTPS)
    const isHttps = request.url.startsWith('https://');
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
