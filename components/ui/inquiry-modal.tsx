"use client";

import 'react-phone-number-input/style.css'
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input'

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createInquiry } from "@/app/actions/inquiries";
import { Loader2 } from "lucide-react";

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  quantity: number;
  price: number;
  onContinue: (customerName: string, customerPhone: string) => void;
}

export function InquiryModal({ isOpen, onClose, productName, quantity, price, onContinue }: InquiryModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    
    if (!isValidPhoneNumber(phone)) {
      alert("Please enter a valid mobile number.");
      return;
    }

    setIsLoading(true);
    
    // Save to DB
    const productDetails = `${quantity}x ${productName} (₹${price})`;
    await createInquiry(name, phone, productDetails);
    
    setIsLoading(false);
    onClose();
    
    // Proceed to WhatsApp
    onContinue(name, phone);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Complete Your Inquiry</DialogTitle>
          <DialogDescription>
            Please enter your details so we can save your inquiry before redirecting you to WhatsApp.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input 
              id="name" 
              placeholder="John Doe" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 transition-all flex items-center">
              <PhoneInput
                id="phone"
                international
                defaultCountry="IN"
                value={phone}
                onChange={(value) => setPhone(value || "")}
                className="w-full [&_input]:bg-transparent [&_input]:outline-none [&_input]:border-none [&_input]:w-full [&_input]:text-sm"
                required
              />
            </div>
          </div>
          <Button type="submit" className="w-full bg-[#25D366] hover:bg-[#20b858] text-white" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Continue to WhatsApp
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
