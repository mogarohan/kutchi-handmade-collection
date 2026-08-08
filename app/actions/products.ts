"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

// Server-side Supabase client (can bypass RLS if using service role, but anon key is fine for this scope)
const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export async function getProducts(onlyActive = false) {
  let query = supabase.from("products").select("*").order("created_at", { ascending: false });
  if (onlyActive) {
    query = query.eq("is_active", true);
  }
  const { data, error } = await query;
  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }
  return data;
}

export async function getProductBySlug(slug: string) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();
    
  if (error) {
    console.error("Error fetching product:", error);
    return null;
  }
  return data;
}

export async function addProduct(formData: FormData) {
  const { verifyAdmin } = await import("@/lib/auth-utils");
  await verifyAdmin();
  
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const original_price = parseFloat(formData.get("originalPrice") as string);
  const sale_price = parseFloat(formData.get("salePrice") as string);
  const category = formData.get("category") as string;
  const stock = parseInt(formData.get("stock") as string);
  const is_active = formData.get("isActive") === "on";
  const is_featured = formData.get("isFeatured") === "on";
  const is_trending = formData.get("isTrending") === "on";
  
  const availableSizesStr = formData.get("availableSizes") as string;
  const available_sizes = availableSizesStr
    ? availableSizesStr.split(',').map(s => s.trim()).filter(s => s.length > 0)
    : [];
  
  // Generate a simple slug from name (we need this early for folder naming)
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

  // Handle image upload
  const imageFile = formData.get("image") as File | null;
  let image_url = null;
  
  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${slug}/${slug}-main-${Date.now()}.${fileExt}`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(fileName, imageFile);
      
    if (uploadError) {
      console.error("Error uploading main image:", uploadError);
      return { success: false, error: "Failed to upload main image: " + uploadError.message };
    }
    
    const { data: publicUrlData } = supabase.storage
      .from("product-images")
      .getPublicUrl(fileName);
    image_url = publicUrlData.publicUrl;
  }
  
  // Handle gallery uploads
  const galleryFiles = formData.getAll("gallery") as File[];
  const gallery_urls: string[] = [];
  
  let index = 1;
  for (const file of galleryFiles) {
    if (file && file.size > 0) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${slug}/${slug}-gallery-${Date.now()}-${index}.${fileExt}`;
      index++;
      
      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(fileName, file);
        
      if (!uploadError) {
        const { data: publicUrlData } = supabase.storage
          .from("product-images")
          .getPublicUrl(fileName);
        gallery_urls.push(publicUrlData.publicUrl);
      }
    }
  }

  const { error } = await supabase.from("products").insert([
    {
      name,
      slug,
      description,
      original_price,
      sale_price,
      category,
      stock,
      is_active,
      is_featured,
      is_trending,
      available_sizes,
      ...(image_url ? { image_url } : {}),
      ...(gallery_urls.length > 0 ? { gallery_urls } : {})
    }
  ]);

  if (error) {
    console.error("Error inserting product:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath("/");
  
  return { success: true };
}

export async function deleteProduct(id: string) {
  const { verifyAdmin } = await import("@/lib/auth-utils");
  await verifyAdmin();
  
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) {
    console.error("Error deleting product:", error);
    return { success: false };
  }
  revalidatePath("/admin/products");
  revalidatePath("/products");
  return { success: true };
}

export async function getProductById(id: string) {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();
    
  if (error) {
    console.error("Error fetching product by ID:", error);
    return null;
  }
  return data;
}

export async function updateProduct(id: string, formData: FormData) {
  const { verifyAdmin } = await import("@/lib/auth-utils");
  await verifyAdmin();
  
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const original_price = parseFloat(formData.get("originalPrice") as string);
  const sale_price = parseFloat(formData.get("salePrice") as string);
  const category = formData.get("category") as string;
  const stock = parseInt(formData.get("stock") as string);
  const is_active = formData.get("isActive") === "on";
  const is_featured = formData.get("isFeatured") === "on";
  const is_trending = formData.get("isTrending") === "on";
  
  const availableSizesStr = formData.get("availableSizes") as string;
  const available_sizes = availableSizesStr
    ? availableSizesStr.split(',').map(s => s.trim()).filter(s => s.length > 0)
    : [];
  
  // Generate a simple slug from name early
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

  // Handle image upload
  const imageFile = formData.get("image") as File | null;
  let image_url = null;
  
  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${slug}/${slug}-main-${Date.now()}.${fileExt}`;
    
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
  
  // Handle gallery uploads
  const galleryFiles = formData.getAll("gallery") as File[];
  const new_gallery_urls: string[] = [];
  
  let index = 1;
  for (const file of galleryFiles) {
    if (file && file.size > 0) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${slug}/${slug}-gallery-${Date.now()}-${index}.${fileExt}`;
      index++;
      
      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(fileName, file);
        
      if (!uploadError) {
        const { data: publicUrlData } = supabase.storage
          .from("product-images")
          .getPublicUrl(fileName);
        new_gallery_urls.push(publicUrlData.publicUrl);
      }
    }
  }
  
  const updateData: any = {
    name,
    slug,
    description,
    original_price,
    sale_price,
    category,
    stock,
    is_active,
    is_featured,
    is_trending,
    available_sizes,
    ...(image_url ? { image_url } : {})
  };

  // If there are new gallery images, append them to the existing ones
  if (new_gallery_urls.length > 0) {
    // Fetch the existing product to get current gallery_urls
    const { data: currentProduct } = await supabase
      .from("products")
      .select("gallery_urls")
      .eq("id", id)
      .single();
      
    const existingGallery = currentProduct?.gallery_urls || [];
    updateData.gallery_urls = [...existingGallery, ...new_gallery_urls];
  }

  const { error } = await supabase.from("products").update(updateData).eq("id", id);

  if (error) {
    console.error("Error updating product:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath("/");
  revalidatePath(`/product/${slug}`);
  
  return { success: true };
}
