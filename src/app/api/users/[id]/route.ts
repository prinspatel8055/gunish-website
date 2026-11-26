import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { getAuthUser } from '@/lib/auth';

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const { user: caller } = await getAuthUser(request);

    if (!caller || (caller.role !== 'SUPER_ADMIN' && caller.role !== 'ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized: Admin privileges required' }, { status: 403 });
    }

    const targetUser = await prisma.user.findUnique({ where: { id: params.id } });
    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Protection: Only SUPER_ADMIN can modify another SUPER_ADMIN
    if (targetUser.role === 'SUPER_ADMIN' && caller.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Only SUPER_ADMIN can modify a SUPER_ADMIN account' }, { status: 403 });
    }

    const data = await request.json();
    const { username, password, name, role: newRole, isActive } = data;

    // Self-lockout prevention: Cannot deactivate or demote your own account
    if (caller.id === targetUser.id) {
      if (isActive === false) {
        return NextResponse.json({ error: 'You cannot deactivate your own account' }, { status: 400 });
      }
      if (newRole && newRole !== targetUser.role) {
        return NextResponse.json({ error: 'You cannot change your own role' }, { status: 400 });
      }
    }

    // Privilege escalation prevention
    if (newRole === 'SUPER_ADMIN' && caller.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Only SUPER_ADMIN can assign the SUPER_ADMIN role' }, { status: 403 });
    }

    const updateData: any = {};
    if (username && typeof username === 'string') {
      const cleanUsername = username.trim().toLowerCase();
      if (!/^[a-zA-Z0-9._-]{3,50}$/.test(cleanUsername)) {
        return NextResponse.json({ error: 'Invalid username format' }, { status: 400 });
      }
      updateData.username = cleanUsername;
    }

    if (name !== undefined) updateData.name = (name || '').slice(0, 100);
    if (newRole !== undefined) updateData.role = newRole;
    if (isActive !== undefined) updateData.isActive = Boolean(isActive);

    if (password) {
      if (typeof password !== 'string' || password.length < 8) {
        return NextResponse.json({ error: 'Password must be at least 8 characters long' }, { status: 400 });
      }
      updateData.passwordHash = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: updateData,
      select: {
        id: true,
        username: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('PUT /api/users/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const { user: caller } = await getAuthUser(request);

    if (!caller || caller.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Only SUPER_ADMIN can delete users' }, { status: 403 });
    }

    if (caller.id === params.id) {
      return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 });
    }

    const targetUser = await prisma.user.findUnique({ where: { id: params.id } });
    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (targetUser.role === 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Cannot delete a SUPER_ADMIN account' }, { status: 403 });
    }

    await prisma.user.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/users/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
