import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingCart, Users, DollarSign, ArrowRight, Plus, ListTree } from "lucide-react";
import Link from "next/link";
import { getProducts } from "@/app/actions/products";
import { getOrders } from "@/app/actions/orders";
import { getCategories } from "@/app/actions/categories";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const products = await getProducts();
  const orders = await getOrders();
  const categories = await getCategories();
  
  const productCount = products.length;
  const orderCount = orders.length;
  const categoryCount = categories.length;

  // Revenue only from Delivered orders
  const totalRevenue = orders
    .filter((order: any) => order.status === "Delivered")
    .reduce((sum: number, order: any) => sum + Number(order.total_amount), 0);

  // Unique customers based on phone number
  const uniqueCustomers = new Set(orders.map((o: any) => o.customer_phone)).size;

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-heading font-bold text-primary">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 lg:grid-cols-3 gap-6">
        <StatCard title="Total Revenue (Delivered)" value={`₹${totalRevenue}`} icon={<DollarSign className="text-muted-foreground" />} href="/admin/revenue" />
        <StatCard title="Total Orders" value={orderCount.toString()} icon={<ShoppingCart className="text-muted-foreground" />} href="/admin/orders" />
        <StatCard title="Products" value={productCount.toString()} icon={<Package className="text-muted-foreground" />} href="/admin/products" addAction="/admin/products/new" />
        <StatCard title="Categories" value={categoryCount.toString()} icon={<ListTree className="text-muted-foreground" />} href="/admin/categories" addAction="/admin/categories/new" />
        <StatCard title="Customers" value={uniqueCustomers.toString()} icon={<Users className="text-muted-foreground" />} href="/admin/customers" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Orders</CardTitle>
            <Link href="/admin/orders">
              <Button variant="ghost" size="sm" className="gap-1">View All <ArrowRight size={16} /></Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center border-2 border-dashed rounded-md">
                <span className="text-muted-foreground">No orders yet</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="pb-3 font-semibold text-muted-foreground">Customer</th>
                      <th className="pb-3 font-semibold text-muted-foreground">Amount</th>
                      <th className="pb-3 font-semibold text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {recentOrders.map((order: any) => (
                      <tr key={order.id} className="group relative hover:bg-muted/30 transition-colors cursor-pointer">
                        <td className="py-3 font-medium">
                          <Link href={`/admin/orders/${order.id}`} className="absolute inset-0" />
                          {order.customer_name}
                        </td>
                        <td className="py-3 font-bold text-primary">₹{order.total_amount}</td>
                        <td className="py-3">
                          <span className={`text-xs font-semibold rounded-full px-2 py-1 border relative z-10 ${
                            order.status === 'Pending' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                            order.status === 'Shipped' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                            order.status === 'Cancelled' ? 'bg-red-100 text-red-800 border-red-200' :
                            'bg-green-100 text-green-800 border-green-200'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            {products.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center border-2 border-dashed rounded-md">
                <span className="text-muted-foreground text-sm">No products found.</span>
              </div>
            ) : (
              <div className="space-y-4">
                {products.slice(0, 5).map((product: any) => (
                  <div key={product.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center overflow-hidden">
                        {product.image_url ? (
                          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <Package size={20} className="text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-sm line-clamp-1">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm text-primary">₹{product.sale_price}</p>
                      <p className="text-[10px] text-muted-foreground">Stock: {product.stock || 0}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, href, addAction }: { title: string; value: string; icon: React.ReactNode; href: string; addAction?: string }) {
  return (
    <Card className="hover:shadow-md transition-all hover:border-primary/50 relative group overflow-hidden">
      <Link href={href} className="absolute inset-0 z-0" />
      <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10 pointer-events-none">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent className="relative z-10 flex items-center justify-between">
        <div className="text-2xl font-bold pointer-events-none">{value}</div>
        {addAction && (
          <Link href={addAction} className="relative z-20 bg-primary/10 text-primary p-2 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors shadow-sm">
            <Plus size={18} />
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
