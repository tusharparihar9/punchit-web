import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Example: Fetch some stats if they are a company admin
  let employeeCount = 0;
  
  if (session.user.role === "COMPANY_ADMIN" && session.user.companyId) {
    employeeCount = await prisma.user.count({
      where: {
        companyId: session.user.companyId,
        role: "EMPLOYEE"
      }
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
      
      {/* Real-time map placeholder */}
      <div className="mt-8">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Live Activity Map</h3>
        <div className="h-96 w-full rounded-lg bg-gray-200 border border-gray-300 flex items-center justify-center">
          <p className="text-gray-500">Map Integration (Leaflet/Google Maps) will load here</p>
        </div>
      </div>
    </div>
  );
}
