import { NextResponse } from 'next/server';

export const successResponse = (message: string, data: any = null, status = 200) => {
  const payload: any = {
    success: true,
    message,
    data,
  };
  if (data && typeof data === 'object' && data.url) {
    payload.url = data.url;
  }
  return NextResponse.json(payload, { status });
};

export const errorResponse = (message: string, status = 500, error: any = null) => {
  return NextResponse.json(
    {
      success: false,
      message,
      error,
    },
    { status }
  );
};
