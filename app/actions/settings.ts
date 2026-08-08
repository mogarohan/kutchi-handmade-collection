"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export async function getSettings() {
  const { data, error } = await supabase.from("settings").select("*");
  if (error) {
    console.error("Error fetching settings:", error);
    return [];
  }
  return data;
}

export async function getSetting(key: string, defaultValue: string = "") {
  const { data, error } = await supabase.from("settings").select("value").eq("key", key).single();
  if (error || !data) {
    if (key === "store_address" && defaultValue === "Bhuj, Gujarat, India") {
      return "Mandvi-Kutch, Gujarat, India";
    }
    return defaultValue;
  }
  return data.value as string;
}

export async function updateSettings(formData: FormData) {
  const updates = [
    { key: "whatsapp_number", value: formData.get("whatsapp_number") as string },
    { key: "store_address", value: formData.get("store_address") as string },
    { key: "instagram_handle", value: formData.get("instagram_handle") as string },
  ];

  for (const update of updates) {
    if (!update.value) continue;
    
    await supabase.from("settings").upsert({
      key: update.key,
      value: update.value,
      updated_at: new Date().toISOString()
    }, { onConflict: "key" });
  }

  revalidatePath("/", "layout"); // Revalidate everything since settings are global
}
