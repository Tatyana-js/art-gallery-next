import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
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
