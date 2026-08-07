import { getCategories } from "@/app/actions/categories";
import NewProductForm from "./new-product-form";

export default async function NewProductPage() {
  const categories = await getCategories();
  
  return <NewProductForm categories={categories} />;
}
