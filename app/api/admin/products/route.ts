import { NextResponse } from 'next/server';
import { prisma } from '@/prisma/prisma-client';
import { adminMiddleware } from '../middleware';

export async function GET() {
  // Check admin auth
  const middlewareResponse = await adminMiddleware();
  if (middlewareResponse) return middlewareResponse;

  try {
    const products = await prisma.product.findMany({
      include: {
        category: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('[ADMIN_PRODUCTS_GET]', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  // Check admin auth
  const middlewareResponse = await adminMiddleware();
  if (middlewareResponse) return middlewareResponse;

  try {
    const body = await request.json();
    const { name, imageUrl, categoryId, items, ingredients, isPizza } = body;

    // Validate main fields
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json(
        { error: 'Product name is required' },
        { status: 400 }
      );
    }

    if (!imageUrl || typeof imageUrl !== 'string' || imageUrl.trim() === '') {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      );
    }

    if (!categoryId || typeof categoryId !== 'number') {
      return NextResponse.json(
        { error: 'Valid category ID is required' },
        { status: 400 }
      );
    }

    // Check category existence
    const categoryExists = await prisma.category.findUnique({
      where: { id: categoryId }
    });

    if (!categoryExists) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 400 }
      );
    }

    // Start transaction for creating product and related data
    const newProduct = await prisma.$transaction(async (tx) => {
      // Create main product information
      const product = await tx.product.create({
        data: {
          name: name.trim(),
          imageUrl: imageUrl.trim(),
          categoryId
        }
      });

      // If this is a regular product (not pizza)
      if (!isPizza) {
        // Check that only one element ProductItem is passed
        if (!items || !Array.isArray(items) || items.length !== 1) {
          throw new Error('Regular product must have exactly one item');
        }

        const item = items[0];

        // Check that there are no size or pizzaType fields
        if (item.size !== null || item.pizzaType !== null) {
          throw new Error('Regular product cannot have size or pizzaType');
        }

        // Check that the price is valid
        if (typeof item.price !== 'number' || item.price <= 0) {
          throw new Error('Valid price is required');
        }

        // Create ProductItem
        await tx.productItem.create({
          data: {
            price: item.price,
            productId: product.id
          }
        });
      } else {
        // If this is a pizza
        // Check that the elements ProductItem are passed
        if (!items || !Array.isArray(items) || items.length === 0) {
          throw new Error('Pizza must have at least one item');
        }

        // Process each element
        for (const item of items) {
          // Check that the price is valid
          if (typeof item.price !== 'number' || item.price <= 0) {
            throw new Error('Valid price is required for all items');
          }

          // Create ProductItem
          await tx.productItem.create({
            data: {
              price: item.price,
              size: item.size,
              pizzaType: item.pizzaType,
              productId: product.id
            }
          });
        }

        // Process ingredients
        if (ingredients && Array.isArray(ingredients) && ingredients.length > 0) {
          // Get all ingredient IDs
          const ingredientIds = ingredients.map(ing => ing.id);

          // Check that all ingredients exist
          const existingIngredients = await tx.ingredient.findMany({
            where: {
              id: {
                in: ingredientIds
              }
            }
          });

          if (existingIngredients.length !== ingredientIds.length) {
            throw new Error('Some ingredients do not exist');
          }

          // Update ingredient connections
          await tx.product.update({
            where: { id: product.id },
            data: {
              ingredients: {
                connect: ingredientIds.map(id => ({ id }))
              }
            }
          });
        }
      }

      // Return created product with all related data
      return await tx.product.findUnique({
        where: { id: product.id },
        include: {
          category: true,
          items: true,
          ingredients: true
        }
      });
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error: unknown) {
    console.error('[ADMIN_PRODUCTS_POST]', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create product';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
