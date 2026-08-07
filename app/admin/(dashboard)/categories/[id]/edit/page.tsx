import { getCategoryById } from "@/app/actions/categories";
import EditCategoryForm from "./edit-category-form";
import { notFound } from "next/navigation";

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const category = await getCategoryById(resolvedParams.id);
  
  if (!category) {
    notFound();
  }
  
  return <EditCategoryForm category={category} />;
}
