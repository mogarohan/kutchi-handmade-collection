"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Minus, Trash2, Loader2, ArrowRight } from "lucide-react";
import { submitManualOrder } from "@/app/actions/admin";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  sale_price: number;
}

export default function ManualOrderForm({ availableProducts }: { availableProducts: Product[] }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });
  
  const [selectedItems, setSelectedItems] = useState<{ product_id: string; name: string; quantity: number; price: number }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddProduct = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const pId = e.target.value;
    if (!pId) return;
    
    const prod = availableProducts.find(p => p.id === pId);
    if (!prod) return;
    
    if (selectedItems.some(i => i.product_id === pId)) return; // already added

    setSelectedItems([...selectedItems, {
      product_id: prod.id,
      name: prod.name,
      quantity: 1,
      price: prod.sale_price,
    }]);
    
    e.target.value = ""; // reset select
  };

  const updateQuantity = (product_id: string, delta: number) => {
    setSelectedItems(items => items.map(item => {
      if (item.product_id === product_id) {
        const newQ = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQ };
      }
      return item;
    }));
  };

  const removeItem = (product_id: string) => {
    setSelectedItems(items => items.filter(item => item.product_id !== product_id));
  };

  const total = selectedItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedItems.length === 0) {
      toast.error("Please add at least one product.");
      return;
    }

    setIsSubmitting(true);
    
    const res = await submitManualOrder(formData, total, selectedItems);
    
    if (res.success && res.orderId) {
      toast.success("Manual order created successfully!");
      // Open invoice in new tab
      window.open(`/invoice/${res.orderId}`, '_blank');
      // Go back to orders
      router.push("/admin/orders");
    } else {
      toast.error("Error creating order: " + res.error);
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Customer Details */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Customer Details</h2>
        
        <div>
          <label className="block text-sm font-medium mb-2">Customer Name</label>
          <input 
            type="text" 
            required
            className="w-full h-11 px-3 rounded-md border bg-background outline-none focus:ring-2 focus:ring-primary/50"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Phone Number</label>
          <input 
            type="text" 
            required
            placeholder="+91..."
            className="w-full h-11 px-3 rounded-md border bg-background outline-none focus:ring-2 focus:ring-primary/50"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Address</label>
          <textarea 
            required
            rows={3}
            className="w-full p-3 rounded-md border bg-background outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            value={formData.address}
            onChange={(e) => setFormData({...formData, address: e.target.value})}
          />
        </div>
      </div>

      {/* Order Builder */}
      <div className="bg-muted/30 p-6 rounded-2xl border">
        <h2 className="text-xl font-semibold mb-6">Select Products</h2>
        
        <select 
          className="w-full h-11 px-3 mb-6 rounded-md border bg-background outline-none focus:ring-2 focus:ring-primary/50"
          onChange={handleAddProduct}
          defaultValue=""
        >
          <option value="" disabled>-- Choose a product to add --</option>
          {availableProducts.map(p => (
            <option key={p.id} value={p.id}>{p.name} (₹{p.sale_price})</option>
          ))}
        </select>

        <div className="space-y-4 mb-6">
          {selectedItems.map(item => (
            <div key={item.product_id} className="flex justify-between items-center bg-background p-3 rounded-md border">
              <div className="flex-1">
                <p className="font-medium text-sm line-clamp-1">{item.name}</p>
                <p className="text-xs text-muted-foreground mt-1">₹{item.price} x {item.quantity} = ₹{item.price * item.quantity}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center border rounded-md">
                  <button type="button" onClick={() => updateQuantity(item.product_id, -1)} className="p-1.5 hover:bg-muted"><Minus size={14}/></button>
                  <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                  <button type="button" onClick={() => updateQuantity(item.product_id, 1)} className="p-1.5 hover:bg-muted"><Plus size={14}/></button>
                </div>
                <button type="button" onClick={() => removeItem(item.product_id)} className="p-1.5 text-destructive hover:bg-destructive/10 rounded-md">
                  <Trash2 size={16}/>
                </button>
              </div>
            </div>
          ))}
          {selectedItems.length === 0 && (
            <p className="text-sm text-center py-8 text-muted-foreground border-2 border-dashed rounded-md">No products added yet.</p>
          )}
        </div>

        <div className="border-t pt-4 flex justify-between items-center mb-6">
          <span className="font-semibold text-muted-foreground">Total</span>
          <span className="text-2xl font-bold text-primary">₹{total}</span>
        </div>

        <Button type="submit" className="w-full h-12 text-lg gap-2" disabled={isSubmitting || selectedItems.length === 0}>
          {isSubmitting ? <Loader2 className="animate-spin" /> : <><ArrowRight size={20} /> Create & Generate Invoice</>}
        </Button>
      </div>
    </form>
  );
}
