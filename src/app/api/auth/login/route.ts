import { NextRequest, NextResponse } from 'next/server';
import { loginAdmin } from '@/modules/auth/auth.service';
import { successResponse, errorResponse } from '@/lib/apiResponse';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return errorResponse('Email and password are required.', 400);
    }

    const { token } = await loginAdmin(email, password);

    const response = successResponse('Login successful', { authenticated: true });
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/',
      maxAge: 15 * 24 * 60 * 60, // 15 days in seconds
    });

    return response;
  } catch (error: any) {
    if (error.message === 'Invalid email or password.') {
      return errorResponse(error.message, 401);
    }
    return errorResponse(error.message || 'Server error', 500);
  }
}
