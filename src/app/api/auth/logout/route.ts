import { NextRequest } from 'next/server';
import { successResponse } from '@/lib/apiResponse';

export async function POST(request: NextRequest) {
  const response = successResponse('Logout successful', { authenticated: false });
  response.cookies.set('admin_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/',
    maxAge: 0,
  });
  return response;
}
