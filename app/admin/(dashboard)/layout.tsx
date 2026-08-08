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
import { AdminRealtimeListener } from "@/components/admin-realtime-listener";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-muted/30 relative selection:bg-primary/20">
      <AdminRealtimeListener />
      <AdminMobileNav />
      
      {/* Sidebar with Glassmorphism and Elegant Borders */}
      <aside className="w-72 bg-card/80 backdrop-blur-xl border-r shadow-sm hidden md:flex flex-col z-20 transition-all duration-300">
        <div className="p-6 border-b flex items-center justify-center gap-3 bg-gradient-to-br from-card to-muted/20">
          <img src="/logo.png" alt="Logo" className="h-16 w-auto object-contain drop-shadow-md transition-transform hover:scale-105 duration-500" />
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-1.5 custom-scrollbar">
          <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4 px-3 opacity-70">Main Menu</div>
          <NavItem href="/admin/dashboard" icon={<LayoutDashboard size={18} />} label="Dashboard" />
          <NavItem href="/admin/products" icon={<Package size={18} />} label="Products" />
          <NavItem href="/admin/categories" icon={<ListTree size={18} />} label="Categories" />
          <NavItem href="/admin/orders" icon={<ShoppingCart size={18} />} label="Orders" />
          <NavItem href="/admin/revenue" icon={<IndianRupee size={18} />} label="Revenue" />
          <NavItem href="/admin/customers" icon={<Users size={18} />} label="Customers" />
          <NavItem href="/admin/settings" icon={<Settings size={18} />} label="Settings" />
        </nav>
        <div className="p-4 border-t flex items-center justify-between bg-muted/10">
          <a href="/" className="flex items-center gap-3 px-4 py-2.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200 rounded-lg group">
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-semibold text-sm">Logout</span>
          </a>
          <ThemeToggle />
        </div>
      </aside>

      {/* Main Content Area with elegant inner shadow */}
      <main className="flex-1 overflow-y-auto bg-background/95 relative shadow-inner">
        {children}
      </main>
    </div>
  );
}

function NavItem({ href, icon, label }: { href: string; icon: ReactNode; label: string }) {
  // We can use a simple trick to check active state if needed, but for now we just make hover state elegant
  return (
    <a
      href={href}
      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sidebar-foreground hover:bg-primary/10 hover:text-primary transition-all duration-300 font-semibold text-sm group relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
      <div className="relative z-10 group-hover:scale-110 transition-transform duration-300 text-muted-foreground group-hover:text-primary">
        {icon}
      </div>
      <span className="relative z-10 tracking-wide">{label}</span>
    </a>
  );
}
