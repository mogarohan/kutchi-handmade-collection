"use server";

import { createClient } from "@supabase/supabase-js";

// Use service role key to securely bypass RLS for inserting inquiries
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);
export async function createInquiry(
  customerName: string,
  customerPhone: string,
  productDetails: string
) {
  try {
    const { data, error } = await supabase
      .from("inquiries")
      .insert([
        {
          customer_name: customerName,
          customer_phone: customerPhone,
          product_details: productDetails,
        },
      ])
      .select();

    if (error) {
      console.error("Error creating inquiry:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error creating inquiry:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}
