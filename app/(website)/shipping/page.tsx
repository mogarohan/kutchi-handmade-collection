import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function ShippingPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl text-center">
      <h1 className="font-heading text-4xl font-bold text-primary mb-6">Shipping & Delivery</h1>
      
      <div className="bg-muted/30 p-12 rounded-3xl border border-border">
        <h2 className="text-2xl font-heading text-primary font-bold mb-4">Local Delivery Only</h2>
        <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
          Kutchi Handmade Collection currently operates exclusively for our local customers in and around Mandvi, Kutch. 
          All product inquiries, purchases, and delivery arrangements are handled directly via WhatsApp. 
          <br /><br />
          Once you select a masterpiece from our online catalog, reach out to us on WhatsApp to arrange a quick and secure local delivery.
        </p>

        <Link href="/products">
          <Button size="lg" className="gap-2">
            Explore Collection <ArrowRight size={16} />
          </Button>
        </Link>
      </div>
    </div>
  );
}
