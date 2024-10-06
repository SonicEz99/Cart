import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// GET: ดึงข้อมูลสินค้าตาม ID
export async function GET(req) {
  const { pathname } = new URL(req.url);
  const id = pathname.split('/').pop();

  try {
    const product = await prisma.product.findUnique({
      where: { id: id },
    });
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error); // เพิ่มการ log ข้อผิดพลาด
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

// PUT: อัปเดตข้อมูลสินค้า
export async function PUT(req) {
  const { pathname } = new URL(req.url);
  const id = pathname.split('/').pop();
  const { name, description, price, quantity, imageUrl } = await req.json();

  try {
    const updatedProduct = await prisma.product.update({
      where: { id: id },
      data: {
        name,
        description,
        price,
        quantity,
        imageUrl,
      },
    });
    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error); // เพิ่มการ log ข้อผิดพลาด
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

// DELETE: ลบสินค้า
export async function DELETE(req) {
  const { pathname } = new URL(req.url);
  const id = pathname.split('/').pop();

  try {
    // Attempt to delete the product by ID
    await prisma.product.delete({
      where: { id: id },
    });
    return NextResponse.json({ message: 'Product removed successfully' });
  } catch (error) {
    console.error('Error removing product:', error); // Log error for debugging
    // Return an error response if the deletion fails
    return NextResponse.json({ error: 'Failed to remove product' }, { status: 500 });
  }
}
