// src/app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { signSessionToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'El correo es requerido' }, { status: 400 });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    const FIXED_ADMIN_EMAIL = 'taller.mcmoto@gmail.com';
    const FIXED_ADMIN_PASS = 'admin123456';

    // Manejo de autenticación fija de Administrador
    if (normalizedEmail === FIXED_ADMIN_EMAIL) {
      if (password !== FIXED_ADMIN_PASS) {
        return NextResponse.json({ error: 'Contraseña de administrador incorrecta.' }, { status: 401 });
      }

      // Asegurar que el usuario admin existe en la base de datos con rol ADMIN
      let adminUser = await prisma.user.findUnique({
        where: { email: FIXED_ADMIN_EMAIL },
      });

      if (!adminUser) {
        adminUser = await prisma.user.create({
          data: {
            email: FIXED_ADMIN_EMAIL,
            name: 'Administrador Marifer',
            role: 'ADMIN',
            password: FIXED_ADMIN_PASS,
          },
        });
      } else if (adminUser.role !== 'ADMIN') {
        adminUser = await prisma.user.update({
          where: { email: FIXED_ADMIN_EMAIL },
          data: { role: 'ADMIN' },
        });
      }

      const token = await signSessionToken({
        id: adminUser.id,
        email: adminUser.email,
        name: adminUser.name,
        role: 'ADMIN',
      });

      const response = NextResponse.json({
        success: true,
        user: {
          id: adminUser.id,
          email: adminUser.email,
          name: adminUser.name,
          role: 'ADMIN',
        },
      });

      response.cookies.set('marifer_session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });

      return response;
    }

    // Buscar usuario normal en base de datos
    let user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return NextResponse.json({ error: 'Credenciales inválidas o usuario no encontrado.' }, { status: 401 });
    }

    // Role del usuario
    const userRole = (user.role as 'USER' | 'ADMIN') || 'USER';

    const token = await signSessionToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: userRole,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: userRole,
      },
    });

    response.cookies.set('marifer_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 días
    });

    return response;
  } catch (error) {
    console.error('Error en /api/auth/login:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
