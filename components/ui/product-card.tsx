"use client";

import Link from "next/link";
import { ShoppingCart, Heart, Eye } from "lucide-react";
import { Button } from "./button";
import { Badge } from "./badge";
import { Card, CardContent } from "./card";
import { useCart } from "@/contexts/cart-context";

interface ProductCardProps {
  product: {
    slug: string;
    name: string;
    original_price: number;
    sale_price: number;
    category: string;
    image_url?: string;
    is_trending?: boolean;
    is_featured?: boolean;
    stock?: number;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const discount = Math.round(((product.original_price - product.sale_price) / product.original_price) * 100);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product.slug,
      name: product.name,
      price: product.sale_price,
      originalPrice: product.original_price,
      quantity: 1,
      image: product.image_url,
      slug: product.slug,
    });
  };

  return (
    <Card className="group relative overflow-hidden rounded-[24px] border-border/50 bg-background transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 flex flex-col h-full">
      {/* Full Card Clickable Link */}
      <Link href={`/product/${product.slug}`} className="absolute inset-0 z-0">
        <span className="sr-only">View {product.name}</span>
      </Link>

      <div className="relative aspect-[4/5] overflow-hidden bg-[#F9F6F0] shrink-0">
        {/* Badges */}
        <div className="absolute left-4 top-4 z-10 flex flex-col gap-2 pointer-events-none">
          {product.is_trending && (
            <Badge className="bg-secondary/90 backdrop-blur-sm text-secondary-foreground">Trending</Badge>
          )}
          {product.is_featured && (
            <Badge className="bg-primary/90 backdrop-blur-sm text-primary-foreground">Featured</Badge>
          )}
          {discount > 0 && (
            <Badge className="bg-destructive/90 backdrop-blur-sm text-destructive-foreground">
              {discount}% OFF
            </Badge>
          )}
        </div>

        {/* Hover Actions */}
        <div className="absolute right-4 top-4 z-20 flex flex-col gap-3 opacity-0 transition-all duration-300 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0">
          <Button size="icon" variant="secondary" className="h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm shadow-md hover:text-primary hover:bg-white hover:scale-110 transition-all relative z-30 pointer-events-auto">
            <Heart size={18} />
          </Button>
        </div>

        {/* Image */}
        <div className="h-full w-full transition-transform duration-700 group-hover:scale-110 flex items-center justify-center pointer-events-none">
           {product.image_url ? (
             <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
           ) : (
             <span className="text-muted-foreground/50 font-medium">No Image</span>
           )}
        </div>
      </div>

      <CardContent className="relative z-10 p-5 md:p-6 flex flex-col flex-1 bg-background pointer-events-none">
        <div className="text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-primary/70">
            {product.category}
          </p>
          <h3 className="line-clamp-1 font-heading text-lg md:text-xl font-bold text-foreground group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <div className="mt-3 flex items-center justify-center gap-3">
            <span className="font-sans text-lg font-semibold text-primary">₹{product.sale_price}</span>
            {product.original_price > 0 && (
              <span className="font-sans text-sm text-muted-foreground line-through">₹{product.original_price}</span>
            )}
          </div>
        </div>

        {/* Action Buttons directly on the card */}
        <div className="mt-auto pt-6 flex gap-2 pointer-events-auto relative z-30">
          <Button 
            className="flex-1 gap-2 rounded-xl h-11 bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-md text-sm md:text-base font-semibold"
            onClick={handleQuickAdd}
          >
            <ShoppingCart size={18} className="shrink-0" />
            Add to Cart
          </Button>
          <Link href={`/product/${product.slug}`} className="shrink-0" onClick={(e) => e.stopPropagation()}>
            <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl hover:bg-primary hover:text-primary-foreground transition-all">
              <Eye size={18} />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
