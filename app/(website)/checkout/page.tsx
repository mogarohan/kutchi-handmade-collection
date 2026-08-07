import { getSetting } from "@/app/actions/settings";
import CheckoutClient from "./checkout-client";
import { getUser } from "@/app/actions/auth";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout | Kutchi Handmade Collection",
  description: "Complete your order for premium Kutchi handicrafts securely.",
};

export default async function CheckoutPage() {
  const whatsappNumberSetting = await getSetting("whatsapp_number", "+919313225740");
  const cleanNumber = whatsappNumberSetting.replace(/[^0-9]/g, '');
  const user = await getUser();

  return <CheckoutClient whatsappNumber={cleanNumber} user={user} />;
}
