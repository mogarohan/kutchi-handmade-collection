import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kutchi Handmade Collection | Premium Mirror Work Masterpieces",
  description: "Crafted with love from Kutch. Premium handmade mirror work creations, Chaniya Cholis, earrings, bangles, and navratri collection.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  }
};

import { CartProvider } from "@/contexts/cart-context";
import { CartSidebar } from "@/components/ui/cart-sidebar";
import { Toaster } from "@/components/ui/sonner";
import { ScrollToTop } from "@/components/layout/scroll-to-top";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col overflow-x-hidden">
        <CartProvider>
          <ScrollToTop />
          {children}
          <CartSidebar />
          <Toaster />
        </CartProvider>
      </body>
    </html>
  );
}
