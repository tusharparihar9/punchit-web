"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";

export function ActivityMap({ logs }: { logs: any[] }) {
  // Dynamically import the map component to avoid Next.js SSR window errors
  const Map = useMemo(
    () =>
      dynamic(() => import("./MapComponent"), {
        loading: () => <p className="text-gray-500">Loading map...</p>,
        ssr: false,
      }),
    []
  );

  return (
    <div className="h-96 w-full rounded-lg bg-gray-200 border border-gray-300 overflow-hidden relative z-0">
      <Map logs={logs} />
    </div>
  );
}
