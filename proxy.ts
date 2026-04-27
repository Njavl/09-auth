import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { checkSession } from './lib/api/serverApi';

const PRIVATE_PATHS = ['/notes', '/profile'];
const AUTH_PATHS = ['/sign-in', '/sign-up'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  const isPrivate = PRIVATE_PATHS.some(path => pathname.startsWith(path));
  const isAuthPage = AUTH_PATHS.some(path => pathname.startsWith(path));

  if (isPrivate) {
    if (accessToken) {
      return NextResponse.next();
    }
    if (refreshToken) {
      try {
        const response = await checkSession();
        if (response.data.success) {
          const nextResponse = NextResponse.next();
          const setCookie = response.headers['set-cookie'];
          if (setCookie) {
            const cookieArray = Array.isArray(setCookie)
              ? setCookie
              : [setCookie];
            cookieArray.forEach(cookie => {
              nextResponse.headers.append('set-cookie', cookie);
            });
          }
          return nextResponse;
        }
      } catch {
        // session refresh failed — fall through to redirect
      }
    }
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  if (isAuthPage && (accessToken || refreshToken)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};
