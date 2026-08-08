import { ReactNode } from "react";
import {
  LayoutDashboard,
  Package,
  ListTree,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
  IndianRupee
} from "lucide-react";
import { AdminMobileNav } from "@/components/layout/admin-mobile-nav";
import { ThemeToggle } from "@/components/theme-toggle";

export default function AdminLayout({ children }: { children: ReactNode }) {
  // In a real app, this layout might be conditionally rendered based on auth state
  // But for now, we assume the login page is handled separately or within this layout structure.

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-muted/20 relative">
      <AdminMobileNav />
      
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar border-r hidden md:flex flex-col">
        <div className="p-6 border-b flex items-center gap-3">
          <img src="/logo.png" alt="Logo" className="h-15 w-auto object-contain rounded-md shadow-sm" />
          <h2 className="font-heading font-bold text-xl text-primary">Admin</h2>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          <NavItem href="/admin/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" />
          <NavItem href="/admin/products" icon={<Package size={20} />} label="Products" />
          <NavItem href="/admin/categories" icon={<ListTree size={20} />} label="Categories" />
          <NavItem href="/admin/orders" icon={<ShoppingCart size={20} />} label="Orders" />
          <NavItem href="/admin/revenue" icon={<IndianRupee size={20} />} label="Revenue" />
          <NavItem href="/admin/customers" icon={<Users size={20} />} label="Customers" />
          <NavItem href="/admin/settings" icon={<Settings size={20} />} label="Settings" />
        </nav>
        <div className="p-4 border-t flex items-center justify-between">
          <a href="/" className="flex items-center gap-3 px-3 py-2 text-muted-foreground hover:text-destructive transition-colors rounded-md hover:bg-muted">
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </a>
          <ThemeToggle />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-background">
        {children}
      </main>
    </div>
  );
}

function NavItem({ href, icon, label }: { href: string; icon: ReactNode; label: string }) {
  return (
    <a
      href={href}
      className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors font-medium"
    >
      {icon}
      <span>{label}</span>
    </a>
  );
}
