// proxy.ts

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
// import { parse } from 'cookie';
import { checkServerSession } from './lib/api/serverApi';
import setCookieParser from 'set-cookie-parser'

const privateRoutes = ['/profile', '/notes'];
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
  const parsedCookies = setCookieParser.parse(setCookie)

  const response = isPublicRoute
    ? NextResponse.redirect(new URL('/', request.url))
    : NextResponse.next()

  for (const c of parsedCookies) {
    if (!c.name || !c.value) continue

    if (c.name === 'accessToken' || c.name === 'refreshToken') {
      response.cookies.set({
        name: c.name,
        value: c.value,
        ...(c.path && { path: c.path }),
        ...(c.expires && { expires: c.expires }),
        ...(c.maxAge && { maxAge: c.maxAge }),
      })
    }
  }

  return response
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
		"/sign-in",
		"/sign-up",
	],
}