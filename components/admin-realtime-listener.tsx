"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { toast } from "sonner";

// Use NEXT_PUBLIC for client-side listener.
// Note: We use the anon key since it's just listening for events. RLS will protect data if needed.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || "";

const supabase = createClient(supabaseUrl, supabaseKey);

export function AdminRealtimeListener() {
  const router = useRouter();

  useEffect(() => {
    // Subscribe to Orders
    const ordersSubscription = supabase
      .channel('public:orders')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, payload => {
        toast.success(`New order received from ${payload.new.customer_name || 'a customer'}!`);
        router.refresh();
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders' }, payload => {
        toast.info(`Order #${payload.new.invoice_number || payload.new.id.split('-')[0]} was updated.`);
        router.refresh();
      })
      .subscribe();

    // Subscribe to Inquiries
    const inquiriesSubscription = supabase
      .channel('public:inquiries')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'inquiries' }, payload => {
        toast.success("New inquiry received!");
        router.refresh();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(ordersSubscription);
      supabase.removeChannel(inquiriesSubscription);
    };
  }, [router]);

  return null; // This component doesn't render anything visually
}
