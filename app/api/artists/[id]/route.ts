import { NextRequest, NextResponse } from 'next/server';
import { refreshFromCookies, setAuthCookies } from '../../_utils/refresh';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  if (!API_URL) {
    return NextResponse.json({ message: 'NEXT_PUBLIC_API_URL is not set' }, { status: 500 });
  }

  const accessToken = request.cookies.get('accessToken')?.value;
  const isAuth = !!accessToken;

  const { id } = await ctx.params;
  const endpoint = isAuth ? `/artists/${id}` : `/artists/static/${id}`;

  const doFetch = async (token?: string) =>
    await fetch(`${API_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      cache: 'no-store',
    });

  let backendRes = await doFetch(accessToken);

  if (backendRes.status === 401 && isAuth) {
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

export async function PUT(request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  if (!API_URL) {
    return NextResponse.json({ message: 'NEXT_PUBLIC_API_URL is not set' }, { status: 500 });
  }

  const accessToken = request.cookies.get('accessToken')?.value;
  if (!accessToken) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await ctx.params;
  const formData = await request.formData();

  const doFetch = async (token: string) =>
    await fetch(`${API_URL}/artists/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

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

export async function DELETE(request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  if (!API_URL) {
    return NextResponse.json({ message: 'NEXT_PUBLIC_API_URL is not set' }, { status: 500 });
  }

  const accessToken = request.cookies.get('accessToken')?.value;
  if (!accessToken) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await ctx.params;

  const doFetch = async (token: string) =>
    await fetch(`${API_URL}/artists/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

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
