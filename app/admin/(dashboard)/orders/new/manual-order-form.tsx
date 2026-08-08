"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Minus, Trash2, Loader2, Search, Tag, Image as ImageIcon, Users } from "lucide-react";
import { submitManualOrder } from "@/app/actions/admin";
import { useRouter } from "next/navigation";
import { toast } from "@/lib/toast";
import { Input } from "@/components/ui/input";

interface Product {
  id: string;
  name: string;
  sale_price: number;
  category: string;
  image_url?: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function ManualOrderForm({ 
  availableProducts, 
  categories 
}: { 
  availableProducts: Product[];
  categories: Category[];
}) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [selectedItems, setSelectedItems] = useState<{ 
    product_id: string; 
    name: string; 
    quantity: number; 
    price: number;
    originalPrice: number;
  }[]>([]);
  
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter products based on search and category
  const filteredProducts = useMemo(() => {
    return availableProducts.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory ? p.category === selectedCategory : true;
      return matchesSearch && matchesCategory;
    });
  }, [availableProducts, searchQuery, selectedCategory]);

  const handleAddProduct = (prod: Product) => {
    if (selectedItems.some(i => i.product_id === prod.id)) {
      // If already added, just increase quantity
      updateQuantity(prod.id, 1);
      return;
    }

    setSelectedItems([...selectedItems, {
      product_id: prod.id,
      name: prod.name,
      quantity: 1,
      price: prod.sale_price,
      originalPrice: prod.sale_price
    }]);
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

  const updatePrice = (product_id: string, newPrice: number) => {
    if (isNaN(newPrice) || newPrice < 0) return;
    setSelectedItems(items => items.map(item => {
      if (item.product_id === product_id) {
        return { ...item, price: newPrice };
      }
      return item;
    }));
  };

  const removeItem = (product_id: string) => {
    setSelectedItems(items => items.filter(item => item.product_id !== product_id));
  };

  const subtotal = selectedItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const finalTotal = Math.max(0, subtotal - discountAmount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedItems.length === 0) {
      toast.error("Please add at least one product.");
      return;
    }

    setIsSubmitting(true);
    
    const res = await submitManualOrder(formData, finalTotal, selectedItems, discountAmount);
    
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
    <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-12 gap-8">
      
      {/* LEFT PANEL: POS Browser (takes up 7 columns) */}
      <div className="xl:col-span-7 flex flex-col h-[800px] bg-card border rounded-2xl overflow-hidden shadow-sm">
        
        {/* Search & Categories Header */}
        <div className="p-4 border-b bg-muted/20 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input 
              placeholder="Search products by name..."
              className="pl-10 h-12 bg-background border-muted text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
            <button
              type="button"
              onClick={() => setSelectedCategory(null)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === null 
                  ? 'bg-primary text-primary-foreground shadow-md' 
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              All Products
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.slug)}
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat.slug 
                    ? 'bg-primary text-primary-foreground shadow-md' 
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto p-4 bg-muted/5">
          {filteredProducts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
              <Search className="w-12 h-12 mb-4 opacity-20" />
              <p>No products found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredProducts.map(prod => (
                <div 
                  key={prod.id}
                  onClick={() => handleAddProduct(prod)}
                  className="group relative bg-background border rounded-xl p-3 cursor-pointer hover:border-primary hover:shadow-md transition-all flex flex-col"
                >
                  <div className="aspect-square rounded-lg bg-muted mb-3 flex items-center justify-center overflow-hidden relative">
                    {prod.image_url ? (
                      <img src={prod.image_url} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-muted-foreground/30" />
                    )}
                    <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Plus className="w-8 h-8 text-primary bg-background rounded-full p-1 shadow-sm" />
                    </div>
                  </div>
                  <h3 className="text-sm font-medium line-clamp-2 leading-tight mb-1">{prod.name}</h3>
                  <div className="mt-auto pt-2 flex items-center justify-between">
                    <span className="font-bold text-primary">₹{prod.sale_price}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PANEL: Cart & Checkout (takes up 5 columns) */}
      <div className="xl:col-span-5 flex flex-col h-[800px] bg-card border rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b bg-muted/20">
          <h2 className="font-semibold text-lg flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-primary" /> Customer Details
          </h2>
          <div className="space-y-3">
            <Input 
              placeholder="Customer Name" 
              required
              className="bg-background"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
            <Input 
              placeholder="Phone Number (+91...)" 
              required
              className="bg-background"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
            <Input 
              placeholder="Shipping Address / Notes" 
              required
              className="bg-background"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
            />
          </div>
        </div>

        <div className="p-4 border-b bg-muted/10">
          <h2 className="font-semibold flex items-center gap-2 text-sm text-muted-foreground uppercase tracking-wider">
            <Tag className="w-4 h-4" /> Order Cart
          </h2>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/5">
          {selectedItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50">
              <p>Cart is empty</p>
              <p className="text-sm">Click products to add them</p>
            </div>
          ) : (
            selectedItems.map(item => (
              <div key={item.product_id} className="bg-background border rounded-xl p-3 shadow-sm flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <span className="font-medium text-sm pr-4 line-clamp-2">{item.name}</span>
                  <button type="button" onClick={() => removeItem(item.product_id)} className="text-red-400 hover:text-red-600 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center border rounded-lg bg-muted/20">
                    <button type="button" onClick={() => updateQuantity(item.product_id, -1)} className="p-2 hover:bg-muted transition-colors"><Minus size={14}/></button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <button type="button" onClick={() => updateQuantity(item.product_id, 1)} className="p-2 hover:bg-muted transition-colors"><Plus size={14}/></button>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-muted-foreground">₹</span>
                    <Input 
                      type="number"
                      value={item.price || ''}
                      onChange={(e) => updatePrice(item.product_id, parseFloat(e.target.value))}
                      className="w-20 h-8 text-right font-bold text-primary"
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Totals & Checkout Form */}
        <div className="p-4 border-t bg-background">
          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">₹{subtotal}</span>
            </div>
            
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground flex items-center gap-1">Discount <Tag className="w-3 h-3"/></span>
              <div className="flex items-center gap-1 w-24">
                <span className="text-muted-foreground">₹</span>
                <Input 
                  type="number"
                  value={discountAmount || ''}
                  onChange={(e) => setDiscountAmount(parseFloat(e.target.value) || 0)}
                  className="h-7 text-right text-red-500 font-medium"
                />
              </div>
            </div>
            
            <div className="pt-3 border-t flex justify-between items-center mb-6">
              <span className="font-bold text-lg">Total</span>
              <span className="font-bold text-2xl text-primary">₹{finalTotal}</span>
            </div>
          </div>

          <Button type="submit" disabled={isSubmitting || selectedItems.length === 0} className="w-full h-12 text-lg font-bold shadow-md hover:shadow-lg transition-all">
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
            {isSubmitting ? "Processing..." : "Create Order & Print Invoice"}
          </Button>
        </div>
      </div>
    </form>
  );
}
