import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export async function middleware(request: Request): Promise<NextResponse> {
  try {
    const { pathname } = new URL(request.url);
    const protectedRoutes = ['/dashboard'];
    
    if (protectedRoutes.some((route) => pathname.startsWith(route))) {
      const { data } = await getSession();
      if (!data?.session) {
        return NextResponse.redirect(new URL('/auth/login', request.url));
      }
    }
  
    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.next();
  }
}