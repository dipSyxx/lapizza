import { NextResponse } from 'next/server';
import { prisma } from '@/prisma/prisma-client';
import { adminMiddleware } from '../middleware';

export async function GET() {
  // Проверка авторизации
  const middlewareResponse = await adminMiddleware();
  if (middlewareResponse) return middlewareResponse;

  try {
    const ingredients = await prisma.ingredient.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(ingredients);
  } catch (error) {
    console.error('[ADMIN_INGREDIENTS_GET]', error);
    return NextResponse.json(
      { error: 'Failed to fetch ingredients' },
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
    const { name, price, imageUrl } = body;

    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json(
        { error: 'Ingredient name is required' },
        { status: 400 }
      );
    }

    if (price === undefined || typeof price !== 'number' || price < 0) {
      return NextResponse.json(
        { error: 'Valid price is required' },
        { status: 400 }
      );
    }

    if (!imageUrl || typeof imageUrl !== 'string' || imageUrl.trim() === '') {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      );
    }

    // Проверка на существование ингредиента с таким именем
    const existingIngredient = await prisma.ingredient.findFirst({
      where: {
        name: name.trim()
      }
    });

    if (existingIngredient) {
      return NextResponse.json(
        { error: 'Ingredient with this name already exists' },
        { status: 400 }
      );
    }

    const newIngredient = await prisma.ingredient.create({
      data: {
        name: name.trim(),
        price,
        imageUrl: imageUrl.trim()
      }
    });

    return NextResponse.json(newIngredient, { status: 201 });
  } catch (error) {
    console.error('[ADMIN_INGREDIENTS_POST]', error);
    return NextResponse.json(
      { error: 'Failed to create ingredient' },
      { status: 500 }
    );
  }
}
