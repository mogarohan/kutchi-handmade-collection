import { getUser } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { Receipt, XCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cancelOrder } from "@/app/actions/checkout";
import { CancelOrderButton } from "./cancel-button";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Orders | Kutchi Handmade Collection",
  description: "View and manage your recent orders from Kutchi Handmade Collection.",
};

export const revalidate = 0;

export default async function MyOrdersPage() {
  const user = await getUser();
  
  if (!user) {
    redirect("/"); // Or to a login page, but we'll redirect to home for now
  }

  // Use service role to bypass RLS since we want to fetch the user's specific orders safely from the server
  const supabaseUrl = process.env.SUPABASE_URL || "";
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || "";
  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data: orders, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching user orders:", error);
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl min-h-[60vh]">
      <h1 className="font-heading text-4xl font-bold text-primary mb-10">My Orders</h1>

      {!orders || orders.length === 0 ? (
        <div className="bg-muted/30 p-8 rounded-2xl border text-center flex flex-col items-center justify-center min-h-[300px]">
          <h3 className="text-2xl font-bold font-heading mb-2">No orders found</h3>
          <p className="text-muted-foreground mb-6">You haven't placed any orders yet.</p>
          <Link href="/products">
            <Button size="lg">Start Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order: any) => (
            <div key={order.id} className="bg-background border rounded-2xl overflow-hidden shadow-sm">
              {/* Header */}
              <div className="bg-muted/30 p-4 border-b flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">Order #{order.invoice_number || order.id.split('-')[0].toUpperCase()}</span>
                    <span className={`text-xs font-semibold rounded-full px-2 py-0.5 border ${
                      order.status === 'Pending' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                      order.status === 'Shipped' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                      order.status === 'Cancelled' ? 'bg-red-100 text-red-800 border-red-200' :
                      'bg-green-100 text-green-800 border-green-200'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Placed on {new Date(order.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    })}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <Link href={`/invoice/${order.id}`} target="_blank">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Receipt size={14} /> View Invoice
                    </Button>
                  </Link>
                  {order.status === 'Pending' && (
                    <CancelOrderButton orderId={order.id} />
                  )}
                </div>
              </div>
              
              {/* Body */}
              <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-4">
                  <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider mb-2">Items</h4>
                  {order.order_items.map((item: any) => (
                    <div key={item.id} className="flex justify-between items-center text-sm">
                      <span className="font-medium">{item.product_name} <span className="text-muted-foreground">x{item.quantity}</span></span>
                      <span>₹{item.price_at_time * item.quantity}</span>
                    </div>
                  ))}
                  <div className="pt-4 border-t flex justify-between items-center font-bold">
                    <span>Total Amount</span>
                    <span className="text-primary text-lg">₹{order.total_amount}</span>
                  </div>
                </div>
                
                <div className="md:border-l md:pl-6 space-y-4">
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider mb-2">Delivery Details</h4>
                    <p className="font-medium text-sm">{order.customer_name}</p>
                    <p className="text-sm text-muted-foreground">{order.customer_phone}</p>
                    <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">{order.address}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
