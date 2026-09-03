import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { canAccessAdminPage } from '@/lib/adminPermissions';

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname === '/admin/login') return NextResponse.next();

  // NextAuth uses a different cookie name for HTTPS. Do not infer that name
  // again here: behind a production proxy NEXTAUTH_URL can disagree with the
  // protocol NextAuth used when it created the session cookie.
  const cookieNames = req.cookies.getAll().map(({ name }) => name);
  const secureCookieName = '__Secure-next-auth.session-token';
  const standardCookieName = 'next-auth.session-token';
  const sessionCookieName = cookieNames.some((name) =>
    name === secureCookieName || name.startsWith(`${secureCookieName}.`)
  )
    ? secureCookieName
    : standardCookieName;

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    cookieName: sessionCookieName,
  });
  if (!token || token.isActive === false) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = '/admin/login';
    loginUrl.search = '';
    return NextResponse.redirect(loginUrl);
  }
  if (!canAccessAdminPage(token.role, token.allowedPages, pathname)) {
    const adminUrl = req.nextUrl.clone();
    adminUrl.pathname = '/admin';
    adminUrl.search = '';
    return NextResponse.redirect(adminUrl);
  }
  return NextResponse.next();
}

export const config = { matcher: ['/admin/:path*'] };
