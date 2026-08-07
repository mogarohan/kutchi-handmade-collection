"use client";

import { useCart } from "@/contexts/cart-context";
import { Button } from "./button";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
export function CartSidebar() {
  const { isCartOpen, setIsCartOpen, items, updateQuantity, removeFromCart, cartTotal, cartOriginalTotal } = useCart();

  // Prevent scroll when open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />
      <div className="fixed inset-y-0 right-0 z-50 w-full md:w-[400px] bg-background border-l shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-heading text-xl font-bold flex items-center gap-2">
            <ShoppingBag size={20} />
            Your Cart
          </h2>
          <Button variant="ghost" size="icon" onClick={() => setIsCartOpen(false)}>
            <X size={20} />
          </Button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-4">
              <ShoppingBag size={48} className="opacity-20" />
              <p>Your cart is empty.</p>
              <Button onClick={() => setIsCartOpen(false)}>Continue Shopping</Button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 p-2 bg-muted/50 rounded-lg">
                <div className="h-20 w-20 bg-muted rounded-md overflow-hidden shrink-0">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-muted-foreground text-xs">No image</div>
                  )}
                </div>
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <h4 className="font-semibold text-sm line-clamp-1">{item.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-primary font-bold text-sm">₹{item.price}</p>
                      {item.originalPrice && item.originalPrice > item.price && (
                        <p className="text-xs text-muted-foreground line-through">₹{item.originalPrice}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 bg-background border rounded-md">
                      <button 
                        className="p-1 hover:text-primary disabled:opacity-50"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                      <button 
                        className="p-1 hover:text-primary"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <button 
                      className="text-xs text-destructive hover:underline"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 border-t bg-muted/20 space-y-3">
            {cartOriginalTotal > cartTotal && (
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Total MRP:</span>
                <span className="line-through">₹{cartOriginalTotal}</span>
              </div>
            )}
            {cartOriginalTotal > cartTotal && (
              <div className="flex items-center justify-between text-sm text-green-600 font-medium">
                <span>Discount on MRP:</span>
                <span>- ₹{cartOriginalTotal - cartTotal}</span>
              </div>
            )}
            <div className="flex items-center justify-between font-bold text-lg pt-2 border-t border-border/50">
              <span>Total Amount:</span>
              <span className="text-primary">₹{cartTotal}</span>
            </div>
            <Link href="/checkout" onClick={() => setIsCartOpen(false)} className="block pt-2">
              <Button className="w-full h-12 text-lg font-semibold">
                Proceed to Checkout
              </Button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
