"use server";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export async function getCustomers() {
  // We don't have a dedicated customers table, so we aggregate from orders
  const { data: orders, error } = await supabase
    .from("orders")
    .select("customer_name, customer_phone, total_amount, created_at")
    .order("created_at", { ascending: false });

  if (error || !orders) {
    console.error("Error fetching customers from orders:", error);
    return [];
  }

  // Aggregate by phone number
  const customersMap = new Map<string, any>();

  orders.forEach((order) => {
    const phone = order.customer_phone;
    if (!customersMap.has(phone)) {
      customersMap.set(phone, {
        name: order.customer_name,
        phone: phone,
        total_orders: 0,
        total_spent: 0,
        last_order_date: order.created_at, // Since it's ordered by created_at desc, the first one seen is the latest
      });
    }

    const customer = customersMap.get(phone);
    customer.total_orders += 1;
    customer.total_spent += Number(order.total_amount);
  });

  return Array.from(customersMap.values());
}
