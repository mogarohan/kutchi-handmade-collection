"use client";

import { useState, useMemo, useRef } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ProductCard } from "@/components/ui/product-card";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  original_price: number;
  sale_price: number;
  image_url: string;
  stock: number;
  is_active: boolean;
  is_trending: boolean;
  is_featured: boolean;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ProductsClientProps {
  initialProducts: Product[];
  categories: Category[];
  initialCategory?: string;
}

export function ProductsClient({ initialProducts, categories, initialCategory = "" }: ProductsClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory || null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const filteredProducts = useMemo(() => {
    return initialProducts.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            product.category?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const productCategorySlug = product.category?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
      const matchesCategory = selectedCategory ? productCategorySlug === selectedCategory : true;
      
      return matchesSearch && matchesCategory;
    });
  }, [initialProducts, searchQuery, selectedCategory]);

  return (
    <div className="flex flex-col items-center w-full max-w-7xl mx-auto space-y-8">
      
      {/* Centered Search & Filters Section */}
      <div className="w-full max-w-3xl flex flex-col items-center space-y-6">
        
        {/* Large Prominent Search Bar */}
        <div className="relative w-full shadow-lg rounded-2xl group transition-all duration-300 hover:shadow-xl focus-within:shadow-xl focus-within:-translate-y-1">
          <div className="absolute inset-0 bg-primary/5 rounded-2xl -z-10 blur-xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-primary w-6 h-6 opacity-70" />
          <Input 
            placeholder="Search our authentic collections..."
            className="pl-16 pr-6 h-16 w-full bg-background border-2 border-primary/20 text-lg rounded-2xl focus-visible:ring-primary focus-visible:border-primary transition-all shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Scrollable Category Pills with Arrows */}
        <div className="w-full relative flex items-center group">
          <button 
            onClick={() => scroll('left')} 
            className="absolute -left-4 z-10 p-2 bg-background/80 backdrop-blur-sm border shadow-md rounded-full text-primary opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary hover:text-white"
          >
            <ChevronLeft size={20} />
          </button>
          
          <div ref={scrollRef} className="flex gap-3 overflow-x-auto pb-4 custom-scrollbar px-6 w-full scroll-smooth">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`shrink-0 px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 border-2 ${
                selectedCategory === null 
                  ? 'bg-primary text-primary-foreground border-primary shadow-md scale-105' 
                  : 'bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-primary'
              }`}
            >
              All Masterpieces
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`shrink-0 px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 border-2 ${
                  selectedCategory === cat.slug 
                    ? 'bg-primary text-primary-foreground border-primary shadow-md scale-105' 
                    : 'bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-primary'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <button 
            onClick={() => scroll('right')} 
            className="absolute -right-4 top-1 z-10 p-2 bg-background/80 backdrop-blur-sm border shadow-md rounded-full text-primary opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary hover:text-white"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Results Section */}
      <div className="w-full pt-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-heading font-bold text-foreground">
            {selectedCategory 
              ? categories.find(c => c.slug === selectedCategory)?.name || "Collection"
              : "All Products"
            }
          </h2>
          <span className="text-muted-foreground font-medium bg-muted px-3 py-1 rounded-full text-sm">
            {filteredProducts.length} items
          </span>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-24 bg-muted/20 rounded-3xl border-2 border-dashed border-border flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center shadow-sm mb-4">
              <Search className="w-10 h-10 text-muted-foreground opacity-50" />
            </div>
            <h3 className="text-2xl font-heading text-primary font-bold mb-2">No Products Found</h3>
            <p className="text-muted-foreground max-w-md">Try adjusting your search or selecting a different category to find what you're looking for.</p>
            <button 
              onClick={() => { setSearchQuery(""); setSelectedCategory(null); }}
              className="mt-6 px-6 py-2 bg-primary text-primary-foreground rounded-full font-bold shadow-sm hover:shadow-md hover:bg-primary/90 transition-all"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 lg:gap-8">
            {filteredProducts.map((product) => (
              <ProductCard 
                key={product.id}
                product={product}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
