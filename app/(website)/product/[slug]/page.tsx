import { AlertCircle } from "lucide-react";
import { getProductBySlug } from "@/app/actions/products";
import { getSetting } from "@/app/actions/settings";
import ProductView from "./product-view";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found | Kutchi Handmade Collection",
    };
  }

  return {
    title: `${product.name} | Kutchi Handmade Collection`,
    description: product.description || `Buy ${product.name} at Kutchi Handmade Collection. Premium mirror work jewellery.`,
  };
}

export default async function ProductDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  const whatsappNumberSetting = await getSetting("whatsapp_number", "919313225740");

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">Product Not Found</h1>
        <p className="text-muted-foreground">The product you are looking for does not exist or has been removed.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <ProductView 
        product={product} 
        whatsappNumberSetting={whatsappNumberSetting} 
      />
    </div>
  );
}
