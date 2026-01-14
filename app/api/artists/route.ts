import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(request: NextRequest) {
  if (!API_URL) {
    return NextResponse.json({ message: 'NEXT_PUBLIC_API_URL is not set' }, { status: 500 });
  }

  const accessToken = request.cookies.get('accessToken')?.value;
  const isAuth = !!accessToken;

  const name = request.nextUrl.searchParams.get('name')?.trim();

  const endpoint = isAuth ? '/artists' : '/artists/static/';
  const url = name
    ? `${API_URL}${endpoint}?name=${encodeURIComponent(name)}`
    : `${API_URL}${endpoint}`;

  const backendRes = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    cache: 'no-store',
  });

  const data = await backendRes.json().catch(() => null);
  return NextResponse.json(data, { status: backendRes.status });
}

export async function POST(request: NextRequest) {
  if (!API_URL) {
    return NextResponse.json({ message: 'NEXT_PUBLIC_API_URL is not set' }, { status: 500 });
  }

  const accessToken = request.cookies.get('accessToken')?.value;
  if (!accessToken) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const formData = await request.formData();

  const backendRes = await fetch(`${API_URL}/artists`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: formData,
  });

  const data = await backendRes.json();
  return NextResponse.json(data, { status: backendRes.status });
}
