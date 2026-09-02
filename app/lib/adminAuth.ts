import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/app/lib/auth';
import connectDB from '@/lib/db/mongodb';
import AdminUser from '@/models/AdminUser';
import { canAccessAdminPage } from '@/lib/adminPermissions';

export async function requireAdminApi(page: string | string[], superAdminOnly = false) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }

  await connectDB();
  const user = await AdminUser.findById(session.user.id)
    .select('name email username role allowedPages isActive')
    .lean();

  if (!user || user.isActive === false) {
    return { error: NextResponse.json({ error: 'Account disabled or unavailable' }, { status: 403 }) };
  }

  if (
    (superAdminOnly && user.role !== 'super_admin') ||
    !(Array.isArray(page) ? page : [page]).some((candidate) =>
      canAccessAdminPage(user.role, user.allowedPages, candidate)
    )
  ) {
    return { error: NextResponse.json({ error: 'You do not have permission to access this page' }, { status: 403 }) };
  }

  return { user };
}
