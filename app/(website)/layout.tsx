import { ReactNode } from "react";
import Footer from "@/components/layout/footer";

import { CartButton } from "@/components/ui/cart-button";
import { AccountButton } from "@/components/auth/account-button";
import { FloatingButtons } from "@/components/ui/floating-buttons";
import { MobileNav } from "@/components/layout/mobile-nav";
import { getUser } from "@/app/actions/auth";

export default async function WebsiteLayout({ children }: { children: ReactNode }) {
  const user = await getUser();

  return (
    <div className="flex flex-col min-h-screen bg-[#fdfbf7]">
      <header className="sticky top-0 z-50 w-full border-b-2 border-[#7C2D12] bg-[#fdfbf7]/95 backdrop-blur supports-[backdrop-filter]:bg-[#fdfbf7]/60">
        <div className="container mx-auto flex h-20 items-center justify-between px-4">
          <a href="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="Kutchi Handmade Collection Logo" className="h-20 w-auto object-contain" />
            <span className="font-heading text-xl font-bold text-[#7C2D12] tracking-tight hidden sm:inline-block">Kutchi Handmade Collection</span>
          </a>
          <nav className="hidden md:flex gap-6">
            <a href="/" className="text-sm font-medium hover:text-[#7C2D12] text-gray-700 transition-colors">Home</a>
            <a href="/about" className="text-sm font-medium hover:text-[#7C2D12] text-gray-700 transition-colors">About</a>
            <a href="/categories" className="text-sm font-medium hover:text-[#7C2D12] text-gray-700 transition-colors">Categories</a>
            <a href="/products" className="text-sm font-medium hover:text-[#7C2D12] text-gray-700 transition-colors">Products</a>
            <a href="/contact" className="text-sm font-medium hover:text-[#7C2D12] text-gray-700 transition-colors">Contact</a>
            {user && (
              <a href="/my-orders" className="text-sm font-medium hover:text-[#7C2D12] text-[#7C2D12] transition-colors">My Orders</a>
            )}
          </nav>
          <div className="flex items-center gap-1 sm:gap-2">
            <AccountButton user={user} />
            <CartButton />
            <MobileNav user={user} />
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      {/* Global CTA before footer */}
      <section className="bg-[#f3efe8] py-16 border-t border-[#7C2D12]/10 relative overflow-hidden">
        {/* Subtle background pattern for CTA */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l30 30-30 30L0 30z' fill='%237C2D12' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }} />

        <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl space-y-6">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-[#7C2D12]">
            Looking for something specific?
          </h2>
          <p className="text-gray-600 text-lg md:text-xl">
            We can craft personalized pieces tailored to your exact style. Reach out to us on WhatsApp to discuss your dream design.
          </p>
          <div className="pt-4">
            <a
              href="https://wa.me/919313225740"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-[#7C2D12] text-[#f3efe8] px-8 py-3.5 rounded-full font-bold hover:bg-[#7C2D12]/90 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12.031 0C5.408 0 0 5.405 0 12.029c0 2.115.55 4.183 1.595 6.002L.032 23.593l5.727-1.503c1.758.948 3.737 1.452 5.767 1.452h.005c6.621 0 12.027-5.407 12.027-12.033 0-3.21-1.25-6.226-3.518-8.496C17.771 1.25 14.757.001 12.031 0zm.005 21.542h-.003c-1.879 0-3.719-.504-5.334-1.46l-.382-.227-3.966 1.041 1.061-3.868-.249-.396c-1.049-1.664-1.603-3.592-1.603-5.589 0-5.741 4.673-10.414 10.42-10.414 2.784 0 5.403 1.085 7.37 3.053 1.968 1.967 3.052 4.585 3.052 7.369 0 5.742-4.673 10.414-10.415 10.414zM17.75 13.918c-.313-.157-1.855-.916-2.143-1.021-.288-.105-.497-.157-.707.157-.21.314-.809 1.021-.992 1.23-.183.21-.366.236-.679.079-.313-.157-1.325-.489-2.524-1.556-.934-.83-1.564-1.856-1.748-2.17-.183-.314-.02-.484.137-.64.141-.14.313-.366.47-.55.157-.183.21-.314.314-.523.104-.21.052-.393-.026-.55-.078-.157-.707-1.702-.969-2.33-.255-.611-.515-.528-.707-.538-.184-.009-.393-.009-.603-.009-.21 0-.55.079-.838.393-.288.314-1.099 1.074-1.099 2.619 0 1.546 1.125 3.039 1.282 3.249.157.21 2.219 3.388 5.378 4.747 3.159 1.359 3.159.904 3.735.852.576-.052 1.855-.758 2.117-1.492.262-.733.262-1.36.183-1.492-.078-.131-.287-.209-.601-.366z" /></svg>
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>

      <Footer />
      <FloatingButtons />
    </div>
  );
}
