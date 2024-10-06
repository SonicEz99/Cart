import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// GET: ดึงข้อมูลสินค้าทั้งหมด
export async function GET() {
  try {
    const products = await prisma.product.findMany();
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error); // เพิ่มการ log ข้อผิดพลาด
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

// POST: เพิ่มสินค้าใหม่
export async function POST(req) {
  const { name, description, price, quantity, imageUrl } = await req.json();

  try {
    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price,
        imageUrl,
      },
    });
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('Error adding product:', error); // เพิ่มการ log ข้อผิดพลาด
    return NextResponse.json({ error: 'Failed to add product' }, { status: 500 });
  }
}
