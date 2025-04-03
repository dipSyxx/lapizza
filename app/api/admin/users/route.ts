import { NextResponse } from 'next/server';
import { prisma } from '@/prisma/prisma-client';
import { adminMiddleware } from '../middleware';

export async function GET() {
  // Authorization check
  const middlewareResponse = await adminMiddleware();
  if (middlewareResponse) return middlewareResponse;

  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: 'desc'
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

    return NextResponse.json(users);
  } catch (error) {
    console.error('[ADMIN_USERS_GET]', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  // Authorization check
  const middlewareResponse = await adminMiddleware();
  if (middlewareResponse) return middlewareResponse;

  try {
    const body = await request.json();
    const { id, fullName, email, role } = body;

    if (!id || !fullName || !email || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if another user with the same email already exists (except for the current user)
    const existingUser = await prisma.user.findFirst({
      where: {
        email,
        id: {
          not: parseInt(id)
        }
      }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already in use' },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: parseInt(id)
      },
      data: {
        fullName,
        email,
        role
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        createdAt: true,
        verified: true
      }
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('[ADMIN_USERS_PUT]', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  // Authorization check
  const middlewareResponse = await adminMiddleware();
  if (middlewareResponse) return middlewareResponse;

  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

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
    console.error('[ADMIN_USERS_DELETE]', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}