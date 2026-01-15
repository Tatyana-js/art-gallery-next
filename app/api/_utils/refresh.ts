import type { AuthTokens } from '@/types/types';
import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge,
    path: '/',
  } as const;
}

export function setAuthCookies(res: NextResponse, tokens: AuthTokens) {
  res.cookies.set({
    name: 'accessToken',
    value: tokens.accessToken,
    ...cookieOptions(60 * 15),
  });
  if (tokens.refreshToken) {
    res.cookies.set({
      name: 'refreshToken',
      value: tokens.refreshToken,
      ...cookieOptions(60 * 60 * 24 * 7),
    });
  }
}

export async function refreshFromCookies(request: NextRequest): Promise<AuthTokens | null> {
  if (!API_URL) return null;
  const refreshToken = request.cookies.get('refreshToken')?.value;
  if (!refreshToken) return null;
  const fingerprint = request.cookies.get('fingerprint')?.value;
  if (!fingerprint) return null;

  const resp = await fetch(`${API_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Fingerprint': fingerprint },
    body: JSON.stringify({ refreshToken, fingerprint }),
    cache: 'no-store',
  });
  if (!resp.ok) return null;
  const data = (await resp.json().catch(() => null)) as unknown;
  if (!data || typeof data !== 'object') return null;
  if (!('accessToken' in data) || !('refreshToken' in data)) return null;
  const accessToken = (data as { accessToken?: unknown }).accessToken;
  const newRefreshToken = (data as { refreshToken?: unknown }).refreshToken;
  if (typeof accessToken !== 'string' || typeof newRefreshToken !== 'string') return null;
  return { accessToken, refreshToken: newRefreshToken };
}
