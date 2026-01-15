import { NextRequest, NextResponse } from 'next/server';
import { refreshFromCookies, setAuthCookies } from '@/app/api/_utils/refresh';

async function tryRefreshIfNeeded(request: NextRequest): Promise<NextResponse | null> {
  // For page navigations only.
  if (request.method !== 'GET' && request.method !== 'HEAD') return null;

  const accessToken = request.cookies.get('accessToken')?.value;
  if (accessToken) return null;

  const tokens = await refreshFromCookies(request);
  if (!tokens) return null;

  // Redirect back to the same URL so the *next* SSR request sees updated cookies.
  const res = NextResponse.redirect(request.nextUrl);
  setAuthCookies(res, tokens);
  return res;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const refreshed = await tryRefreshIfNeeded(request);
  if (refreshed) return refreshed;

  const accessToken = request.cookies.get('accessToken')?.value;
  const isAuth = !!accessToken;

  if (pathname === '/') {
    return NextResponse.redirect(new URL(isAuth ? '/artists' : '/artists/static', request.url));
  }

  if (pathname === '/artists/static') {
    if (isAuth) {
      return NextResponse.redirect(new URL('/artists', request.url));
    }
    const url = request.nextUrl.clone();
    url.pathname = '/artists';
    const response = NextResponse.rewrite(url);
    response.headers.set('x-is-static', 'true');
    return response;
  }

  if (pathname.startsWith('/artists/static/') && pathname !== '/artists/static') {
    const id = pathname.replace('/artists/static/', '');
    if (isAuth) {
      return NextResponse.redirect(new URL(`/artists/${id}`, request.url));
    }
    const url = request.nextUrl.clone();
    url.pathname = `/artists/${id}`;
    const response = NextResponse.rewrite(url);
    response.headers.set('x-is-static', 'true');
    return response;
  }

  if (pathname === '/artists' && !isAuth) {
    return NextResponse.redirect(new URL('/artists/static', request.url));
  }

  const artistsIdMatch = pathname.match(/^\/artists\/([^/]+)$/);
  if (artistsIdMatch && !isAuth) {
    const id = artistsIdMatch[1];
    return NextResponse.redirect(new URL(`/artists/static/${id}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/artists', '/artists/:path*', '/artists/static', '/artists/static/:path*'],
};
