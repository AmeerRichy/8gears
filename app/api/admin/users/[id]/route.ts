import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import AdminUser from '@/models/AdminUser';
import { requireAdminApi } from '@/lib/adminAuth';
import { cleanAllowedPages } from '@/lib/adminPermissions';

type Context = { params: Promise<{ id: string }> };

export async function PUT(req: Request, { params }: Context) {
  try {
    const auth = await requireAdminApi('/admin/users', true);
    if ('error' in auth) return auth.error;
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    const target = await AdminUser.findById(id).select('+passwordHash');
    if (!target) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const body = await req.json();
    const name = String(body.name || '').trim();
    const email = String(body.email || '').trim().toLowerCase();
    const username = String(body.username || '').trim().toLowerCase().replace(/[^a-z0-9._-]/g, '');
    const role = body.role === 'super_admin' ? 'super_admin' : 'user';
    const isActive = body.isActive !== false;
    const password = String(body.password || '');

    if (!name || !email.includes('@') || !username) {
      return NextResponse.json({ error: 'Name, valid email, and username are required' }, { status: 400 });
    }
    if (password && password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }
    const duplicate = await AdminUser.exists({ _id: { $ne: id }, $or: [{ email }, { username }] });
    if (duplicate) return NextResponse.json({ error: 'Email or username is already in use' }, { status: 409 });

    const removingSuperAdmin = target.role === 'super_admin' && (role !== 'super_admin' || !isActive);
    if (removingSuperAdmin && (await AdminUser.countDocuments({ role: 'super_admin', isActive: true })) <= 1) {
      return NextResponse.json({ error: 'The last active super-admin cannot be disabled or downgraded' }, { status: 409 });
    }

    target.name = name;
    target.email = email;
    target.username = username;
    target.role = role;
    target.customRoleName = role === 'user' ? String(body.customRoleName || '').trim() : '';
    target.allowedPages = role === 'super_admin' ? [] : cleanAllowedPages(body.allowedPages);
    target.isActive = isActive;
    if (password) target.passwordHash = await bcrypt.hash(password, 12);
    if (role === 'user' && !target.customRoleName) {
      return NextResponse.json({ error: 'Role name is required for limited users' }, { status: 400 });
    }
    await target.save();

    const safe = target.toObject();
    delete safe.passwordHash;
    return NextResponse.json({ user: safe });
  } catch (error: unknown) {
    console.error('Failed to update admin user:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Context) {
  try {
    const auth = await requireAdminApi('/admin/users', true);
    if ('error' in auth) return auth.error;
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    if (String(auth.user._id) === id) return NextResponse.json({ error: 'You cannot delete your own account' }, { status: 409 });

    const target = await AdminUser.findById(id);
    if (!target) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    if (target.role === 'super_admin') {
      return NextResponse.json({ error: 'Super-admin accounts must be disabled or downgraded before deletion' }, { status: 409 });
    }
    await target.deleteOne();
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('Failed to delete admin user:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
