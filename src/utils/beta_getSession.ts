import type { Session } from 'next-auth'
import { env } from 'src/env/server.mjs';
import { headers } from 'next/headers'

export default async function getSession(): Promise<Session> {
  const cookieTwo = headers().get('cookie') ?? '';
  const response = await fetch(`${env.NEXTAUTH_URL}/api/auth/session`, {
    headers: {
      cookieTwo,
    },
    cache: 'no-store',
  });

  const session = await response.json();

  return Object.keys(session).length > 0 ? session : null;
}