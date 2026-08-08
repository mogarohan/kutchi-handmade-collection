import { getUser } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { Package, Truck, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { LogoutButton } from "./logout-button";

// Secure server fetch using Service Key
const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || "";
const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

export default async function AccountPage() {
  const user = await getUser();
  
  if (!user) {
    redirect("/"); // Redirect to home if not logged in
  }

  // Fetch orders for this specific user
  const { data: orders, error } = await supabaseAdmin
    .from("orders")
    .select("*, order_items(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold text-primary">My Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back, {user.user_metadata?.name || user.email}</p>
        </div>
        <LogoutButton />
      </div>

      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <Package className="w-5 h-5" /> My Orders & Tracking
      </h2>

      {!orders || orders.length === 0 ? (
        <div className="bg-muted/30 p-12 rounded-2xl border text-center">
          <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-bold mb-2">No orders yet</h3>
          <p className="text-muted-foreground mb-6">Looks like you haven't placed any orders yet.</p>
          <Link href="/products" className={buttonVariants()}>
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order: any) => (
            <div key={order.id} className="bg-card border rounded-2xl p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b pb-4">
                <div>
                  <p className="font-mono text-sm text-muted-foreground">
                    Invoice #{order.invoice_number ? order.invoice_number : order.id.split('-')[0].toUpperCase()}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Placed on {new Date(order.created_at).toLocaleDateString('en-IN', {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 ${
                    order.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                    order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {order.status === 'Pending' && <AlertCircle className="w-4 h-4" />}
                    {order.status === 'Shipped' && <Truck className="w-4 h-4" />}
                    {order.status === 'Delivered' && <CheckCircle2 className="w-4 h-4" />}
                    {order.status}
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-3 mb-6">
                {order.order_items.map((item: any) => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{item.product_name}</span>
                      <span className="text-muted-foreground">x{item.quantity}</span>
                    </div>
                    <span className="font-medium">₹{item.price_at_time * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <span className="font-semibold text-muted-foreground">Total Amount</span>
                <span className="text-xl font-bold text-primary">₹{order.total_amount}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
