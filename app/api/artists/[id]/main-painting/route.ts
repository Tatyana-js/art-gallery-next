import { NextRequest, NextResponse } from 'next/server';
import { refreshFromCookies, setAuthCookies } from '@/app/api/_utils/refresh';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  if (!API_URL) {
    return NextResponse.json({ message: 'NEXT_PUBLIC_API_URL is not set' }, { status: 500 });
  }

  const { id } = await ctx.params;

  const doFetch = async (token?: string) => {
    const headers: Record<string, string> = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    return await fetch(`${API_URL}/artists/${id}/main-painting`, {
      method: 'GET',
      headers,
      cache: 'no-store',
    });
  };

  const accessToken = request.cookies.get('accessToken')?.value;
  let backendRes = await doFetch(accessToken);

  if (backendRes.status === 401) {
    const refreshed = await refreshFromCookies(request);
    if (refreshed?.accessToken) {
      backendRes = await doFetch(refreshed.accessToken);
      const data = await backendRes.json().catch(() => null);
      const res = NextResponse.json(data, { status: backendRes.status });
      setAuthCookies(res, refreshed);
      return res;
    }
  }

  const data = await backendRes.json().catch(() => null);
  return NextResponse.json(data, { status: backendRes.status });
}

export async function PATCH(request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  if (!API_URL) {
    return NextResponse.json({ message: 'NEXT_PUBLIC_API_URL is not set' }, { status: 500 });
  }

  const { id } = await ctx.params;

  const body = (await request.json().catch(() => null)) as unknown;
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ message: 'Invalid body' }, { status: 400 });
  }

  const doFetch = async (token: string) =>
    await fetch(`${API_URL}/artists/${id}/main-painting`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

  // For mutation we require a valid access token; if it's missing, try refresh first.
  const accessToken = request.cookies.get('accessToken')?.value;
  const tokenToUse = accessToken ?? (await refreshFromCookies(request))?.accessToken;
  if (!tokenToUse) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  let backendRes = await doFetch(tokenToUse);

  if (backendRes.status === 401) {
    const refreshed = await refreshFromCookies(request);
    if (refreshed?.accessToken) {
      backendRes = await doFetch(refreshed.accessToken);
      const data = await backendRes.json().catch(() => null);
      const res = NextResponse.json(data, { status: backendRes.status });
      setAuthCookies(res, refreshed);
      return res;
    }
  }

  const data = await backendRes.json().catch(() => null);
  return NextResponse.json(data, { status: backendRes.status });
}
