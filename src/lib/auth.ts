import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export interface AdminPayload {
  adminId: string;
  role: string;
}

export async function verifyAdmin(request?: NextRequest): Promise<{ authorized: boolean; payload?: AdminPayload; errorResponse?: NextResponse }> {
  try {
    let token: string | undefined;

    if (request) {
      token = request.cookies.get('admin_token')?.value;
    } else {
      const cookieStore = await cookies();
      token = cookieStore.get('admin_token')?.value;
    }

    if (!token) {
      return {
        authorized: false,
        errorResponse: NextResponse.json(
          { success: false, message: 'Authentication token missing.' },
          { status: 401 }
        ),
      };
    }

    const secret = process.env.JWT_SECRET || 'fabfit_admin_secret_key_15days';
    const decoded = jwt.verify(token, secret) as AdminPayload;

    if (!decoded.adminId || decoded.role !== 'ADMIN') {
      return {
        authorized: false,
        errorResponse: NextResponse.json(
          { success: false, message: 'Invalid token payload.' },
          { status: 401 }
        ),
      };
    }

    return { authorized: true, payload: decoded };
  } catch (error) {
    return {
      authorized: false,
      errorResponse: NextResponse.json(
        { success: false, message: 'Token expired or invalid.' },
        { status: 401 }
      ),
    };
  }
}
