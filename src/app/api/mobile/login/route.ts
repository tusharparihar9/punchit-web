import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Missing email or password" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user || user.role !== "EMPLOYEE") {
      return NextResponse.json({ error: "Invalid credentials or not an employee account" }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Generate JWT Token for Mobile Session
    const secret = process.env.NEXTAUTH_SECRET || "default_secret";
    const token = jwt.sign(
      { id: user.id, role: user.role, companyId: user.companyId },
      secret,
      { expiresIn: "30d" } // Mobile sessions usually last longer
    );

    return NextResponse.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        companyId: user.companyId,
      }
    }, { status: 200 });

  } catch (error) {
    console.error("Mobile Login Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
