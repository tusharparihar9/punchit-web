"use client";

import { signOut, useSession } from "next-auth/react";

export function Header() {
  const { data: session } = useSession();

  return (
    <header className="flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8 justify-between">
      <div className="flex flex-1 text-sm font-semibold leading-6 text-gray-900">
        {session?.user?.name ? `Welcome, ${session.user.name}` : "Admin Dashboard"}
      </div>
      <div className="flex items-center gap-x-4 lg:gap-x-6">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="text-sm font-semibold leading-6 text-gray-900 hover:text-indigo-600"
        >
          Sign out
        </button>
      </div>
    </header>
  );
}
