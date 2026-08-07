"use client";

import { useCart } from "@/contexts/cart-context";
import { ShoppingCart } from "lucide-react";
import { Button } from "./button";

export function CartButton() {
  const { cartCount, setIsCartOpen } = useCart();

  return (
    <Button 
      variant="ghost" 
      className="relative hover:bg-primary/10 transition-colors"
      onClick={() => setIsCartOpen(true)}
    >
      <ShoppingCart size={20} />
      <span className="font-semibold ml-2 hidden sm:inline">Cart</span>
      {cartCount > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-sm animate-in zoom-in">
          {cartCount}
        </span>
      )}
    </Button>
  );
}
