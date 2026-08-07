"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { addCategory } from "@/app/actions/categories";

export default function NewCategoryPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    setError("");

    try {
      const result = await addCategory(formData);
      
      if (result.success) {
        router.push("/admin/categories");
      } else {
        setError(result.error || "Failed to add category");
        setIsSubmitting(false);
      }
    } catch (err) {
      setError("An unexpected error occurred");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/categories">
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ArrowLeft size={16} />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-heading font-bold text-primary">New Category</h1>
          <p className="text-muted-foreground">Add a new category to your store</p>
        </div>
      </div>

      <form action={handleSubmit}>
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Category Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="name">Category Name <span className="text-destructive">*</span></Label>
              <Input id="name" name="name" placeholder="e.g., Necklace" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Category Cover Image</Label>
              <Input id="image" name="image" type="file" accept="image/*" />
              <p className="text-xs text-muted-foreground mt-1">This will be shown on the Categories page.</p>
            </div>

            <div className="pt-4 border-t border-border flex justify-end gap-3">
              <Link href="/admin/categories">
                <Button type="button" variant="outline">Cancel</Button>
              </Link>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Category'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
