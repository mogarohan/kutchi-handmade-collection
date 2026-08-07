import { Plus, Search, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuGroup } from "@/components/ui/dropdown-menu";
import { getProducts, deleteProduct } from "@/app/actions/products";

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-primary">Products</h1>
          <p className="text-muted-foreground mt-1">Manage your jewellery catalog.</p>
        </div>
        <Link href="/admin/products/new">
          <Button className="gap-2">
            <Plus size={16} /> Add Product
          </Button>
        </Link>
      </div>

      <div className="bg-card border rounded-lg shadow-sm">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <Input placeholder="Search products..." className="pl-9 h-9" />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Export CSV</Button>
            <Button variant="outline" size="sm">Filter</Button>
          </div>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Image</TableHead>
              <TableHead>Product Info</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No products found. Click "Add Product" to create one.
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="w-10 h-10 bg-muted rounded-md flex items-center justify-center overflow-hidden">
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xs text-muted-foreground">No img</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-xs text-muted-foreground">Slug: {product.slug}</p>
                  </TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>₹{product.sale_price}</TableCell>
                  <TableCell>
                    {product.stock > 0 ? (
                      <span>{product.stock} in stock</span>
                    ) : (
                      <span className="text-destructive font-medium">Out of stock</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {product.is_active ? (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">Active</Badge>
                    ) : (
                      <Badge variant="secondary" className="text-muted-foreground">Inactive</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger className={buttonVariants({ variant: "ghost", className: "h-8 w-8 p-0" })}>
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuGroup>
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <Link href={`/admin/products/${product.id}/edit`}>
                            <DropdownMenuItem className="cursor-pointer">
                              <Edit className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                          </Link>
                          <Link href={`/product/${product.slug}`} target="_blank">
                            <DropdownMenuItem className="cursor-pointer">
                              <Search className="mr-2 h-4 w-4" /> View Details
                            </DropdownMenuItem>
                          </Link>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <form action={async () => {
                          "use server";
                          await deleteProduct(product.id);
                        }}>
                          <button type="submit" className="w-full flex items-center px-2 py-1.5 text-sm cursor-pointer text-destructive focus:text-destructive hover:bg-muted rounded-sm">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </button>
                        </form>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        
        <div className="p-4 border-t flex items-center justify-between text-sm text-muted-foreground">
          <div>Showing {products.length} products</div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm" disabled>Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
