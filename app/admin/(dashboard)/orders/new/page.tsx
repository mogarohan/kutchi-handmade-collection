import { getProducts } from "@/app/actions/products";
import ManualOrderForm from "./manual-order-form";

export const revalidate = 0;

export default async function NewOrderPage() {
  const products = await getProducts();
  
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold font-heading text-primary mb-2">Create Manual Order</h1>
      <p className="text-muted-foreground mb-8">
        Create an order directly for a customer (e.g. from a direct WhatsApp chat). 
        This will bypass the website checkout and instantly generate an invoice.
      </p>
      
      <ManualOrderForm availableProducts={products} />
    </div>
  );
}
