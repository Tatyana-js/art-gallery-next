import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET(request: NextRequest) {
  if (!API_URL) {
    return NextResponse.json({ message: 'NEXT_PUBLIC_API_URL is not set' }, { status: 500 });
  }

  const accessToken = request.cookies.get('accessToken')?.value;
  const backendPath = accessToken ? '/genres' : '/genres/static';

  const backendRes = await fetch(`${API_URL}${backendPath}`, {
    method: 'GET',
    headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
  });

  const data = await backendRes.json();
  return NextResponse.json(data, { status: backendRes.status });
}
