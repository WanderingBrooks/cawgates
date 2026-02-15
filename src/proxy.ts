import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

const publicPaths = ['/login', '/register'];

const proxy = async (request: NextRequest) => {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('session');

  console.log('[Proxy] Route:', pathname);
  console.log('[Proxy] Has session:', !!sessionCookie);

  // Skip authentication for static assets and Next.js internals
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname === '/favicon.ico' ||
    /\.(ico|png|jpg|jpeg|svg|gif|webp|css|js)$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  // Check if the path is public
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));

  if (isPublicPath) {
    console.log('[Proxy] Public path, allowing access');
    return NextResponse.next();
  }

  // Protected path - check for session
  if (!sessionCookie) {
    console.log('[Proxy] No session, redirecting to /login');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Verify the session token
  try {
    const session = await verifyToken(sessionCookie.value);

    if (!session) {
      console.log('[Proxy] Invalid session, redirecting to /login');
      return NextResponse.redirect(new URL('/login', request.url));
    }

    console.log('[Proxy] Session valid, allowing access');
    return NextResponse.next();
  } catch (error) {
    console.error('[Proxy] Error verifying token:', error);
    return NextResponse.redirect(new URL('/login', request.url));
  }
};

export { proxy };
