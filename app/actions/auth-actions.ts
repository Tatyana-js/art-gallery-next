'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('accessToken');
  cookieStore.delete('refreshToken');
  redirect('/artists/static');
}

interface RegistrationData {
  username: string;
  password: string;
  fingerprint: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function loginAction({ username, password, fingerprint }: RegistrationData) {
  try {
    const cookieStore = await cookies();

    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password, fingerprint }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: '' }));
      const message = errorData.message;

      throw new Error(message || 'Login failed');
    }

    const data = await response.json();

    cookieStore.set({
      name: 'accessToken',
      value: data.accessToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 15, // 15 минут
      path: '/',
    });

    cookieStore.set({
      name: 'refreshToken',
      value: data.refreshToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 дней
      path: '/',
    });
  } catch (error) {
    throw error;
  }
}

export async function registrationAction({ username, password, fingerprint }: RegistrationData) {
  const cookieStore = await cookies();
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password, fingerprint }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Registration failed');
    }

    const data = await response.json();

    cookieStore.set({
      name: 'accessToken',
      value: data.accessToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 15,
      path: '/',
    });

    cookieStore.set({
      name: 'refreshToken',
      value: data.refreshToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}
