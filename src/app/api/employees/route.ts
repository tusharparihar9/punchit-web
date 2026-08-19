import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "COMPANY_ADMIN" || !session.user.companyId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { firstName, lastName, email, baseSalary, password } = await req.json();

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: "Email already in use" }, { status: 400 });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create Employee
    const employee = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        passwordHash,
        baseSalary: baseSalary ? parseFloat(baseSalary) : null,
        role: "EMPLOYEE",
        companyId: session.user.companyId,
      },
    });

    return NextResponse.json(
      { message: "Employee created successfully", employeeId: employee.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating employee:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
