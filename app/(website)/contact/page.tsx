import { getSetting } from "@/app/actions/settings";
import { Mail, MapPin, Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Kutchi Handmade Collection",
  description: "Get in touch with us for inquiries, custom orders, or any questions about our Kutchi handicrafts.",
};

export default async function ContactPage() {
  const whatsappNumberSetting = await getSetting("whatsapp_number", "919313225740");
  const cleanNumber = whatsappNumberSetting.replace(/[^0-9]/g, '');
  const storeAddress = await getSetting("store_address", "Mandvi-Kutch, Gujarat, India");
  const instagramHandle = await getSetting("instagram_handle", "@kutchi_handmade_collection");

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-5xl">
      <div className="text-center mb-10 md:mb-12 space-y-4">
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary">Contact Us</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          We'd love to hear from you. Reach out to us for any inquiries about our handmade collection.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Info Column */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-none shadow-md bg-white">
            <CardContent className="p-6 space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Phone className="text-primary" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">WhatsApp Support</h3>
                  <p className="text-muted-foreground text-sm mb-1">Mon-Sat, 10am-7pm</p>
                  <p className="font-medium text-foreground">+{cleanNumber}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="text-primary" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Store Address</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">{storeAddress}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                    <path d="M16.11 7.66v.01"/>
                    <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Instagram</h3>
                  <a href={`https://instagram.com/${instagramHandle.replace('@', '')}`} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                    {instagramHandle}
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* WhatsApp Action Card Column */}
        <div className="lg:col-span-2 flex">
          <Card className="bg-[#25D366] text-white border-none w-full flex items-center shadow-lg">
            <CardContent className="p-8 md:p-12 text-center space-y-6 w-full">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40" fill="currentColor"><path d="M12.031 0C5.408 0 0 5.405 0 12.029c0 2.115.55 4.183 1.595 6.002L.032 23.593l5.727-1.503c1.758.948 3.737 1.452 5.767 1.452h.005c6.621 0 12.027-5.407 12.027-12.033 0-3.21-1.25-6.226-3.518-8.496C17.771 1.25 14.757.001 12.031 0zm.005 21.542h-.003c-1.879 0-3.719-.504-5.334-1.46l-.382-.227-3.966 1.041 1.061-3.868-.249-.396c-1.049-1.664-1.603-3.592-1.603-5.589 0-5.741 4.673-10.414 10.42-10.414 2.784 0 5.403 1.085 7.37 3.053 1.968 1.967 3.052 4.585 3.052 7.369 0 5.742-4.673 10.414-10.415 10.414zM17.75 13.918c-.313-.157-1.855-.916-2.143-1.021-.288-.105-.497-.157-.707.157-.21.314-.809 1.021-.992 1.23-.183.21-.366.236-.679.079-.313-.157-1.325-.489-2.524-1.556-.934-.83-1.564-1.856-1.748-2.17-.183-.314-.02-.484.137-.64.141-.14.313-.366.47-.55.157-.183.21-.314.314-.523.104-.21.052-.393-.026-.55-.078-.157-.707-1.702-.969-2.33-.255-.611-.515-.528-.707-.538-.184-.009-.393-.009-.603-.009-.21 0-.55.079-.838.393-.288.314-1.099 1.074-1.099 2.619 0 1.546 1.125 3.039 1.282 3.249.157.21 2.219 3.388 5.378 4.747 3.159 1.359 3.159.904 3.735.852.576-.052 1.855-.758 2.117-1.492.262-.733.262-1.36.183-1.492-.078-.131-.287-.209-.601-.366z"/></svg>
              </div>
              <h2 className="font-heading text-3xl font-bold">Ready to Order?</h2>
              <p className="text-white/90 text-lg max-w-md mx-auto leading-relaxed">
                Message us directly on WhatsApp to place your order, ask about custom designs, or track your shipment.
              </p>
              <div className="pt-4">
                <a 
                  href={`https://wa.me/${cleanNumber}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-3 h-14 px-8 rounded-full bg-white text-[#25D366] font-bold text-lg hover:bg-white/90 hover:scale-105 transition-all shadow-xl"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12.031 0C5.408 0 0 5.405 0 12.029c0 2.115.55 4.183 1.595 6.002L.032 23.593l5.727-1.503c1.758.948 3.737 1.452 5.767 1.452h.005c6.621 0 12.027-5.407 12.027-12.033 0-3.21-1.25-6.226-3.518-8.496C17.771 1.25 14.757.001 12.031 0zm.005 21.542h-.003c-1.879 0-3.719-.504-5.334-1.46l-.382-.227-3.966 1.041 1.061-3.868-.249-.396c-1.049-1.664-1.603-3.592-1.603-5.589 0-5.741 4.673-10.414 10.42-10.414 2.784 0 5.403 1.085 7.37 3.053 1.968 1.967 3.052 4.585 3.052 7.369 0 5.742-4.673 10.414-10.415 10.414zM17.75 13.918c-.313-.157-1.855-.916-2.143-1.021-.288-.105-.497-.157-.707.157-.21.314-.809 1.021-.992 1.23-.183.21-.366.236-.679.079-.313-.157-1.325-.489-2.524-1.556-.934-.83-1.564-1.856-1.748-2.17-.183-.314-.02-.484.137-.64.141-.14.313-.366.47-.55.157-.183.21-.314.314-.523.104-.21.052-.393-.026-.55-.078-.157-.707-1.702-.969-2.33-.255-.611-.515-.528-.707-.538-.184-.009-.393-.009-.603-.009-.21 0-.55.079-.838.393-.288.314-1.099 1.074-1.099 2.619 0 1.546 1.125 3.039 1.282 3.249.157.21 2.219 3.388 5.378 4.747 3.159 1.359 3.159.904 3.735.852.576-.052 1.855-.758 2.117-1.492.262-.733.262-1.36.183-1.492-.078-.131-.287-.209-.601-.366z"/></svg>
                  Chat on WhatsApp
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
