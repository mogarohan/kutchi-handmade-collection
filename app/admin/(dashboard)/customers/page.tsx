import { getCustomers } from "@/app/actions/customers";
import { CustomersTable } from "@/components/admin/customers-table";

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  const customers = await getCustomers();

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-primary mb-2">Customers</h1>
          <p className="text-muted-foreground">View and manage your customer directory</p>
        </div>
      </div>

      <CustomersTable customers={customers} />
    </div>
  );
}
