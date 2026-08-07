import { getProductById } from "@/app/actions/products";
import { getCategories } from "@/app/actions/categories";
import EditProductForm from "./edit-form";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductById(id);
  const categories = await getCategories();

  if (!product) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-destructive">Product Not Found</h1>
        <p className="text-muted-foreground mt-2">The product you are trying to edit does not exist.</p>
      </div>
    );
  }

  return <EditProductForm product={product} categories={categories} />;
}
