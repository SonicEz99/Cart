import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();

    // ตรวจสอบว่าใส่ข้อมูลครบหรือไม่
    if (!name || !email || !password) {
      return new Response(JSON.stringify({ error: "กรุณาใส่ข้อมูลให้ครบ!" }), { status: 400 });
    }

    // ตรวจสอบว่าอีเมลซ้ำหรือไม่
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return new Response(JSON.stringify({ error: "อีเมลนี้มีการใช้งานแล้ว" }), { status: 400 });
    }

    // เข้ารหัสรหัสผ่าน
    const hashedPassword = await bcrypt.hash(password, 10);

    // สร้างผู้ใช้ใหม่
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // ส่ง response กลับไป
    return new Response(JSON.stringify({ message: "สมัครสำเร็จ", user }), { status: 201 });
  } catch (error) {
    console.error("Signup error: ", error);
    return new Response(JSON.stringify({ error: "เกิดข้อผิดพลาดในการสมัคร" }), { status: 500 });
  }
}
