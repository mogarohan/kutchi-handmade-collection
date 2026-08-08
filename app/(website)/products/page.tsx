import { Filter, SlidersHorizontal, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductCard } from "@/components/ui/product-card";
import { Badge } from "@/components/ui/badge";
import { getProducts } from "@/app/actions/products";
import { getCategories } from "@/app/actions/categories";
import { ProductsClient } from "./products-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Products | Kutchi Handmade Collection",
  description: "Browse our complete collection of premium handmade mirror work creations and accessories from Kutch.",
};

export const dynamic = "force-dynamic";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  
  // Fetch active products from Supabase
  let products = await getProducts(true);

  // Get categories for the filter sidebar
  const categories = await getCategories();

  // Filter by category if present in URL
  if (resolvedSearchParams.category) {
    products = products.filter(
      (product) => {
        const productCategorySlug = product.category?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
        return productCategorySlug === resolvedSearchParams.category;
      }
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <ProductsClient 
        initialProducts={products} 
        categories={categories} 
        initialCategory={resolvedSearchParams.category} 
      />
    </div>
  );
}
