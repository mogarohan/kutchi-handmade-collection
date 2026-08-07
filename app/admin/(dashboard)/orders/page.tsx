"use client";

import { useEffect, useState } from "react";
import { getOrders, updateOrderStatus } from "@/app/actions/admin";
import { Button, buttonVariants } from "@/components/ui/button";
import { Loader2, Receipt, FileText, CheckCircle2 } from "lucide-react";
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
}

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const data = await getOrders();
      setOrders(data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const res = await updateOrderStatus(orderId, newStatus);
      if (!res.success) throw new Error(res.error);
      
      // Update local state
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold text-primary">Orders</h1>
          <p className="text-muted-foreground mt-1">Manage and track all customer orders</p>
        </div>
        <Link href="/admin/orders/new" className={buttonVariants()}>
          Create Manual Order
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center bg-card border border-border rounded-xl p-12 text-center shadow-sm">
          <Receipt className="h-12 w-12 text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-semibold mb-1">No Orders Yet</h3>
          <p className="text-muted-foreground">Orders placed on the website will appear here.</p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 border-b">
                <tr>
                  <th className="px-6 py-4 font-semibold text-muted-foreground">Order Date</th>
                  <th className="px-6 py-4 font-semibold text-muted-foreground">Customer</th>
                  <th className="px-6 py-4 font-semibold text-muted-foreground">Phone</th>
                  <th className="px-6 py-4 font-semibold text-muted-foreground">Total</th>
                  <th className="px-6 py-4 font-semibold text-muted-foreground">Status</th>
                  <th className="px-6 py-4 font-semibold text-muted-foreground text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {orders.map((order) => (
                  <tr 
                    key={order.id} 
                    onClick={() => router.push(`/admin/orders/${order.id}`)}
                    className="hover:bg-muted/30 transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(order.created_at).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                      <div className="text-xs text-muted-foreground">
                        {new Date(order.created_at).toLocaleTimeString('en-IN', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium group-hover:text-primary transition-colors">{order.customer_name}</td>
                    <td className="px-6 py-4 text-muted-foreground">{order.customer_phone}</td>
                    <td className="px-6 py-4 font-bold text-primary">₹{order.total_amount}</td>
                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                      <select 
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`text-xs font-semibold rounded-full px-3 py-1 border outline-none ${
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
                    </td>
                    <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/orders/${order.id}`}>
                          <Button variant="outline" size="sm" className="h-8 gap-1 text-xs">
                            <FileText size={14} /> Details
                          </Button>
                        </Link>
                        <Link href={`/invoice/${order.id}`} target="_blank">
                          <Button variant="secondary" size="sm" className="h-8 gap-1 text-xs">
                            <Receipt size={14} /> Invoice
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
