// proxy.ts

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { parse } from 'cookie';
import { checkServerSession } from './lib/api/serverApi';

const privateRoutes = ['/profile', '/notes', '/notes/action', '/notes/filter'];
const publicRoutes = ['/sign-in', '/sign-up'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  const isPrivateRoute = privateRoutes.some(route => pathname.startsWith(route));

  if (!accessToken) {
    if (refreshToken) {
      const data = await checkServerSession();
      const setCookie = data.headers['set-cookie'];

      if (setCookie) {
        const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];
        for (const cookieStr of cookieArray) {
          const parsed = parse(cookieStr);
          const options = {
            expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
            path: parsed.Path,
            maxAge: parsed['Max-Age'] !== undefined && !isNaN(Number(parsed['Max-Age']))
            ? Number(parsed['Max-Age'])
            : undefined,
          };
          if (parsed.accessToken != null) { 
            cookieStore.set("accessToken", parsed.accessToken, options);
          }
          if (parsed.refreshToken != null) { 
            cookieStore.set("refreshToken", parsed.refreshToken, options);
          }
        }
        
        if (isPublicRoute) {
          return NextResponse.redirect(new URL('/', request.url), {
            headers: {
              Cookie: cookieStore.toString(),
            },
          });
        }
        
        if (isPrivateRoute) {
          const response = NextResponse.next();
          response.headers.set('Cookie', cookieStore.toString());
          return response;
        }
      }
    }
    
    if (isPublicRoute) {
      return NextResponse.next();
    }

    
    if (isPrivateRoute) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
  }

  
  if (isPublicRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (isPrivateRoute) {
    return NextResponse.next();
  }
}


export const config = {
	matcher: [
		"/profile",
		"/profile/:path*",
		"/notes",
		"/notes/:path*",
		"/notes/action/:action*",
		"/notes/filter/:filter*",
		"/sign-in",
		"/sign-up",
	],
}