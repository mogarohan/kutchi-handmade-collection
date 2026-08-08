"use client";

import 'react-phone-number-input/style.css'
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input'
import { useCart } from "@/contexts/cart-context";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { submitOrder } from "@/app/actions/checkout";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { AuthModal } from "@/components/auth/auth-modal";

export default function CheckoutClient({ whatsappNumber, user }: { whatsappNumber: string, user: any }) {
  const { items, cartTotal, cartOriginalTotal, clearCart } = useCart();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: user?.user_metadata?.name || "",
    phone: "",
    address: "",
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const WHATSAPP_NUMBER = whatsappNumber; // Dynamically from DB

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center max-w-md">
        <h1 className="text-2xl font-bold font-heading mb-4">Your cart is empty</h1>
        <p className="text-muted-foreground mb-8">Add some beautiful Kutchi items to your cart to proceed.</p>
        <Button onClick={() => router.push("/products")}>Browse Products</Button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.phone || !isValidPhoneNumber(formData.phone)) {
      toast.error("Please enter a valid mobile number.");
      return;
    }
    
    setIsSubmitting(true);

    try {
      // 1. Save Order securely via Server Action
      await submitOrder(formData, cartTotal, items);
      toast.success("Order logged! Redirecting to WhatsApp...");
    } catch (error) {
      console.error("Unexpected error saving to database via Server Action:", error);
      toast.error("An error occurred while saving your order.");
    }

      // 3. Construct WhatsApp Message
      let message = `*New Order Placed!*\n\n`;
      message += `*Customer Details:*\n`;
      message += `Name: ${formData.name}\n`;
      message += `Phone: ${formData.phone}\n`;
      message += `Address: ${formData.address}\n\n`;
      
      message += `*Order Summary:*\n`;
      items.forEach((item, index) => {
        const sizeText = item.size ? ` (Size: ${item.size})` : "";
        message += `${index + 1}. ${item.name}${sizeText} (x${item.quantity}) - ₹${item.price * item.quantity}\n`;
      });
      message += `\n*Total Amount:* ₹${cartTotal}`;
      
      if (formData.notes) {
        message += `\n\n*Notes/Special Instructions:*\n${formData.notes}`;
      }

      // 4. Redirect to WhatsApp
      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
      
      // Clear cart
      clearCart();

      // Send them to WhatsApp in the same tab (avoids popup blockers after async await)
      window.location.href = whatsappUrl;

      setIsSubmitting(false);
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <h1 className="font-heading text-4xl font-bold text-primary mb-10">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Column: Form or Login Prompt */}
        <div>
          <h2 className="text-xl font-semibold mb-6">Delivery Details</h2>
          
          {!user ? (
            <div className="bg-muted/30 p-8 rounded-2xl border text-center flex flex-col items-center justify-center min-h-[300px]">
              <h3 className="text-2xl font-bold font-heading mb-2">Login Required</h3>
              <p className="text-muted-foreground mb-6">
                Please log in or create an account to securely place your order and track it.
              </p>
              <Button size="lg" onClick={() => setShowAuthModal(true)}>
                Login to Checkout
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">Full Name</label>
                <input 
                  id="name"
                  type="text" 
                  required
                  className="w-full h-12 px-4 rounded-md border border-input bg-background outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-2">Phone Number</label>
                <div className="w-full h-12 px-4 rounded-md border border-input bg-background focus-within:ring-2 focus-within:ring-primary/50 transition-all flex items-center">
                  <PhoneInput
                    id="phone"
                    international
                    defaultCountry="IN"
                    value={formData.phone}
                    onChange={(value) => setFormData({...formData, phone: value || ""})}
                    className="w-full [&_input]:bg-transparent [&_input]:outline-none [&_input]:border-none [&_input]:w-full"
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">Select your country code if you are outside India.</p>
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium mb-2">Full Delivery Address</label>
                <textarea 
                  id="address"
                  required
                  rows={4}
                  className="w-full p-4 rounded-md border border-input bg-background outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                />
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium mb-2">Order Notes / Special Instructions (Optional)</label>
                <textarea 
                  id="notes"
                  rows={3}
                  placeholder="Any specific requests? Size customizations?"
                  className="w-full p-4 rounded-md border border-input bg-background outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                />
              </div>

              <Button type="submit" className="w-full h-12 text-lg" disabled={isSubmitting}>
                {isSubmitting ? (
                  <><Loader2 className="mr-2 animate-spin" /> Processing...</>
                ) : (
                  "Place Order on WhatsApp"
                )}
              </Button>
              <p className="text-xs text-muted-foreground text-center mt-4">
                By placing this order, your details will be saved securely and you will be redirected to WhatsApp to confirm with our team.
              </p>
            </form>
          )}
        </div>

        {/* Right Column: Order Summary */}
        <div className="bg-muted/30 p-8 rounded-2xl border">
          <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
          <div className="space-y-4 mb-6">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4">
                <div className="h-16 w-16 bg-muted rounded-md overflow-hidden shrink-0">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full bg-muted" />
                  )}
                </div>
                <div className="flex-1 flex justify-between">
                  <div>
                    <h4 className="font-semibold text-sm line-clamp-2">{item.name}</h4>
                    {item.size && (
                      <p className="text-muted-foreground text-xs mt-1">Size: {item.size}</p>
                    )}
                    <p className="text-muted-foreground text-sm mt-1">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">₹{item.price * item.quantity}</div>
                    {item.originalPrice && item.originalPrice > item.price && (
                      <div className="text-xs text-muted-foreground line-through">₹{item.originalPrice * item.quantity}</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="border-t pt-4 space-y-2">
            {cartOriginalTotal > cartTotal && (
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>Total MRP</span>
                <span className="line-through">₹{cartOriginalTotal}</span>
              </div>
            )}
            {cartOriginalTotal > cartTotal && (
              <div className="flex justify-between items-center text-sm text-green-600 font-medium">
                <span>Discount on MRP</span>
                <span>- ₹{cartOriginalTotal - cartTotal}</span>
              </div>
            )}
            <div className="flex justify-between items-center text-sm text-muted-foreground pt-2">
              <span>Shipping</span>
              <span>Calculated on WhatsApp</span>
            </div>
            <div className="flex justify-between items-center text-xl font-bold text-primary pt-2 border-t border-border/50">
              <span>Total Amount</span>
              <span>₹{cartTotal}</span>
            </div>
          </div>
        </div>
      </div>
      
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        onSuccess={() => {
          window.location.reload(); // Quickest way to refresh session in server component
        }} 
      />
    </div>
  );
}
