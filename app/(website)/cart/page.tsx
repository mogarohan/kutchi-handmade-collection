"use client";

import Link from "next/link";
import { Trash2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CartPage() {
  // Dummy cart state for UI presentation
  const cartItems = [
    {
      id: 1,
      name: "Kutch Mirror Choker",
      price: 999,
      quantity: 2,
      image: "",
      category: "Necklace"
    },
    {
      id: 2,
      name: "Navratri Special Bangles",
      price: 599,
      quantity: 1,
      image: "",
      category: "Bangles"
    }
  ];

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="font-heading text-4xl font-bold text-primary mb-8 text-center md:text-left">Shopping Cart</h1>
      
      {cartItems.length > 0 ? (
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Cart Items */}
          <div className="flex-1 space-y-6">
            <div className="hidden md:grid grid-cols-6 gap-4 pb-4 border-b text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              <div className="col-span-3">Product</div>
              <div className="text-center">Price</div>
              <div className="text-center">Quantity</div>
              <div className="text-right">Total</div>
            </div>

            {cartItems.map((item) => (
              <div key={item.id} className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center py-4 border-b">
                <div className="col-span-3 flex items-center gap-4">
                  <div className="w-24 h-24 bg-muted rounded-md flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground">{item.name}</p>
                    <p className="text-sm text-muted-foreground">{item.category}</p>
                    <button className="text-destructive text-sm flex items-center gap-1 mt-2 hover:underline">
                      <Trash2 size={14} /> Remove
                    </button>
                  </div>
                </div>
                <div className="hidden md:block text-center font-medium">₹{item.price}</div>
                <div className="flex items-center justify-center">
                  <div className="flex items-center border border-border rounded-md">
                    <button className="w-8 h-8 flex items-center justify-center hover:bg-muted">-</button>
                    <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                    <button className="w-8 h-8 flex items-center justify-center hover:bg-muted">+</button>
                  </div>
                </div>
                <div className="hidden md:block text-right font-bold text-primary">
                  ₹{item.price * item.quantity}
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="w-full lg:w-96">
            <div className="bg-muted/30 border border-border rounded-2xl p-6">
              <h2 className="font-heading text-xl font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-4 text-sm mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="pt-4 border-t flex justify-between items-center">
                  <span className="font-semibold text-base">Total</span>
                  <span className="font-bold text-2xl text-primary">₹{subtotal}</span>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm text-muted-foreground mb-2">Have a coupon code?</p>
                <div className="flex gap-2">
                  <Input placeholder="Enter Code" className="bg-background" />
                  <Button variant="outline">Apply</Button>
                </div>
              </div>

              <Link href="/checkout">
                <Button className="w-full gap-2 text-lg h-12" size="lg">
                  Proceed to Checkout <ArrowRight size={18} />
                </Button>
              </Link>
              
              <div className="mt-4 text-center">
                <Link href="/products" className="text-sm text-primary hover:underline">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-24">
          <p className="text-muted-foreground mb-4">Your cart is empty.</p>
          <Link href="/products">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
