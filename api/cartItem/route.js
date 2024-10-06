import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// GET: ดึงข้อมูลสินค้าทั้งหมด
export async function GET() {
  try {
    const CartItem = await prisma.cartItem.findMany();
    return NextResponse.json(CartItem);
  } catch (error) {
    console.error('Error fetching CartItem:', error); // เพิ่มการ log ข้อผิดพลาด
    return NextResponse.json({ error: 'Failed to fetch CartItem' }, { status: 500 });
  }
}

// POST: เพิ่มสินค้าใหม่
export async function POST(req) {
  const { productId, userId} = await req.json();

  try {
    const newCartItem = await prisma.cartItem.create({
      data: {
        productId,
        userId,
      },
    });
    return NextResponse.json(newCartItem, { status: 201 });
  } catch (error) {
    console.error('Error adding newCartItem:', error); // เพิ่มการ log ข้อผิดพลาด
    return NextResponse.json({ error: 'Failed to add newCartItem' }, { status: 500 });
  }
}