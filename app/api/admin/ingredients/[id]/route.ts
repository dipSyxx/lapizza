import { NextResponse } from 'next/server';
import { prisma } from '@/prisma/prisma-client';
import { adminMiddleware } from '../../middleware';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Check authentication
  const middlewareResponse = await adminMiddleware();
  if (middlewareResponse) return middlewareResponse;

  try {
    // Get id from params using await
    const resolvedParams = (await params).id;
    const id = parseInt(resolvedParams);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid ingredient ID' },
        { status: 400 }
      );
    }

    const ingredient = await prisma.ingredient.findUnique({
      where: { id }
    });

    if (!ingredient) {
      return NextResponse.json(
        { error: 'Ingredient not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(ingredient);
  } catch (error) {
    console.error('[ADMIN_INGREDIENT_GET]', error);
    return NextResponse.json(
      { error: 'Failed to fetch ingredient' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Check authentication
  const middlewareResponse = await adminMiddleware();
  if (middlewareResponse) return middlewareResponse;

  try {
    // Get id from params using await
    const resolvedParams = (await params).id;
    const id = parseInt(resolvedParams);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid ingredient ID' },
        { status: 400 }
      );
    }

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

    // Check if an ingredient with this name already exists
    const existingIngredient = await prisma.ingredient.findFirst({
      where: {
        name: name.trim(),
        id: { not: id }
      }
    });

    if (existingIngredient) {
      return NextResponse.json(
        { error: 'Ingredient with this name already exists' },
        { status: 400 }
      );
    }

    const updatedIngredient = await prisma.ingredient.update({
      where: { id },
      data: {
        name: name.trim(),
        price,
        imageUrl: imageUrl.trim()
      }
    });

    return NextResponse.json(updatedIngredient);
  } catch (error) {
    console.error('[ADMIN_INGREDIENT_PUT]', error);
    return NextResponse.json(
      { error: 'Failed to update ingredient' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Check authentication
  const middlewareResponse = await adminMiddleware();
  if (middlewareResponse) return middlewareResponse;

  try {
    // Get id from params using await
    const resolvedParams = (await params).id;
    const id = parseInt(resolvedParams);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid ingredient ID' },
        { status: 400 }
      );
    }

    // Check if the ingredient is used in products
    const ingredient = await prisma.ingredient.findUnique({
      where: { id },
      include: {
        products: {
          take: 1
        }
      }
    });

    if (!ingredient) {
      return NextResponse.json(
        { error: 'Ingredient not found' },
        { status: 404 }
      );
    }

    if (ingredient.products.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete ingredient that is used in products. Remove it from all products first.' },
        { status: 400 }
      );
    }

    await prisma.ingredient.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[ADMIN_INGREDIENT_DELETE]', error);
    return NextResponse.json(
      { error: 'Failed to delete ingredient' },
      { status: 500 }
    );
  }
}