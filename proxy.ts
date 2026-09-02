import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { canAccessAdminPage } from '@/lib/adminPermissions';

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname === '/admin/login') return NextResponse.next();

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token || token.isActive === false) {
    return NextResponse.redirect(new URL('/admin/login', req.url));
  }
  if (!canAccessAdminPage(token.role, token.allowedPages, pathname)) {
    return NextResponse.redirect(new URL('/admin', req.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ['/admin/:path*'] };
