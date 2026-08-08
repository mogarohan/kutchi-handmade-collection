"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function AdminRealtimeListener() {
  const router = useRouter();

  useEffect(() => {
    // Since we want to keep our API keys 100% hidden from the frontend (Client),
    // we cannot use Supabase Realtime directly in the browser.
    // Instead, we use a simple polling mechanism to auto-refresh the Admin dashboard every 15 seconds.
    const intervalId = setInterval(() => {
      router.refresh();
    }, 15000);

    return () => clearInterval(intervalId);
  }, [router]);

  return null;
}
