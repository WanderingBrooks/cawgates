import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

const publicPaths = ['/login', '/register'];

const proxy = async (request: NextRequest) => {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('session');

  // Check if the path is public
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));

  if (isPublicPath) {
    return NextResponse.next();
  }

  // Protected path - check for session
  if (!sessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Verify the session token
  try {
    const session = await verifyToken(sessionCookie.value);

    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error('[Proxy] Error verifying token:', error);
    return NextResponse.redirect(new URL('/login', request.url));
  }
};

export { proxy };

// eslint-disable-next-line no-restricted-syntax
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
