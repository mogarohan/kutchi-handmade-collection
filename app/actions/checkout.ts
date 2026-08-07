"use server";

import { createClient } from "@supabase/supabase-js";
import { getUser } from "@/app/actions/auth";
import { revalidatePath } from "next/cache";

// Use service role key to securely bypass RLS for inserting orders
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
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
  formData: { name: string; phone: string; address: string },
  cartTotal: number,
  items: { name: string; quantity: number; price: number; originalPrice?: number }[]
) {
  try {
    const user = await getUser();
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
        user_id: user?.id || null, // Link to authenticated user if they exist
        invoice_number: invoiceNumber,
      })
      .select()
      .single();

    if (orderError || !order) {
      console.error("Failed to insert order", orderError);
      return { success: false, error: orderError?.message };
    }

    // 2. Save Order Items
    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_name: item.name,
      quantity: item.quantity,
      price_at_time: item.price,
      original_price: item.originalPrice || item.price, // Save original price if provided
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
