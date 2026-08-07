"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MobileNav({ user }: { user?: any }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X size={24} className="text-[#7C2D12]" /> : <Menu size={24} className="text-[#7C2D12]" />}
      </Button>

      {isOpen && (
        <>
          <div className="fixed inset-0 top-[80px] z-40 bg-black/5" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 w-full bg-[#fdfbf7] border-b-2 border-[#7C2D12] shadow-xl flex flex-col p-4 animate-in slide-in-from-top-2 z-50">
            <Link href="/" onClick={() => setIsOpen(false)} className="py-3 px-4 text-base font-semibold text-[#7C2D12] hover:bg-[#7C2D12]/5 rounded-xl border-b border-[#7C2D12]/10">Home</Link>
            <Link href="/about" onClick={() => setIsOpen(false)} className="py-3 px-4 text-base font-semibold text-[#7C2D12] hover:bg-[#7C2D12]/5 rounded-xl border-b border-[#7C2D12]/10">About</Link>
            <Link href="/categories" onClick={() => setIsOpen(false)} className="py-3 px-4 text-base font-semibold text-[#7C2D12] hover:bg-[#7C2D12]/5 rounded-xl border-b border-[#7C2D12]/10">Categories</Link>
            <Link href="/products" onClick={() => setIsOpen(false)} className="py-3 px-4 text-base font-semibold text-[#7C2D12] hover:bg-[#7C2D12]/5 rounded-xl border-b border-[#7C2D12]/10">Products</Link>
            <Link href="/contact" onClick={() => setIsOpen(false)} className="py-3 px-4 text-base font-semibold text-[#7C2D12] hover:bg-[#7C2D12]/5 rounded-xl">Contact</Link>
            {user && (
              <Link href="/my-orders" onClick={() => setIsOpen(false)} className="py-3 px-4 text-base font-semibold text-[#7C2D12] bg-[#7C2D12]/5 rounded-xl mt-2 border border-[#7C2D12]/10">My Orders</Link>
            )}
          </div>
        </>
      )}
    </div>
  );
}
