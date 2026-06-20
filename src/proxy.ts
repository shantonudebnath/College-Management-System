import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const NIM_SESSION = 'nim_session';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const protectedPrefixes = ['/admin', '/student', '/teacher'];
  const isProtected = protectedPrefixes.some(p => pathname.startsWith(p));

  if (!isProtected) return NextResponse.next({ request });

  // Check local session cookie for student/teacher routes
  const nimCookie = request.cookies.get(NIM_SESSION)?.value;
  if (nimCookie) {
    try {
      const { role } = JSON.parse(nimCookie) as { id: string; role: string };
      if (pathname.startsWith('/student') && role === 'student') return NextResponse.next({ request });
      if (pathname.startsWith('/teacher') && role === 'teacher') return NextResponse.next({ request });
      if (pathname.startsWith('/admin') && role === 'admin') return NextResponse.next({ request });
    } catch { /* invalid cookie — fall through to Supabase check */ }
  }

  // Fall back to Supabase session check (used for admin)
  let supabaseResponse = NextResponse.next({ request });
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseAnonKey) {
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
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
    if (user) return supabaseResponse;
  }

  const url = request.nextUrl.clone();
  url.pathname = '/login';
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
