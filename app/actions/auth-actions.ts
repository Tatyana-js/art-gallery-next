'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('accessToken');
  cookieStore.delete('refreshToken');
  redirect('/login');
}

export async function loginAction(username: string, password: string) {
  const cookieStore = await cookies();
  
  const response = await fetch(`${process.env.API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  const data = await response.json();

  // Устанавливаем БЕЗОПАСНЫЕ куки
  cookieStore.set({
    name: 'accessToken',
    value: data.accessToken,
    httpOnly: true, // ← защита от XSS
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

  redirect('/');
}

export async function registrationAction(username: string, password: string) {
  const cookieStore = await cookies();
  
  try {
    if (!username || !password) {
      throw new Error('Username and password are required');
    }

    const response = await fetch(`${process.env.API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
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

    redirect('/');
    
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}
