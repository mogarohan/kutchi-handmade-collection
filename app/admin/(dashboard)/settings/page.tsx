import { getSetting } from "@/app/actions/settings";
import { SettingsForm } from "./settings-form";

export default async function SettingsPage() {
  const whatsappNumber = await getSetting("whatsapp_number", "+919313225740");
  const storeAddress = await getSetting("store_address", "Bhuj, Gujarat, India");
  const instagramHandle = await getSetting("instagram_handle", "@kutchi_handmade_collection");

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-primary mb-2">Store Settings</h1>
        <p className="text-muted-foreground">Manage your store's global configuration</p>
      </div>

      <SettingsForm 
        whatsappNumber={whatsappNumber}
        storeAddress={storeAddress}
        instagramHandle={instagramHandle}
      />
    </div>
  );
}
