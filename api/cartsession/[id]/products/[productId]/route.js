import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// GET: Fetch products in the user's cart
export async function GET(req, { params }) {
    const userId = Number(params.id);
    try {
      const cartItems = await prisma.cartItem.findMany({
        where: { userId: userId },
        include: { product: true }, // Assuming you want to include product details
      });
      return NextResponse.json(cartItems);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      return NextResponse.json({ error: 'Failed to fetch cart items' }, { status: 500 });
    }
  }
  
// DELETE: Remove a product from the cart
export async function DELETE(req, { params }) {
  try {
    const userId = Number(params.id); // Extract userId from the URL
    const productId = Number(params.productId); // Extract productId from the URL

    // Find the cart item to delete
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        userId: userId,
        productId: productId
      }
    });

    // Check if the cart item exists
    if (!cartItem) {
      return NextResponse.json({ error: 'Cart item not found' }, { status: 404 });
    }

    // Delete the cart item
    await prisma.cartItem.delete({
      where: {
        id: cartItem.id // Use the ID of the cart item to delete
      }
    });

    return NextResponse.json({ message: 'Product removed successfully' });
  } catch (error) {
    console.error('Error removing product from cart:', error);
    return NextResponse.json({ error: 'Failed to remove product' }, { status: 500 });
  }
}
