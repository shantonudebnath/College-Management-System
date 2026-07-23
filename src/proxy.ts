import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const NIM_SESSION = 'nim_session';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const protectedPrefixes = ['/admin', '/student', '/teacher/'];
  const isProtected = protectedPrefixes.some(p => pathname.startsWith(p));
  const isLoginPage = pathname === '/login';

  if (!isProtected && !isLoginPage) return NextResponse.next({ request });

  // Parse local session cookie (student / teacher)
  let nimRole: string | null = null;
  const nimRaw = request.cookies.get(NIM_SESSION)?.value;
  if (nimRaw) {
    try {
      nimRole = (JSON.parse(nimRaw) as { role: string }).role;
    } catch { /* ignore */ }
  }

  // Check Supabase session (admin)
  let supabaseUser = null;
  let supabaseResponse = NextResponse.next({ request });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (url && key) {
    const supabase = createServerClient(url, key, {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    });
    const { data: { user } } = await supabase.auth.getUser();
    supabaseUser = user;
  }

  // Already on login page — redirect to dashboard if authenticated
  if (isLoginPage) {
    if (nimRole === 'student') return NextResponse.redirect(new URL('/student/dashboard', request.url));
    if (nimRole === 'teacher') return NextResponse.redirect(new URL('/teacher/dashboard', request.url));
    if (supabaseUser) return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    return NextResponse.next({ request });
  }

  // Protected routes — allow if authenticated with correct role
  if (pathname.startsWith('/student') && nimRole === 'student') return NextResponse.next({ request });
  if (pathname.startsWith('/teacher') && nimRole === 'teacher') return NextResponse.next({ request });
  if (pathname.startsWith('/admin') && supabaseUser) return supabaseResponse;

  // Not authenticated — redirect to login
  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = '/login';
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icon\\.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
