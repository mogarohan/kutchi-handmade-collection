"use client";

import { Button } from "@/components/ui/button";
import { LogOut, Loader2 } from "lucide-react";
import { signOut } from "@/app/actions/auth";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setLoading(true);
    await signOut();
    router.push("/");
  };

  return (
    <Button variant="outline" size="sm" onClick={handleLogout} disabled={loading} className="gap-2">
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
      Logout
    </Button>
  );
}
