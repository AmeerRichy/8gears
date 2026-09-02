import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import AdminUser from '@/models/AdminUser';
import { requireAdminApi } from '@/lib/adminAuth';
import { cleanAllowedPages } from '@/lib/adminPermissions';

function normalizeEmail(value: unknown) {
  return String(value || '').trim().toLowerCase();
}

function normalizeUsername(value: unknown) {
  return String(value || '').trim().toLowerCase().replace(/[^a-z0-9._-]/g, '');
}

export async function GET() {
  try {
    const auth = await requireAdminApi('/admin/users', true);
    if ('error' in auth) return auth.error;

    const users = await AdminUser.find({})
      .select('name email username role customRoleName allowedPages isActive lastLoginAt createdAt updatedAt')
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json({ users });
  } catch (error: unknown) {
    console.error('Failed to load admin users:', error);
    return NextResponse.json({ error: 'Failed to load users' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const auth = await requireAdminApi('/admin/users', true);
    if ('error' in auth) return auth.error;

    const body = await req.json();
    const name = String(body.name || '').trim();
    const email = normalizeEmail(body.email);
    const username = normalizeUsername(body.username);
    const password = String(body.password || '');
    const role = body.role === 'super_admin' ? 'super_admin' : 'user';
    const customRoleName = role === 'user' ? String(body.customRoleName || '').trim() : '';
    const allowedPages = role === 'super_admin' ? [] : cleanAllowedPages(body.allowedPages);

    if (!name || !email || !email.includes('@') || !username) {
      return NextResponse.json({ error: 'Name, valid email, and username are required' }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }
    if (role === 'user' && !customRoleName) {
      return NextResponse.json({ error: 'Role name is required for limited users' }, { status: 400 });
    }
    if (await AdminUser.exists({ $or: [{ email }, { username }] })) {
      return NextResponse.json({ error: 'Email or username is already in use' }, { status: 409 });
    }

    const user = await AdminUser.create({
      name,
      email,
      username,
      passwordHash: await bcrypt.hash(password, 12),
      role,
      customRoleName,
      allowedPages,
      isActive: body.isActive !== false,
    });

    const safe = user.toObject();
    delete safe.passwordHash;
    return NextResponse.json({ user: safe }, { status: 201 });
  } catch (error: unknown) {
    console.error('Failed to create admin user:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}
