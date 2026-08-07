import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Star, ShieldCheck, Truck, Sparkles } from "lucide-react";
import { getCategories } from "@/app/actions/categories";
import { getProducts } from "@/app/actions/products";
import { ProductCard } from "@/components/ui/product-card";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const categories = await getCategories();
  const products = await getProducts(true); // only active products

  // Get trending/featured products
  const featuredProducts = products.filter(p => p.is_featured || p.is_trending).slice(0, 5);

  return (
    <div className="flex flex-col min-h-screen bg-[#fdfbf7]">

      {/* 1. HERO SECTION (Split Layout) */}
      <section className="relative w-full flex items-center justify-center overflow-hidden pt-12 pb-20 lg:pt-16 lg:pb-24 bg-[#f3efe8] border-b border-[#7C2D12]/10 shadow-[0_10px_30px_rgba(124,45,18,0.03)]">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l30 30-30 30L0 30z' fill='%237C2D12' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }} />

        <div className="container mx-auto px-4 relative z-20">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

            {/* Left Side: Image with effects */}
            <div className="w-full lg:w-1/2 relative flex justify-center">
              {/* Spinning decorative background behind image */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] md:w-[130%] md:h-[130%] opacity-10 animate-[spin_60s_linear_infinite] pointer-events-none -z-10">
                <svg viewBox="0 0 100 100" className="w-full h-full fill-[#7C2D12]">
                  <path d="M50 0 C60 40, 90 40, 100 50 C90 60, 60 60, 50 100 C40 60, 10 60, 0 50 C10 40, 40 40, 50 0 Z" />
                  <circle cx="50" cy="50" r="20" fill="none" stroke="#7C2D12" strokeWidth="2" />
                </svg>
              </div>

              {/* Main Image */}
              <div className="relative w-full max-w-[450px] aspect-[4/5] rounded-[40px] rounded-tl-[100px] rounded-br-[100px] overflow-hidden shadow-2xl border-4 border-[#7C2D12]">
                <img
                  src="/hero1.jpg"
                  alt="Authentic Kutchi Craftsmanship"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>

            {/* Right Side: Text & Buttons */}
            <div className="w-full lg:w-1/2 space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#7C2D12]/10 text-[#7C2D12] border border-[#7C2D12]/20 font-bold text-sm tracking-widest uppercase">
                <Star size={14} className="fill-[#7C2D12]" />
                <span>Authentic Kutchi Craftsmanship</span>
              </div>

              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-[#7C2D12] leading-[1.2]">
                Wear the Art of Kutch
                <span className="block mt-3 md:mt-4 text-xl md:text-2xl lg:text-3xl italic font-serif text-[#7C2D12]/70 font-normal tracking-wide">
                  Handcrafted Traditions, Modern Elegance & Timeless Beauty.
                </span>
              </h1>

              <p className="text-base md:text-lg text-gray-700 font-sans max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Discover the beauty of authentic Kutchi craftsmanship through our exclusive collection of mirror work creations, Chaniya Cholis, handcrafted bangles, necklaces, earrings, and festive accessories. Every piece is carefully made by skilled artisans to celebrate tradition, elegance, and individuality.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <Link href="/products">
                  <Button size="lg" className="w-full sm:w-auto h-14 px-10 text-lg rounded-full bg-[#7C2D12] text-[#f3efe8] hover:bg-[#7C2D12]/90 shadow-[0_0_20px_rgba(124,45,18,0.3)] hover:-translate-y-1 transition-all font-bold tracking-wide">
                    Shop Collection
                  </Button>
                </Link>
                <Link href="/categories">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-10 text-lg rounded-full border-2 border-[#7C2D12] text-[#7C2D12] hover:bg-[#7C2D12]/10 hover:-translate-y-1 shadow-[0_0_20px_rgba(124,45,18,0.1)] transition-all font-bold tracking-wide">
                    Explore Categories
                  </Button>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. DYNAMIC CATEGORIES (New Arch Look) */}
      <section className="py-12 md:py-16 bg-white relative overflow-hidden">
        {/* Subtle decorative background for Categories */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#7C2D12]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#7C2D12]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-10 md:mb-12 space-y-6">
            <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-[#7C2D12]/20 bg-[#f3efe8] shadow-sm text-[#7C2D12]">
              <Sparkles size={16} className="opacity-70" />
              <span className="font-heading font-bold tracking-widest text-xs uppercase">Kutch Specially</span>
              <Sparkles size={16} className="opacity-70" />
            </div>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-gray-900">Our Artistic Heritage</h2>
            <div className="w-24 h-1 bg-[#7C2D12] mx-auto rounded-full opacity-70"></div>
          </div>

          {categories.length === 0 ? (
            <div className="bg-muted/30 p-12 text-center rounded-2xl border border-dashed max-w-xl mx-auto">
              <p className="text-muted-foreground">Admin hasn't created any categories yet.</p>
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-8 md:gap-12">
              {categories.map((category) => (
                <Link href={`/products?category=${category.slug}`} key={category.id} className="group flex flex-col items-center gap-6 w-40 md:w-56">
                  {/* Arch Shaped Image Container */}
                  <div className="w-full aspect-[3/4] rounded-[60px] rounded-t-[120px] overflow-hidden border-4 border-[#f3efe8] bg-white shadow-[0_10px_40px_rgba(124,45,18,0.08)] transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_20px_50px_rgba(124,45,18,0.15)] group-hover:border-[#7C2D12]/20">
                    <div className="w-full h-full bg-muted">
                      {category.image_url ? (
                        <img
                          src={category.image_url}
                          alt={category.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#f3efe8] flex items-center justify-center text-[#7C2D12] font-heading text-3xl p-4 text-center">
                          {category.name[0]}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-center space-y-1">
                    <span className="font-heading font-bold text-xl md:text-2xl text-gray-800 group-hover:text-[#7C2D12] transition-colors">
                      {category.name}
                    </span>
                    <div className="h-0.5 w-0 bg-[#7C2D12] mx-auto transition-all duration-300 group-hover:w-8"></div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS */}
      {featuredProducts.length > 0 && (
        <section className="py-12 md:py-16 bg-white border-y border-[#7C2D12]/10 relative overflow-hidden">
          {/* Subtle Corner Mandalas for Trending Section */}
          <div className="absolute top-0 left-0 w-64 h-64 opacity-[0.03] pointer-events-none -translate-x-1/2 -translate-y-1/2">
            <svg viewBox="0 0 100 100" className="w-full h-full fill-[#7C2D12]"><circle cx="50" cy="50" r="50" /></svg>
          </div>
          <div className="absolute bottom-0 right-0 w-64 h-64 opacity-[0.03] pointer-events-none translate-x-1/2 translate-y-1/2">
            <svg viewBox="0 0 100 100" className="w-full h-full fill-[#7C2D12]"><circle cx="50" cy="50" r="50" /></svg>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-10 md:mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#7C2D12]/5 text-[#7C2D12] font-medium text-sm mb-4 border border-[#7C2D12]/10">
                <Star size={16} className="fill-[#7C2D12]" />
                <span className="uppercase tracking-widest font-bold text-xs">Bestsellers</span>
              </div>
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-[#7C2D12] mb-4">Trending Now</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Our most loved and sought-after pieces, hand-picked for you.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 lg:gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="text-center mt-16">
              <Link href="/products">
                <Button variant="outline" size="lg" className="h-14 px-10 rounded-full border-2 border-[#7C2D12] text-[#7C2D12] hover:bg-[#7C2D12] hover:text-white transition-all font-bold tracking-wide uppercase text-sm">
                  View Full Collection
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 4. VALUE PROPOSITION BANNER */}
      <section className="py-12 md:py-16 bg-[#fdfbf7] relative">
        <div className="container mx-auto px-4 relative z-10">
          <div className="rounded-[40px] overflow-hidden relative bg-gradient-to-br from-[#7C2D12] via-[#63220e] to-[#461708] text-[#f3efe8] shadow-2xl p-10 md:p-16">

            {/* Inner Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-[0.08] pointer-events-none mix-blend-overlay" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 0 L100 50 L50 100 L0 50 Z' fill='%23Fdfbf7' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
              backgroundSize: '100px 100px'
            }} />
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#f3efe8]/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#f3efe8]/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center relative z-20">
              {/* Box 1 */}
              <div className="flex flex-col items-center space-y-6 p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/30 shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] hover:bg-white/20 hover:-translate-y-1 transition-all duration-300">
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-2 shadow-inner border border-white/40">
                  <Star className="w-8 h-8 text-[#f3efe8]" />
                </div>
                <h3 className="text-2xl font-bold font-heading tracking-wide">Premium Quality</h3>
                <p className="text-[#f3efe8]/90 leading-relaxed text-sm md:text-base">Every piece is meticulously handcrafted using the finest materials to ensure lasting beauty.</p>
              </div>

              {/* Box 2 */}
              <div className="flex flex-col items-center space-y-6 p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/30 shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] hover:bg-white/20 hover:-translate-y-1 transition-all duration-300">
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-2 shadow-inner border border-white/40">
                  <ShieldCheck className="w-8 h-8 text-[#f3efe8]" />
                </div>
                <h3 className="text-2xl font-bold font-heading tracking-wide">Secure WhatsApp</h3>
                <p className="text-[#f3efe8]/90 leading-relaxed text-sm md:text-base">Direct, personalized ordering through WhatsApp for a trustworthy and simple checkout experience.</p>
              </div>

              {/* Box 3 */}
              <div className="flex flex-col items-center space-y-6 p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/30 shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] hover:bg-white/20 hover:-translate-y-1 transition-all duration-300">
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-2 shadow-inner border border-white/40">
                  <Truck className="w-8 h-8 text-[#f3efe8]" />
                </div>
                <h3 className="text-2xl font-bold font-heading tracking-wide">Nationwide Delivery</h3>
                <p className="text-[#f3efe8]/90 leading-relaxed text-sm md:text-base">We ship our authentic Kutch heritage directly to your doorstep, anywhere in India.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
