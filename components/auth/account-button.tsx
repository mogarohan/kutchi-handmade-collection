"use client";

import { useState } from "react";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthModal } from "./auth-modal";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { buttonVariants } from "@/components/ui/button";

export function AccountButton({ user }: { user: any }) {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  if (user) {
    return (
      <Link href="/account" title="My Account" className={buttonVariants({ variant: "ghost", size: "icon" })}>
        <User className="w-5 h-5" />
      </Link>
    );
  }

  return (
    <>
      <Button variant="ghost" size="icon" onClick={() => setShowModal(true)} title="Login">
        <User className="w-5 h-5" />
      </Button>
      <AuthModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        onSuccess={() => {
          router.refresh(); // Refresh layout to show account icon
        }}
      />
    </>
  );
}
