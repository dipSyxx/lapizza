import { NextResponse } from 'next/server';
import { prisma } from '@/prisma/prisma-client';
import { adminMiddleware } from '../../middleware';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Authorization check
  const middlewareResponse = await adminMiddleware();
  if (middlewareResponse) return middlewareResponse;

  try {
    // Get id from params using await
    const resolvedParams = await params;
    const id = resolvedParams.id;

    if (!id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(id)
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        createdAt: true,
        verified: true,
        _count: {
          select: {
            Orders: true
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if this is the last admin user in the system
    const isLastAdmin = user.role === 'ADMIN' && await prisma.user.count({
      where: {
        role: 'ADMIN'
      }
    }) <= 1;

    return NextResponse.json({
      ...user,
      _isLastAdmin: isLastAdmin
    });
  } catch (error) {
    console.error('[ADMIN_USER_GET]', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Authorization check
  const middlewareResponse = await adminMiddleware();
  if (middlewareResponse) return middlewareResponse;

  try {
    // Get id from params using await
    const resolvedParams = await params;
    const id = resolvedParams.id;

    if (!id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: {
        id: parseInt(id)
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if the user being deleted isn't the only admin
    if (user.role === 'ADMIN') {
      const adminCount = await prisma.user.count({
        where: {
          role: 'ADMIN'
        }
      });

      if (adminCount <= 1) {
        return NextResponse.json(
          { error: "Cannot delete the only admin user" },
          { status: 400 }
        );
      }
    }

    // Delete user's verification code if exists
    await prisma.verificationCode.deleteMany({
      where: {
        userId: parseInt(id)
      }
    });

    // Delete user's cart if exists
    await prisma.cart.deleteMany({
      where: {
        userId: parseInt(id)
      }
    });

    // Delete user
    await prisma.user.delete({
      where: {
        id: parseInt(id)
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[ADMIN_USER_DELETE]', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}
