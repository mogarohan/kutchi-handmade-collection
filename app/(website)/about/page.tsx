import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Heart, Globe, Users } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Kutchi Handmade Collection",
  description: "Learn about our heritage story and how we preserve the vibrant art of Kutch through premium handcrafted masterpieces.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen pb-20">
      {/* Elegant Hero Section */}
      <section className="relative w-full pt-12 pb-16 md:pt-16 md:pb-24 flex items-center justify-center overflow-hidden bg-[#fdfbf7]">
        {/* Subtle decorative background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#7C2D12]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#7C2D12]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>

        <div className="container mx-auto px-4 relative z-20 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* Left Side: Text Content */}
          <div className="w-full lg:w-1/2 text-center flex flex-col items-center justify-center space-y-8">
            <div className="inline-flex items-center justify-center gap-2 px-6 py-2 rounded-full border border-[#7C2D12]/20 bg-white shadow-sm text-[#7C2D12]">
              <Sparkles size={16} className="opacity-70" />
              <span className="font-heading font-bold tracking-widest text-xs uppercase">Since 2010</span>
              <Sparkles size={16} className="opacity-70" />
            </div>
            
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-[#7C2D12] leading-[1.1] tracking-tight whitespace-nowrap">
              Our <span className="italic">Heritage</span> Story
            </h1>
            
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed font-medium max-w-2xl mx-auto text-center">
              For over a decade, we have preserved the vibrant artistic heritage of Kutch through premium handcrafted masterpieces. Every piece is thoughtfully created by skilled artisans using authentic mirror work and traditional techniques. Blending timeless culture with contemporary elegance, our collections make every occasion truly unforgettable. More than just a product, each creation reflects the passion and legacy of Kutch—crafted with love, worn with pride, and cherished for generations.
            </p>
          </div>

          {/* Right Side: Image */}
          <div className="w-full lg:w-1/2">
            <div className="w-full max-w-[500px] mx-auto h-[400px] md:h-[500px] rounded-[40px] md:rounded-[80px] overflow-hidden border-8 border-white shadow-2xl relative">
              <img 
                src="/hero3.jpg" 
                alt="Traditional Indian Craftsmanship" 
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 mt-10 md:mt-16 relative z-30">
        <div className="bg-background rounded-3xl shadow-xl p-6 md:p-12 border border-border/50 max-w-5xl mx-auto">
          
          {/* Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center mb-12 md:mb-16">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-2">
                <Sparkles size={16} />
                <span>Our Mission</span>
              </div>
              <h2 className="font-heading text-4xl font-bold text-foreground leading-tight">
                Empowering Artisans, <br/>
                <span className="text-primary">Inspiring the World.</span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                We are dedicated to empowering local artisans in Kutch by providing them a global platform to showcase their remarkable craftsmanship. Every piece you purchase directly supports these talented individuals and helps keep a centuries-old tradition alive.
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-2">
                <Heart size={16} />
                <span>Why Kutchi Art?</span>
              </div>
              <h2 className="font-heading text-4xl font-bold text-foreground leading-tight">
                The Legacy of <br/>
                <span className="text-primary">Abhla Bharat.</span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Kutchi mirror work is a centuries-old tradition born in the deserts of Gujarat. Each piece tells a story of devotion, vibrant culture, and meticulous hand-embroidery that cannot be replicated by machines. We ensure this legacy continues in its most luxurious form.
              </p>
            </div>
          </div>

          {/* Value Props */}
          <div className="grid md:grid-cols-3 gap-8 mb-16 pt-16 border-t border-border">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center text-primary rotate-3 transition-transform hover:rotate-6">
                <Users size={32} />
              </div>
              <h3 className="font-heading text-2xl font-bold text-foreground">Artisan Crafted</h3>
              <p className="text-muted-foreground">100% handmade by authentic Kutchi families.</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center text-primary -rotate-3 transition-transform hover:-rotate-6">
                <Heart size={32} />
              </div>
              <h3 className="font-heading text-2xl font-bold text-foreground">Ethical Sourcing</h3>
              <p className="text-muted-foreground">Fair trade practices that uplift the entire community.</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center text-primary rotate-3 transition-transform hover:rotate-6">
                <Globe size={32} />
              </div>
              <h3 className="font-heading text-2xl font-bold text-foreground">Global Heritage</h3>
              <p className="text-muted-foreground">Bringing the colors of India to the world stage.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
