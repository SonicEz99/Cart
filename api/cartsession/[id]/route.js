import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// GET: Fetch cart items for a specific user
export async function GET(req, { params }) {
  try {
    const userId = Number(params.id);

    const cartItems = await prisma.cartItem.findMany({
      where: {
        userId: userId
      },
      include: {
        product: true
      }
    });
    return NextResponse.json(cartItems);
  } catch (error) {
    console.error('Error fetching CartItem:', error);
    return NextResponse.json({ error: 'Failed to fetch CartItem' }, { status: 500 });
  }
}

// DELETE: Remove a product from the cart
export async function DELETE(req, { params }) {
    try {
      const userId = Number(params.id); // User ID from URL
  
      // Delete all cart items for the given user ID
      const result = await prisma.cartItem.deleteMany({
        where: {
          userId: userId,
        },
      });
  
      if (result.count === 0) {
        return NextResponse.json({ error: 'No cart items found for this user' }, { status: 404 });
      }
  
      return NextResponse.json({ message: 'All cart items removed successfully' });
    } catch (error) {
      console.error('Error removing products from cart:', error);
      return NextResponse.json({ error: 'Failed to remove products' }, { status: 500 });
    }
  }
  

