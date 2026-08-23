// src/lib/auth.ts
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

const JWT_SECRET_KEY = process.env.JWT_SECRET || 'marifer-ecommerce-secure-jwt-secret-key-2026';
const key = new TextEncoder().encode(JWT_SECRET_KEY);

export type UserSession = {
  id: string;
  email: string;
  name?: string | null;
  role: 'USER' | 'ADMIN';
};

export async function signSessionToken(payload: UserSession): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(key);
}

export async function verifySessionToken(token: string): Promise<UserSession | null> {
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ['HS256'],
    });
    return payload as unknown as UserSession;
  } catch {
    return null;
  }
}

export async function getSessionFromCookies(): Promise<UserSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('marifer_session')?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function getSessionFromRequest(req: NextRequest): Promise<UserSession | null> {
  const token = req.cookies.get('marifer_session')?.value;
  if (!token) return null;
  return verifySessionToken(token);
}
