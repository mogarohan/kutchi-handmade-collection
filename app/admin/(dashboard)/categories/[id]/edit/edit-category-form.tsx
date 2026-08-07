"use client";

import { useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateCategory } from "@/app/actions/categories";

export default function EditCategoryForm({ category }: { category: any }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const result = await updateCategory(category.id, formData);
    
    setIsSubmitting(false);
    
    if (result.success) {
      router.push("/admin/categories");
    } else {
      alert("Error updating category: " + result.error);
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      <form onSubmit={handleSubmit}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/admin/categories">
              <Button variant="outline" size="icon" className="h-9 w-9" type="button">
                <ArrowLeft size={16} />
              </Button>
            </Link>
            <h1 className="text-3xl font-heading font-bold text-primary">Edit Category</h1>
          </div>
          <div className="flex gap-4">
            <Link href="/admin/categories">
              <Button variant="outline" type="button">Cancel</Button>
            </Link>
            <Button className="gap-2" type="submit" disabled={isSubmitting}>
              <Save size={16} /> {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Category Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Category Name *</Label>
              <Input id="name" name="name" required defaultValue={category.name} placeholder="e.g. Necklaces" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="image">Category Image</Label>
              {category.image_url && (
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground mb-2">Current Image:</p>
                  <img src={category.image_url} alt={category.name} className="w-32 h-32 object-cover rounded-md border" />
                </div>
              )}
              <Input id="image" name="image" type="file" accept="image/*" />
              <p className="text-xs text-muted-foreground mt-1">Leave empty to keep the current image.</p>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
