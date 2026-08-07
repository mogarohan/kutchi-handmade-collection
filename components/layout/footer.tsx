import Link from "next/link";
import { MapPin } from "lucide-react";
import { getSetting } from "@/app/actions/settings";

export default async function Footer() {
  const whatsappNumberSetting = await getSetting("whatsapp_number", "+91 93132 25740");
  const cleanNumber = whatsappNumberSetting.replace(/[^0-9]/g, '');
  
  // Format as +91 93132 25740 for display if it matches the length
  let formattedNumber = `+${cleanNumber}`;
  if (cleanNumber.length === 12 && cleanNumber.startsWith('91')) {
    formattedNumber = `+91 ${cleanNumber.slice(2, 7)} ${cleanNumber.slice(7)}`;
  } else if (whatsappNumberSetting.includes(' ')) {
    formattedNumber = whatsappNumberSetting; // Use user's exact spacing if provided
  }

  const storeAddress = await getSetting("store_address", "Bhuj, Gujarat, India");
  const instagramHandle = await getSetting("instagram_handle", "@kutchi_handmade_collection");

  return (
    <footer className="bg-[#fdfbf7] border-t-2 border-[#7C2D12] mt-auto">
      <div className="container mx-auto px-4 pt-8 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">

          {/* Brand Section */}
          <div className="space-y-4">
            <Link href="/" className="flex flex-col gap-2">
              <img src="/logo.png" alt="Kutchi Handmade Collection Logo" className="h-20 w-auto object-contain object-left" />
              <span className="font-heading text-xl font-bold text-primary tracking-tight">Kutchi Handmade Collection</span>
            </Link>
            <p className="text-muted-foreground font-sans text-sm leading-relaxed">
              Preserving the authentic heritage of Kutch through premium handcrafted creations. Every piece tells a story of tradition, culture, and unmatched craftsmanship.
            </p>
          </div>

          {/* Links Wrapper for side-by-side on mobile */}
          <div className="grid grid-cols-2 gap-8 md:gap-6 lg:col-span-2">
            {/* Quick Links */}
            <div>
              <h3 className="font-heading text-lg font-bold text-primary mb-4">Explore</h3>
              <ul className="space-y-3">
                <li><Link href="/products" className="text-muted-foreground hover:text-primary transition-colors text-sm">All Products</Link></li>
                <li><Link href="/categories" className="text-muted-foreground hover:text-primary transition-colors text-sm">Categories</Link></li>
                <li><Link href="/about" className="text-muted-foreground hover:text-primary transition-colors text-sm">Our Story</Link></li>
                <li><Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors text-sm">Contact Us</Link></li>
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h3 className="font-heading text-lg font-bold text-primary mb-4">Support</h3>
              <ul className="space-y-3">
                <li><Link href="/shipping" className="text-muted-foreground hover:text-primary transition-colors text-sm">Shipping & Delivery</Link></li>
                <li><Link href="/faq" className="text-muted-foreground hover:text-primary transition-colors text-sm">FAQs</Link></li>
                <li><Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors text-sm">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors text-sm">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          {/* Contact & Socials */}
          <div>
            <h3 className="font-heading text-lg font-bold text-primary mb-4">Get In Touch</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-muted-foreground text-sm">
                <MapPin className="shrink-0 mt-0.5 text-primary" size={18} />
                <span className="whitespace-pre-wrap">{storeAddress}</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground text-sm">
                <a href={`https://wa.me/${cleanNumber}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-[#25D366] transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor" className="text-[#25D366] shrink-0"><path d="M12.031 0C5.408 0 0 5.405 0 12.029c0 2.115.55 4.183 1.595 6.002L.032 23.593l5.727-1.503c1.758.948 3.737 1.452 5.767 1.452h.005c6.621 0 12.027-5.407 12.027-12.033 0-3.21-1.25-6.226-3.518-8.496C17.771 1.25 14.757.001 12.031 0zm.005 21.542h-.003c-1.879 0-3.719-.504-5.334-1.46l-.382-.227-3.966 1.041 1.061-3.868-.249-.396c-1.049-1.664-1.603-3.592-1.603-5.589 0-5.741 4.673-10.414 10.42-10.414 2.784 0 5.403 1.085 7.37 3.053 1.968 1.967 3.052 4.585 3.052 7.369 0 5.742-4.673 10.414-10.415 10.414zM17.75 13.918c-.313-.157-1.855-.916-2.143-1.021-.288-.105-.497-.157-.707.157-.21.314-.809 1.021-.992 1.23-.183.21-.366.236-.679.079-.313-.157-1.325-.489-2.524-1.556-.934-.83-1.564-1.856-1.748-2.17-.183-.314-.02-.484.137-.64.141-.14.313-.366.47-.55.157-.183.21-.314.314-.523.104-.21.052-.393-.026-.55-.078-.157-.707-1.702-.969-2.33-.255-.611-.515-.528-.707-.538-.184-.009-.393-.009-.603-.009-.21 0-.55.079-.838.393-.288.314-1.099 1.074-1.099 2.619 0 1.546 1.125 3.039 1.282 3.249.157.21 2.219 3.388 5.378 4.747 3.159 1.359 3.159.904 3.735.852.576-.052 1.855-.758 2.117-1.492.262-.733.262-1.36.183-1.492-.078-.131-.287-.209-.601-.366z" /></svg>
                  <span>{formattedNumber} (WhatsApp)</span>
                </a>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground text-sm mt-3">
                <a href={`https://instagram.com/${instagramHandle.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-[#E1306C] transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#E1306C]"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
                  <span>{instagramHandle}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#7C2D12]/10 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Kutchi Handmade Collection. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Made with</span>
            <span className="text-red-500">❤️</span>
            <span>in Kutch</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
