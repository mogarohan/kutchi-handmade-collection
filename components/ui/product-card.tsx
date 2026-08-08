"use client";

import Link from "next/link";
import { ShoppingCart, Heart, Eye, Plus, Minus, Trash2 } from "lucide-react";
import { Button } from "./button";
import { Badge } from "./badge";
import { Card, CardContent } from "./card";
import { useCart } from "@/contexts/cart-context";
import { toast } from "@/lib/toast";

interface ProductCardProps {
  product: {
    id: string;
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
  const { items, addToCart, updateQuantity, removeFromCart, setIsCartOpen } = useCart();
  const discount = Math.round(((product.original_price - product.sale_price) / product.original_price) * 100);

  const cartItem = items.find((item) => item.productId === product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product.slug,
      productId: product.id,
      name: product.name,
      price: product.sale_price,
      originalPrice: product.original_price,
      quantity: 1,
      image: product.image_url,
      slug: product.slug,
    }, false); // Pass false to prevent auto-opening the cart sidebar
    
    toast.success(`${product.name} added to cart`, {
      action: {
        label: "View Cart",
        onClick: () => setIsCartOpen(true),
      },
      cancel: {
        label: "Continue Shopping",
        onClick: () => {},
      }
    });
  };

  const handleUpdateQuantity = (e: React.MouseEvent, delta: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (!cartItem) return;
    
    if (cartItem.quantity + delta < 1) {
      removeFromCart(cartItem.id);
    } else {
      updateQuantity(cartItem.id, cartItem.quantity + delta);
    }
  };

  return (
    <Card className="group relative overflow-hidden rounded-[24px] border-border/50 bg-background transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 flex flex-col h-full">
      {/* Full Card Clickable Link */}
      <Link href={`/product/${product.slug}`} className="absolute inset-0 z-0">
        <span className="sr-only">View {product.name}</span>
      </Link>

      {/* Badges - Moved to Top Left of Card */}
      <div className="absolute left-4 top-4 z-20 flex flex-col gap-1.5 pointer-events-none">
        {product.is_trending && (
          <Badge className="bg-secondary/90 backdrop-blur-sm text-secondary-foreground text-xs shadow-sm">Trending</Badge>
        )}
        {product.is_featured && (
          <Badge className="bg-primary/90 backdrop-blur-sm text-primary-foreground text-xs shadow-sm">Featured</Badge>
        )}
        {discount > 0 && (
          <Badge className="bg-[#D4AF37] backdrop-blur-sm text-white text-xs font-bold shadow-sm border-none">
            {discount}% OFF
          </Badge>
        )}
      </div>

      {/* Hover Actions / Favorite - Moved to Top Right of Card */}
      <div className="absolute right-4 top-4 z-20 opacity-0 transition-all duration-300 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0">
        <Button size="icon" variant="secondary" className="h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm shadow-md hover:bg-white hover:scale-110 transition-all relative z-30 pointer-events-auto">
          <Heart size={18} className="text-primary fill-primary/10" />
        </Button>
      </div>

      <div className="relative aspect-square w-full max-w-[200px] mx-auto mt-6 overflow-hidden bg-[#F9F6F0] shrink-0 rounded-full border-[6px] border-primary shadow-xl group-hover:border-primary/80 transition-colors duration-500">

        {/* Image */}
        <div className="h-full w-full transition-transform duration-700 group-hover:scale-110 flex items-center justify-center pointer-events-none">
           {product.image_url ? (
             <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
           ) : (
             <span className="text-muted-foreground/50 font-medium">No Image</span>
           )}
        </div>
      </div>

      <CardContent className="relative z-10 p-3 sm:p-5 md:p-6 flex flex-col flex-1 bg-background pointer-events-none">
        <div className="text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-primary/70">
            {product.category}
          </p>
          <h3 className="line-clamp-1 font-heading text-lg md:text-xl font-bold text-foreground group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <div className="mt-3 flex items-center justify-center gap-3">
            <span className="font-sans text-base sm:text-lg font-semibold text-primary">₹{product.sale_price}</span>
            {product.original_price > 0 && (
              <span className="font-sans text-sm text-muted-foreground line-through">₹{product.original_price}</span>
            )}
          </div>
        </div>

        {/* Action Buttons directly on the card */}
        <div className="mt-auto pt-4 sm:pt-6 flex gap-2 pointer-events-auto relative z-30">
          {cartItem ? (
            <div className="flex-1 flex items-center justify-between border-2 border-primary rounded-xl h-9 sm:h-11 px-1 bg-primary/5">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-full w-10 text-primary hover:bg-primary/10 rounded-lg"
                onClick={(e) => handleUpdateQuantity(e, -1)}
              >
                {cartItem.quantity === 1 ? <Trash2 size={16} /> : <Minus size={16} />}
              </Button>
              <span className="font-bold text-primary font-sans">
                {cartItem.quantity}
              </span>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-full w-10 text-primary hover:bg-primary/10 rounded-lg"
                onClick={(e) => handleUpdateQuantity(e, 1)}
              >
                <Plus size={16} />
              </Button>
            </div>
          ) : (
            <Button 
              className="flex-1 gap-1.5 sm:gap-2 rounded-xl h-9 sm:h-11 px-2 sm:px-4 bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-md text-xs sm:text-sm md:text-base font-semibold"
              onClick={handleQuickAdd}
            >
              <ShoppingCart size={16} className="shrink-0 sm:w-[18px] sm:h-[18px]" />
              Add to Cart
            </Button>
          )}
          <Link href={`/product/${product.slug}`} className="shrink-0 hidden sm:block" onClick={(e) => e.stopPropagation()}>
            <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl hover:bg-primary hover:text-primary-foreground transition-all">
              <Eye size={18} />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
