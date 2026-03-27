import { NextRequest, NextResponse } from 'next/server';
import { api } from '../../api';
import { cookies } from 'next/headers';
import setCookie from 'set-cookie-parser';
import { isAxiosError } from 'axios';
import { logErrorResponse } from '../../_utils/utils';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const apiRes = await api.post('auth/register', body);

    const cookieStore = await cookies();
    const setCookieHeader = apiRes.headers['set-cookie'];

    if (setCookieHeader) {
      const parsedCookies = setCookie.parse(setCookieHeader, { map: true });

      if (parsedCookies.accessToken) {
        cookieStore.set('accessToken', parsedCookies.accessToken.value, {
          path: '/',
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: parsedCookies.accessToken.maxAge,
          expires: parsedCookies.accessToken.expires,
        });
      }

      if (parsedCookies.refreshToken) {
        cookieStore.set('refreshToken', parsedCookies.refreshToken.value, {
          path: '/',
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: parsedCookies.refreshToken.maxAge,
          expires: parsedCookies.refreshToken.expires,
        });
      }

      return NextResponse.json(apiRes.data, { status: apiRes.status });
    }

    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      return NextResponse.json(
        { error: error.message, response: error.response?.data },
        { status: error.response?.status || 500 }
      );
    }

    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}