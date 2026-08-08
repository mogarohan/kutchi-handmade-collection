"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

// Use service role key to securely bypass RLS for admin operations
const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export async function getOrders() {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });
    
  if (error) {
    console.error("Error fetching orders securely:", error);
    return [];
  }
  
  return data;
}

export async function updateOrderStatus(orderId: string, newStatus: string) {
  const { verifyAdmin } = await import("@/lib/auth-utils");
  await verifyAdmin();
  
  const { error } = await supabase
    .from("orders")
    .update({ status: newStatus })
    .eq("id", orderId);

  if (error) {
    console.error("Error updating status:", error);
    return { success: false, error: error.message };
  }
  
  revalidatePath("/admin/orders");
  return { success: true };
}

export async function getInquiries() {
  const { data, error } = await supabase
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false });
    
  if (error) {
    console.error("Error fetching inquiries securely:", error);
    return [];
  }
  
  return data;
}

export async function updateInquiryStatus(inquiryId: string, newStatus: string) {
  const { verifyAdmin } = await import("@/lib/auth-utils");
  await verifyAdmin();
  
  const { error } = await supabase
    .from("inquiries")
    .update({ status: newStatus })
    .eq("id", inquiryId);

  if (error) {
    console.error("Error updating status:", error);
    return { success: false, error: error.message };
  }
  
  revalidatePath("/admin/inquiries");
  return { success: true };
}

export async function getOrderWithItems(orderId: string) {
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .single();

  if (orderError || !order) return null;

  const { data: items } = await supabase
    .from("order_items")
    .select("*, products(image_url)")
    .eq("order_id", orderId);

  const mappedItems = items?.map((item: any) => ({
    ...item,
    product_image: item.products?.image_url || null
  })) || [];

  return { order, items: mappedItems };
}

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

export async function submitManualOrder(
  formData: { name: string; phone: string; address: string },
  cartTotal: number,
  items: { product_id: string; name: string; quantity: number; price: number; originalPrice?: number }[]
) {
  try {
    const { verifyAdmin } = await import("@/lib/auth-utils");
    await verifyAdmin();
    
    const invoiceNumber = await getNextInvoiceNumber();

    // 1. Save Order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_name: formData.name,
        customer_phone: formData.phone,
        address: formData.address,
        total_amount: cartTotal,
        status: "Pending",
        user_id: null, // Manual admin orders are disconnected from user accounts by default
        invoice_number: invoiceNumber,
      })
      .select()
      .single();

    if (orderError || !order) {
      console.error("Failed to insert manual order", orderError);
      return { success: false, error: orderError?.message };
    }

    // 2. Save Order Items
    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.name,
      quantity: item.quantity,
      price_at_time: item.price,
      original_price: item.originalPrice || item.price, // Save original price if provided
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      console.error("Failed to insert manual order items", itemsError);
    }
    
    revalidatePath("/admin/orders");

    return { success: true, orderId: order.id };
  } catch (err) {
    console.error("Manual order action error:", err);
    return { success: false, error: "Server error" };
  }
}

export async function deleteOrder(orderId: string) {
  try {
    const { error } = await supabase
      .from("orders")
      .delete()
      .eq("id", orderId);

    if (error) {
      console.error("Failed to delete order:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/admin/orders");
    return { success: true };
  } catch (err) {
    console.error("Delete order action error:", err);
    return { success: false, error: "Server error" };
  }
}
