"use client";

import { useEffect, useState, use } from "react";
import { supabase } from "@/lib/supabase";
import { getOrderWithItems, updateOrderStatus, deleteOrder } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, MapPin, User, Phone, Package, Receipt, Trash2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  address: string;
  total_amount: number;
  status: string;
  created_at: string;
  invoice_number?: number;
}

interface OrderItem {
  id: string;
  product_name: string;
  quantity: number;
  price_at_time: number;
}

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const data = await getOrderWithItems(resolvedParams.id);
        if (data) {
          setOrder(data.order as any);
          setItems(data.items as any);
        } else {
          throw new Error("Order not found");
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleStatusChange = async (newStatus: string) => {
    if (!order) return;
    try {
      const res = await updateOrderStatus(order.id, newStatus);
      if (!res.success) throw new Error(res.error);
      setOrder({ ...order, status: newStatus });
      toast.success("Order status updated to " + newStatus);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async () => {
    if (!order) return;
    if (!window.confirm("Are you sure you want to permanently delete this order? This action cannot be undone.")) return;
    
    setIsDeleting(true);
    try {
      const res = await deleteOrder(order.id);
      if (res.success) {
        toast.success("Order deleted successfully");
        router.push("/admin/orders");
      } else {
        throw new Error(res.error);
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Failed to delete order");
      setIsDeleting(false);
    }
  };

  if (!order) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-destructive mb-4">Order Not Found</h2>
        <Button onClick={() => router.push("/admin/orders")}>Back to Orders</Button>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <Link href="/admin/orders" className="text-sm font-medium text-muted-foreground hover:text-primary flex items-center gap-1 mb-4 w-fit">
          <ArrowLeft size={16} /> Back to Orders
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl font-bold text-primary flex items-center gap-3">
              Order Details
              <select 
                value={order.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className={`text-sm font-semibold rounded-full px-3 py-1 border outline-none cursor-pointer ${
                  order.status === 'Pending' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                  order.status === 'Shipped' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                  order.status === 'Cancelled' ? 'bg-red-100 text-red-800 border-red-200' :
                  'bg-green-100 text-green-800 border-green-200'
                }`}
              >
                <option value="Pending">Pending</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </h1>
            <p className="text-muted-foreground mt-1 text-sm font-mono flex items-center gap-2">
              <Receipt size={14} /> 
              Invoice #{order.invoice_number ? order.invoice_number : order.id.split('-')[0].toUpperCase()}
            </p>
          </div>
          <div className="flex gap-2">
            <Link href={`/invoice/${order.id}`} target="_blank">
              <Button className="gap-2" variant="outline">
                <Receipt size={16} /> Print Invoice
              </Button>
            </Link>
            <Button 
              className="gap-2" 
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
              Delete Order
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Customer Details */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold text-lg border-b pb-3 mb-4 flex items-center gap-2">
              <User size={18} className="text-primary" /> Customer Info
            </h3>
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">Name</p>
                <p className="font-medium">{order.customer_name}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1 flex items-center gap-1"><Phone size={14} /> Phone</p>
                <a href={`https://wa.me/${order.customer_phone}`} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">
                  {order.customer_phone}
                </a>
              </div>
              <div>
                <p className="text-muted-foreground mb-1 flex items-center gap-1"><MapPin size={14} /> Delivery Address</p>
                <p className="font-medium whitespace-pre-wrap leading-relaxed bg-muted/30 p-3 rounded-md">{order.address}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Items */}
        <div className="lg:col-span-2">
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold text-lg border-b pb-3 mb-4 flex items-center gap-2">
              <Package size={18} className="text-primary" /> Order Summary
            </h3>
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b border-border/50 last:border-0">
                  <div>
                    <h4 className="font-medium">{item.product_name}</h4>
                    <p className="text-muted-foreground text-sm">₹{item.price_at_time} x {item.quantity}</p>
                  </div>
                  <div className="font-bold">
                    ₹{item.price_at_time * item.quantity}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-muted/30 p-4 rounded-lg flex justify-between items-center text-lg">
              <span className="font-semibold text-muted-foreground">Total Amount Paid</span>
              <span className="font-bold text-primary text-xl">₹{order.total_amount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
