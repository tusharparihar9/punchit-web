"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { name: "Employees", href: "/dashboard/employees", icon: "Users" },
  { name: "Attendance", href: "/dashboard/attendance", icon: "CalendarClock" },
  { name: "Payroll", href: "/dashboard/payroll", icon: "Banknote" },
  { name: "Settings", href: "/dashboard/settings", icon: "Settings" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-gray-900">
      <div className="flex h-16 shrink-0 items-center px-6">
        <h1 className="text-xl font-bold text-white tracking-tight">PunchIt</h1>
      </div>
      <nav className="flex flex-1 flex-col mt-6 px-4">
        <ul role="list" className="flex flex-1 flex-col gap-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`
                    group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold
                    ${isActive ? "bg-gray-800 text-white" : "text-gray-400 hover:text-white hover:bg-gray-800"}
                  `}
                >
                  {/* Note: In a real app, use Lucide React icons here based on item.icon */}
                  <span className="w-6 h-6 bg-gray-700 rounded flex items-center justify-center text-xs">
                    {item.name[0]}
                  </span>
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
