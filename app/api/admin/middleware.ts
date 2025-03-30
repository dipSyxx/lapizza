import { NextResponse } from 'next/server';
import { getUserSession } from '@/lib/get-user-session';

export async function adminMiddleware() {
  const session = await getUserSession();

  if (!session || session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return null;
}
