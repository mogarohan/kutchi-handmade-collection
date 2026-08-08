"use client";

import { Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { updateSettings } from "@/app/actions/settings";
import { toast } from "@/lib/toast";
import { useState } from "react";

export function SettingsForm({ 
  whatsappNumber, 
  storeAddress, 
  instagramHandle 
}: { 
  whatsappNumber: string, 
  storeAddress: string, 
  instagramHandle: string 
}) {
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    try {
      await updateSettings(formData);
      toast.success("Settings saved successfully!");
    } catch (error) {
      toast.error("Failed to save settings.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>This information is displayed to customers for placing orders.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="whatsapp_number">WhatsApp Number</Label>
            <input 
              id="whatsapp_number" 
              name="whatsapp_number" 
              defaultValue={whatsappNumber} 
              placeholder="+91..." 
              className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            <p className="text-xs text-muted-foreground">Include the country code (e.g. +91). This is where all orders will be sent.</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="instagram_handle">Instagram Handle</Label>
            <input 
              id="instagram_handle" 
              name="instagram_handle" 
              defaultValue={instagramHandle} 
              placeholder="@username" 
              className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Store Details</CardTitle>
          <CardDescription>Physical store information for invoices and footer.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="store_address">Store Address</Label>
            <input 
              id="store_address" 
              name="store_address" 
              defaultValue={storeAddress} 
              placeholder="Your store address" 
              className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending} className="gap-2">
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save size={16} />}
          {isPending ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </form>
  );
}
