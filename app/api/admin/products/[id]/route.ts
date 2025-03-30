import { NextResponse } from 'next/server';
import { prisma } from '@/prisma/prisma-client';
import { adminMiddleware } from '../../middleware';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Check authentication
  const middlewareResponse = await adminMiddleware();
  if (middlewareResponse) return middlewareResponse;

  try {
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    // Get product with all related data
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        items: true,
        ingredients: true
      }
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('[ADMIN_PRODUCT_GET]', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Check authentication
  const middlewareResponse = await adminMiddleware();
  if (middlewareResponse) return middlewareResponse;

  try {
    // Get id from params
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, imageUrl, categoryId, items, ingredients, isPizza } = body;

    // Validate basic fields
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

    // Check if the category exists
    const categoryExists = await prisma.category.findUnique({
      where: { id: categoryId }
    });

    if (!categoryExists) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 400 }
      );
    }

    // Get current product for checking
    const existingProduct = await prisma.product.findUnique({
      where: { id },
      include: {
        items: true,
        ingredients: true
      }
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Start transaction for updating product and related data
    const updatedProduct = await prisma.$transaction(async (tx) => {
      // Update basic product information
      await tx.product.update({
        where: { id },
        data: {
          name: name.trim(),
          imageUrl: imageUrl.trim(),
          categoryId
        }
      });

      // If this is a regular product (not pizza)
      if (!isPizza) {
        // Check that only one ProductItem element is passed
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

        // Update or create ProductItem
        if (item.id) {
          await tx.productItem.update({
            where: { id: item.id },
            data: {
              price: item.price
            }
          });
        } else {
          // If there is no existing element, create a new one
          await tx.productItem.create({
            data: {
              price: item.price,
              productId: id
            }
          });
        }

        // Delete all ingredients if they were
        await tx.product.update({
          where: { id },
          data: {
            ingredients: {
              set: []
            }
          }
        });
      } else {
        // If this is pizza
        // Check that the elements ProductItem are passed
        if (!items || !Array.isArray(items) || items.length === 0) {
          throw new Error('Pizza must have at least one item');
        }

        // Get existing ProductItem elements
        const existingItems = await tx.productItem.findMany({
          where: { productId: id }
        });

        // Create a Map for quick search
        const existingItemsMap = new Map(
          existingItems.map(item => [item.id, item])
        );

        // Process each element
        for (const item of items) {
          // Check that the price is valid
          if (typeof item.price !== 'number' || item.price <= 0) {
            throw new Error('Valid price is required for all items');
          }

          if (item.id) {
            // Update existing element
            await tx.productItem.update({
              where: { id: item.id },
              data: {
                price: item.price,
                size: item.size,
                pizzaType: item.pizzaType
              }
            });
            // Delete from Map to track which elements to delete
            existingItemsMap.delete(item.id);
          } else {
            // Create a new element
            await tx.productItem.create({
              data: {
                price: item.price,
                size: item.size,
                pizzaType: item.pizzaType,
                productId: id
              }
            });
          }
        }

        // Delete elements that were not updated
        for (const itemId of existingItemsMap.keys()) {
          await tx.productItem.delete({
            where: { id: itemId }
          });
        }

        // Process ingredients
        if (ingredients && Array.isArray(ingredients)) {
          // Get ID of all ingredients
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

          // Update ingredient relationships
          await tx.product.update({
            where: { id },
            data: {
              ingredients: {
                set: ingredientIds.map(id => ({ id }))
              }
            }
          });
        }
      }

      // Return the updated product with all related data
      return await tx.product.findUnique({
        where: { id },
        include: {
          category: true,
          items: true,
          ingredients: true
        }
      });
    });

    return NextResponse.json(updatedProduct);
  } catch (error: unknown) {
    console.error('[ADMIN_PRODUCT_PUT]', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to update product';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Check authentication
  const middlewareResponse = await adminMiddleware();
  if (middlewareResponse) return middlewareResponse;

  try {
    // Get id from params
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    // Check if the product exists
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            cartItems: {
              take: 1
            }
          }
        }
      }
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Check if the product is used in carts
    const isUsedInCart = product.items.some(item => item.cartItems.length > 0);
    if (isUsedInCart) {
      return NextResponse.json(
        { error: 'Cannot delete product that is in use in carts' },
        { status: 400 }
      );
    }

    // Delete the product and all related data in a transaction
    await prisma.$transaction(async (tx) => {
      // First delete all ProductItem elements
      await tx.productItem.deleteMany({
        where: { productId: id }
      });

      // Delete ingredient relationships
      await tx.product.update({
        where: { id },
        data: {
          ingredients: {
            set: []
          }
        }
      });

      // Finally, delete the product
      await tx.product.delete({
        where: { id }
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[ADMIN_PRODUCT_DELETE]', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
