"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export async function getCategories() {
  const { data, error } = await supabase.from("categories").select("*").order("created_at", { ascending: false });
  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
  return data;
}

export async function addCategory(formData: FormData) {
  const { verifyAdmin } = await import("@/lib/auth-utils");
  await verifyAdmin();
  
  const name = formData.get("name") as string;
  
  // Generate a simple slug from name
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

  // Handle image upload
  const imageFile = formData.get("image") as File | null;
  let image_url = null;
  
  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `categories/${slug}-${Date.now()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(fileName, imageFile);
      
    if (!uploadError) {
      const { data: publicUrlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(fileName);
      image_url = publicUrlData.publicUrl;
    } else {
      console.error("Error uploading category image:", uploadError);
      return { success: false, error: "Failed to upload image: " + uploadError.message };
    }
  }

  const { error } = await supabase.from("categories").insert([
    {
      name,
      slug,
      ...(image_url ? { image_url } : {})
    }
  ]);

  if (error) {
    console.error("Error inserting category:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/admin/products/new");
  revalidatePath("/categories");
  revalidatePath("/");
  
  return { success: true };
}

export async function deleteCategory(id: string) {
  const { verifyAdmin } = await import("@/lib/auth-utils");
  await verifyAdmin();
  
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) {
    console.error("Error deleting category:", error);
    return { success: false };
  }
  revalidatePath("/admin/categories");
  revalidatePath("/categories");
  return { success: true };
}

export async function getCategoryById(id: string) {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("id", id)
    .single();
    
  if (error) {
    console.error("Error fetching category:", error);
    return null;
  }
  return data;
}

export async function updateCategory(id: string, formData: FormData) {
  const { verifyAdmin } = await import("@/lib/auth-utils");
  await verifyAdmin();
  
  const name = formData.get("name") as string;
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

  const imageFile = formData.get("image") as File | null;
  let image_url = null;
  
  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `categories/${slug}-${Date.now()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(fileName, imageFile);
      
    if (!uploadError) {
      const { data: publicUrlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(fileName);
      image_url = publicUrlData.publicUrl;
    }
  }

  const updateData: any = { name, slug };
  if (image_url) updateData.image_url = image_url;

  const { error } = await supabase.from("categories").update(updateData).eq("id", id);

  if (error) {
    console.error("Error updating category:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/admin/products/new");
  revalidatePath("/categories");
  revalidatePath("/");
  
  return { success: true };
}
