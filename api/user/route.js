import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// GET: ดึงข้อมูลสินค้าทั้งหมด
export async function GET() {
  try {
    const User = await prisma.user.findMany();
    return NextResponse.json(User);
  } catch (error) {
    console.error('Error fetching User:', error); // เพิ่มการ log ข้อผิดพลาด
    return NextResponse.json({ error: 'Failed to fetch User' }, { status: 500 });
  }
}

