"use client";

import { useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateProduct } from "@/app/actions/products";

export default function EditProductForm({ product, categories = [] }: { product: any, categories: any[] }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const result = await updateProduct(product.id, formData);
    
    setIsSubmitting(false);
    
    if (result.success) {
      router.push("/admin/products");
    } else {
      alert("Error updating product: " + result.error);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <form onSubmit={handleSubmit}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/admin/products">
              <Button variant="outline" size="icon" className="h-9 w-9" type="button">
                <ArrowLeft size={16} />
              </Button>
            </Link>
            <h1 className="text-3xl font-heading font-bold text-primary">Edit Product</h1>
          </div>
          <div className="flex gap-4">
            <Link href="/admin/products">
              <Button variant="outline" type="button">Cancel</Button>
            </Link>
            <Button className="gap-2" type="submit" disabled={isSubmitting}>
              <Save size={16} /> {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input id="name" name="name" required defaultValue={product.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" defaultValue={product.description} className="min-h-[150px]" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Product Image</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="image">Main Image</Label>
                  {product.image_url && (
                    <div className="mb-4">
                      <img src={product.image_url} alt={product.name} className="w-32 h-32 object-cover rounded-md border" />
                    </div>
                  )}
                  <Input id="image" name="image" type="file" accept="image/*" />
                  <p className="text-xs text-muted-foreground mt-1">Leave empty to keep current main image.</p>
                </div>
                
                <div className="space-y-2 pt-4 border-t border-border">
                  <Label htmlFor="gallery">Side Images (Gallery)</Label>
                  {product.gallery_urls && product.gallery_urls.length > 0 && (
                    <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                      {product.gallery_urls.map((url: string, index: number) => (
                        <img key={index} src={url} alt={`Gallery ${index}`} className="w-20 h-20 object-cover rounded-md border shrink-0" />
                      ))}
                    </div>
                  )}
                  <Input id="gallery" name="gallery" type="file" accept="image/*" multiple />
                  <p className="text-xs text-muted-foreground mt-1">Selecting new side images will ADD to the existing gallery.</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="salePrice">Sale Price (₹) *</Label>
                    <Input id="salePrice" name="salePrice" type="number" required defaultValue={product.sale_price} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="originalPrice">Original Price (₹) *</Label>
                    <Input id="originalPrice" name="originalPrice" type="number" required defaultValue={product.original_price} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Organization & Status */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Status & Visibility</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base" htmlFor="isActive">Active</Label>
                    <p className="text-sm text-muted-foreground">Show product on website</p>
                  </div>
                  <Switch id="isActive" name="isActive" defaultChecked={product.is_active} value="on" />
                </div>
                
                <div className="space-y-4 pt-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="isFeatured">Featured Product</Label>
                    <Switch id="isFeatured" name="isFeatured" defaultChecked={product.is_featured} value="on" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="isTrending">Trending</Label>
                    <Switch id="isTrending" name="isTrending" defaultChecked={product.is_trending} value="on" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Organization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <select id="category" name="category" required defaultValue={product.category} className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                    {categories.length === 0 ? (
                      <option value="">No categories available</option>
                    ) : (
                      categories.map((cat) => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))
                    )}
                  </select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Inventory</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="stock">Available Stock *</Label>
                  <Input id="stock" name="stock" type="number" required defaultValue={product.stock} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
