"use server";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export async function getCustomers() {
  const customersMap = new Map<string, any>();

  // 1. Fetch Registered Users from Supabase Auth
  try {
    const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
    if (!authError && authData?.users) {
      authData.users.forEach(user => {
        // Skip admin accounts
        if (user.email?.endsWith("@admin.com")) return;
        
        customersMap.set(user.id, {
          id: user.id, // Add ID for the edit action
          name: user.user_metadata?.name || "Registered User",
          username: user.user_metadata?.username || "",
          phone: user.email || "No email",
          total_orders: 0,
          total_spent: 0,
          last_order_date: user.created_at,
          is_registered: true
        });
      });
    }
  } catch (err) {
    console.error("Failed to fetch auth users", err);
  }

  // 2. Fetch Customers from Orders
  const { data: orders, error: ordersError } = await supabase
    .from("orders")
    .select("customer_name, customer_phone, total_amount, created_at, user_id")
    .order("created_at", { ascending: false });

  if (!ordersError && orders) {
    orders.forEach((order) => {
      // If order is linked to a user, use user_id, else use phone as unique key
      const key = order.user_id || order.customer_phone;
      
      if (!customersMap.has(key)) {
        customersMap.set(key, {
          id: key,
          name: order.customer_name,
          username: "",
          phone: order.customer_phone,
          total_orders: 0,
          total_spent: 0,
          last_order_date: order.created_at,
          is_registered: false
        });
      }

      const customer = customersMap.get(key);
      customer.total_orders += 1;
      customer.total_spent += Number(order.total_amount);
      // Update name/phone if missing
      if (customer.name === "Registered User") customer.name = order.customer_name;
    });
  }

  return Array.from(customersMap.values());
}

export async function adminUpdateCustomerCredentials(userId: string, newUsername?: string, newPassword?: string) {
  // We need to use the Service Role Key to update user credentials bypassing normal auth constraints
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return { error: "Service Role Key is not configured. Cannot update credentials." };
  }

  const updates: any = {};
  
  if (newPassword && newPassword.length >= 6) {
    updates.password = newPassword;
  }

  if (newUsername && newUsername.length >= 3) {
    // Generate new dummy email for login
    const dummyEmail = `${newUsername.toLowerCase().trim().replace(/[^a-z0-9_]/g, '')}@kutchi.local`;
    updates.email = dummyEmail;
    // We also need to update user_metadata.username
    // The admin update method merges user_metadata, but let's fetch current to be safe, or just pass it
    updates.user_metadata = { username: newUsername };
  }

  if (Object.keys(updates).length === 0) {
    return { error: "No valid updates provided." };
  }

  const { data, error } = await supabase.auth.admin.updateUserById(userId, updates);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
