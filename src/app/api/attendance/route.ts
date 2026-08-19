import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

// Verify JWT token sent by the mobile app
async function verifyMobileToken(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;

  const token = authHeader.split(" ")[1];
  try {
    // In production, this should ideally be NEXTAUTH_SECRET or a dedicated mobile secret
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET || "default_secret") as any;
    return decoded;
  } catch (e) {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const userPayload = await verifyMobileToken(req);

    if (!userPayload || userPayload.role !== "EMPLOYEE") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { latitude, longitude, type } = await req.json();

    if (!latitude || !longitude || !type) {
      return NextResponse.json({ error: "Missing GPS coordinates or punch type" }, { status: 400 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today

    // Check if an attendance log already exists for today
    let log = await prisma.attendanceLog.findFirst({
      where: {
        userId: userPayload.id,
        date: { gte: today }
      }
    });

    if (type === "CHECK_IN") {
      if (log && log.checkInTime) {
        return NextResponse.json({ error: "Already checked in today" }, { status: 400 });
      }

      if (!log) {
        // Create new log
        log = await prisma.attendanceLog.create({
          data: {
            userId: userPayload.id,
            date: new Date(),
            checkInTime: new Date(),
            checkInLat: parseFloat(latitude),
            checkInLng: parseFloat(longitude),
            status: "PRESENT",
          }
        });
      } else {
        // Update existing empty log (if any existed for leaves, etc.)
        log = await prisma.attendanceLog.update({
          where: { id: log.id },
          data: {
            checkInTime: new Date(),
            checkInLat: parseFloat(latitude),
            checkInLng: parseFloat(longitude),
            status: "PRESENT",
          }
        });
      }
      return NextResponse.json({ message: "Check-in successful", log }, { status: 200 });
    } 
    
    if (type === "CHECK_OUT") {
      if (!log || !log.checkInTime) {
        return NextResponse.json({ error: "Must check in first" }, { status: 400 });
      }
      if (log.checkOutTime) {
        return NextResponse.json({ error: "Already checked out today" }, { status: 400 });
      }

      log = await prisma.attendanceLog.update({
        where: { id: log.id },
        data: {
          checkOutTime: new Date(),
          checkOutLat: parseFloat(latitude),
          checkOutLng: parseFloat(longitude),
        }
      });
      return NextResponse.json({ message: "Check-out successful", log }, { status: 200 });
    }

    return NextResponse.json({ error: "Invalid punch type" }, { status: 400 });

  } catch (error) {
    console.error("Attendance API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
