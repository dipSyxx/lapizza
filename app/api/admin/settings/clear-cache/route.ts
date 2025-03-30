import { NextResponse } from 'next/server';
import { adminMiddleware } from '@/app/api/admin/middleware';
import { revalidatePath } from 'next/cache';

export async function POST() {
  // Check authentication
  const middlewareResponse = await adminMiddleware();
  if (middlewareResponse) return middlewareResponse;

  try {
    // Clear cache for all routes
    revalidatePath('/', 'layout');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[ADMIN_CLEAR_CACHE]', error);
    return NextResponse.json(
      { error: 'Failed to clear cache' },
      { status: 500 }
    );
  }
}
