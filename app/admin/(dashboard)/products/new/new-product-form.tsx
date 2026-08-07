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
import { addProduct } from "@/app/actions/products";

export default function NewProductForm({ categories = [] }: { categories: any[] }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isTrending, setIsTrending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const result = await addProduct(formData);
    
    setIsSubmitting(false);
    
    if (result.success) {
      router.push("/admin/products");
    } else {
      alert("Error adding product: " + result.error);
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
            <h1 className="text-3xl font-heading font-bold text-primary">Add New Product</h1>
          </div>
          <div className="flex gap-4">
            <Link href="/admin/products">
              <Button variant="outline" type="button">Cancel</Button>
            </Link>
            <Button className="gap-2" type="submit" disabled={isSubmitting}>
              <Save size={16} /> {isSubmitting ? "Saving..." : "Save Product"}
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
                  <Input id="name" name="name" required placeholder="e.g. Kutchi Mirror Necklace" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" placeholder="Write a detailed product description..." className="min-h-[150px]" />
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
                  <Input id="image" name="image" type="file" accept="image/*" />
                  <p className="text-xs text-muted-foreground mt-1">This will be the primary image shown on the website.</p>
                </div>
                
                <div className="space-y-2 pt-4 border-t border-border">
                  <Label htmlFor="gallery">Side Images (Gallery)</Label>
                  <Input id="gallery" name="gallery" type="file" accept="image/*" multiple />
                  <p className="text-xs text-muted-foreground mt-1">Select multiple images to show in the product gallery.</p>
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
                    <Input id="salePrice" name="salePrice" type="number" required placeholder="999" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="originalPrice">Original Price (₹) *</Label>
                    <Input id="originalPrice" name="originalPrice" type="number" required placeholder="1299" />
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
                  <Switch id="isActive" checked={isActive} onCheckedChange={setIsActive} />
                  <input type="hidden" name="isActive" value={isActive ? "on" : "off"} />
                </div>
                
                <div className="space-y-4 pt-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="isFeatured">Featured Product</Label>
                    <Switch id="isFeatured" checked={isFeatured} onCheckedChange={setIsFeatured} />
                    <input type="hidden" name="isFeatured" value={isFeatured ? "on" : "off"} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="isTrending">Trending</Label>
                    <Switch id="isTrending" checked={isTrending} onCheckedChange={setIsTrending} />
                    <input type="hidden" name="isTrending" value={isTrending ? "on" : "off"} />
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
                  <select id="category" name="category" required className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
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
                  <Input id="stock" name="stock" type="number" required defaultValue="10" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
