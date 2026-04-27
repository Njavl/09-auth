import { NextRequest, NextResponse } from 'next/server';

const PRIVATE_PATHS = ['/notes', '/profile'];
const AUTH_PATHS = ['/sign-in', '/sign-up'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('accessToken')?.value;

  const isPrivate = PRIVATE_PATHS.some(path => pathname.startsWith(path));
  const isAuthPage = AUTH_PATHS.some(path => pathname.startsWith(path));

  if (isPrivate && !accessToken) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  if (isAuthPage && accessToken) {
    return NextResponse.redirect(new URL('/profile', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
};
