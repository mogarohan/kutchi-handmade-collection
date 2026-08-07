"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, LayoutDashboard, Package, ListTree, ShoppingCart, Users, Settings, LogOut, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminMobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  const NavItem = ({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) => (
    <Link
      href={href}
      onClick={() => setIsOpen(false)}
      className="flex items-center gap-3 px-4 py-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors font-medium border-b border-border/50"
    >
      {icon}
      <span>{label}</span>
    </Link>
  );

  return (
    <>
      <div className="md:hidden flex items-center justify-between p-4 bg-sidebar border-b w-full z-10 relative">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Logo" className="h-10 w-auto object-contain rounded-md" />
          <h2 className="font-heading font-bold text-lg text-primary">Admin</h2>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
          <Menu size={24} />
        </Button>
      </div>

      {/* Slide-out Sidebar Drawer */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={() => setIsOpen(false)} />
          
          {/* Drawer */}
          <div className="relative w-64 max-w-sm bg-sidebar h-full shadow-2xl flex flex-col animate-in slide-in-from-left">
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src="/logo.png" alt="Logo" className="h-8 w-auto object-contain rounded-md" />
                <h2 className="font-heading font-bold text-lg text-primary">Admin</h2>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X size={20} />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto py-2">
              <NavItem href="/admin/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" />
              <NavItem href="/admin/products" icon={<Package size={20} />} label="Products" />
              <NavItem href="/admin/categories" icon={<ListTree size={20} />} label="Categories" />
              <NavItem href="/admin/orders" icon={<ShoppingCart size={20} />} label="Orders" />
              <NavItem href="/admin/revenue" icon={<DollarSign size={20} />} label="Revenue" />
              <NavItem href="/admin/customers" icon={<Users size={20} />} label="Customers" />
              <NavItem href="/admin/settings" icon={<Settings size={20} />} label="Settings" />
            </div>
            <div className="p-4 border-t">
              <a href="/" className="flex items-center gap-3 px-4 py-2 w-full text-muted-foreground hover:text-destructive transition-colors font-medium rounded-md hover:bg-sidebar-accent">
                <LogOut size={20} />
                <span>Logout</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
