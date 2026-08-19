import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ActivityMap } from "@/components/dashboard/ActivityMap";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Example: Fetch some stats if they are a company admin
  let employeeCount = 0;
  let recentLogs: any[] = [];
  
  if (session.user.role === "COMPANY_ADMIN" && session.user.companyId) {
    employeeCount = await prisma.user.count({
      where: {
        companyId: session.user.companyId,
        role: "EMPLOYEE"
      }
    });

    // Fetch today's check-ins to map them
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    recentLogs = await prisma.attendanceLog.findMany({
      where: {
        user: { companyId: session.user.companyId },
        date: { gte: today }
      },
      include: {
        user: true
      },
      orderBy: {
        checkInTime: 'desc'
      },
      take: 50 // Limit to recent 50 for the map
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Dashboard Overview
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Total Employees</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{employeeCount}</dd>
        </div>
        
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Present Today</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">0</dd>
        </div>

        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">On Leave</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">0</dd>
        </div>
      </div>
      
      {/* Real-time map */}
      <div className="mt-8 relative z-0">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Live Activity Map</h3>
        <ActivityMap logs={recentLogs} />
      </div>
    </div>
  );
}
