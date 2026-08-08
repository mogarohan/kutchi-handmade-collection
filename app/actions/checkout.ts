"use server";

import { createClient } from "@supabase/supabase-js";
import { getUser } from "@/app/actions/auth";
import { revalidatePath } from "next/cache";

// Use service role key to securely bypass RLS for inserting orders
const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

async function getNextInvoiceNumber() {
  // 1. Get the current highest from settings
  const { data, error } = await supabase
    .from("settings")
    .select("value")
    .eq("key", "last_invoice_number")
    .single();

  let nextNumber = 2600001; // Default start

  if (!error && data && data.value) {
    nextNumber = parseInt(data.value, 10) + 1;
  } else {
    // If setting doesn't exist yet, fallback to checking orders table ONE time to initialize it
    const { data: orderData } = await supabase
      .from("orders")
      .select("invoice_number")
      .order("invoice_number", { ascending: false })
      .limit(1);
      
    if (orderData && orderData.length > 0 && orderData[0].invoice_number) {
      nextNumber = orderData[0].invoice_number + 1;
    }
  }

  // 2. Save the new number back to settings immediately
  await supabase.from("settings").upsert({
    key: "last_invoice_number",
    value: nextNumber.toString(),
    updated_at: new Date().toISOString()
  }, { onConflict: "key" });

  return nextNumber;
}

export async function submitOrder(
  formData: { name: string; phone: string; address: string; notes?: string },
  clientCartTotal: number, // We receive this but will verify it
  items: { productId: string; name: string; quantity: number; price: number; originalPrice?: number; size?: string; image?: string }[]
) {
  try {
    const user = await getUser();
    const invoiceNumber = await getNextInvoiceNumber();

    // Verify prices from the database securely
    let verifiedTotal = 0;
    const verifiedItems = [];

    // Fetch all products involved in this order at once
    const productIds = items.map(item => item.productId);
    const { data: dbProducts, error: dbError } = await supabase
      .from("products")
      .select("id, name, sale_price, original_price")
      .in("id", productIds);

    if (dbError) {
      console.error("Failed to verify products", dbError);
      return { success: false, error: "Product verification failed" };
    }

    const productMap = new Map();
    dbProducts?.forEach(p => productMap.set(p.id, p));

    for (const item of items) {
      const dbProduct = productMap.get(item.productId);
      
      if (!dbProduct) {
        return { success: false, error: `Product not found: ${item.name}` };
      }

      const verifiedPrice = Number(dbProduct.sale_price);
      verifiedTotal += verifiedPrice * item.quantity;

      verifiedItems.push({
        product_id: item.productId,
        product_name: dbProduct.name, // Use DB name to prevent spoofing
        quantity: item.quantity,
        price_at_time: verifiedPrice,
        original_price: Number(dbProduct.original_price) || verifiedPrice,
        size: item.size || null,
        product_image: item.image || null,
      });
    }

    // 1. Save Order using VERIFIED total
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_name: formData.name,
        customer_phone: formData.phone,
        address: formData.address,
        notes: formData.notes || null,
        total_amount: verifiedTotal, // SECURE: Using server-calculated total
        status: "Pending",
        user_id: user?.id || null, 
        invoice_number: invoiceNumber,
      })
      .select()
      .single();

    if (orderError || !order) {
      console.error("Failed to insert order", orderError);
      return { success: false, error: orderError?.message };
    }

    // 2. Save Order Items
    const orderItems = verifiedItems.map(vi => ({
      ...vi,
      order_id: order.id,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      console.error("Failed to insert order items", itemsError);
    }

    return { success: true };
  } catch (err) {
    console.error("Checkout action error:", err);
    return { success: false, error: "Server error" };
  }
}

export async function cancelOrder(orderId: string) {
  try {
    const user = await getUser();
    if (!user) return { success: false, error: "Unauthorized" };

    // Verify order belongs to user
    const { data: order } = await supabase
      .from("orders")
      .select("user_id")
      .eq("id", orderId)
      .single();

    if (!order || order.user_id !== user.id) {
      return { success: false, error: "Unauthorized or order not found" };
    }

    const { error } = await supabase
      .from("orders")
      .update({ status: "Cancelled" })
      .eq("id", orderId);

    if (error) {
      console.error("Cancel error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/my-orders");
    revalidatePath("/admin/orders");
    return { success: true };
  } catch (err) {
    console.error("Cancel action error:", err);
    return { success: false, error: "Server error" };
  }
}
