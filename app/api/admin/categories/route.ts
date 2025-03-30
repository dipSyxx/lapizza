import { NextResponse } from 'next/server';
import { prisma } from '@/prisma/prisma-client';
import { adminMiddleware } from '../middleware';

export async function GET() {
  // Проверка авторизации
  const middlewareResponse = await adminMiddleware();
  if (middlewareResponse) return middlewareResponse;

  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            products: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error('[ADMIN_CATEGORIES_GET]', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  // Проверка авторизации
  const middlewareResponse = await adminMiddleware();
  if (middlewareResponse) return middlewareResponse;

  try {
    const body = await request.json();
    const { name } = body;

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }

    // Проверка на существование категории с таким именем
    const existingCategory = await prisma.category.findFirst({
      where: {
        name: name.trim()
      }
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: 'Category with this name already exists' },
        { status: 400 }
      );
    }

    const newCategory = await prisma.category.create({
      data: {
        name: name.trim()
      }
    });

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error('[ADMIN_CATEGORIES_POST]', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}
