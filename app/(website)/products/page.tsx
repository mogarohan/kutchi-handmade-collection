import { Filter, SlidersHorizontal, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductCard } from "@/components/ui/product-card";
import { Badge } from "@/components/ui/badge";
import { getProducts } from "@/app/actions/products";
import { getCategories } from "@/app/actions/categories";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Products | Kutchi Handmade Collection",
  description: "Browse our complete collection of premium handmade mirror work creations and accessories from Kutch.",
};

export const dynamic = "force-dynamic";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  
  // Fetch active products from Supabase
  let products = await getProducts(true);

  // Get categories for the filter sidebar
  const categories = await getCategories();

  // Filter by category if present in URL
  if (resolvedSearchParams.category) {
    products = products.filter(
      (product) => product.category === resolvedSearchParams.category
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Compact Premium Banner (Like Home Page style) */}
      <div className="relative mb-8 rounded-[30px] bg-[#f3efe8] border border-[#7C2D12]/10 px-8 py-10 md:py-12 overflow-hidden shadow-[0_10px_30px_rgba(124,45,18,0.03)] flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* Left Side: Text */}
        <div className="relative z-10 max-w-xl space-y-4 text-center md:text-left flex-1">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#7C2D12]/20 bg-white shadow-sm text-[#7C2D12]">
            <Sparkles size={14} className="opacity-70" />
            <span className="font-heading font-bold tracking-widest text-[10px] uppercase">Authentic Collection</span>
            <Sparkles size={14} className="opacity-70" />
          </div>
          
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
            Our Masterpiece <span className="italic text-[#7C2D12] font-serif">Collection</span>
          </h1>
          
          <p className="text-muted-foreground font-medium text-sm md:text-base leading-relaxed">
            Explore our premium range of authentic handmade Kutchi creations, crafted by skilled artisans preserving generations of heritage.
          </p>
        </div>

        {/* Right Side: Decorative elements (Home page vibe) */}
        <div className="relative hidden md:flex items-center justify-center w-64 h-full">
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-64 h-64 border-2 border-[#7C2D12]/10 rounded-full border-dashed animate-[spin_40s_linear_infinite]" />
          <div className="absolute right-8 top-1/2 -translate-y-1/2 w-48 h-48 border border-[#7C2D12]/20 rounded-full animate-[spin_30s_linear_infinite_reverse]" />
          
          <div className="w-32 h-32 bg-[#7C2D12] rounded-full flex items-center justify-center shadow-lg relative z-10 translate-x-12">
            <Sparkles className="w-12 h-12 text-[#f3efe8]" />
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between border-b pb-6 border-border/50">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input placeholder="Search collections..." className="pl-10 bg-muted/30 border-border" />
        </div>
        <div className="flex gap-4 w-full sm:w-auto">
          <Button variant="outline" className="w-full sm:w-auto gap-2 text-foreground border-border">
            <SlidersHorizontal size={16} />
            Filters
          </Button>
          <select className="flex h-10 w-full items-center justify-between rounded-md border border-border bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 sm:w-48">
            <option>Featured</option>
            <option>Newest</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
          </select>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 bg-muted/30 rounded-2xl border border-border">
          <h3 className="text-2xl font-heading text-primary font-bold mb-2">No Products Yet</h3>
          <p className="text-muted-foreground">Admin hasn't added any active products yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 lg:gap-8">
          {products.map((product) => (
            <ProductCard 
              key={product.id}
              product={product}
            />
          ))}
        </div>
      )}
    </div>
  );
}
