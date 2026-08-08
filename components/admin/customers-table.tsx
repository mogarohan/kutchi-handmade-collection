"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Edit2, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { adminUpdateCustomerCredentials } from "@/app/actions/customers";
import { useRouter } from "next/navigation";

export function CustomersTable({ customers }: { customers: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingCustomer, setEditingCustomer] = useState<any | null>(null);
  
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const router = useRouter();

  const filteredCustomers = customers.filter(c => {
    const term = searchTerm.toLowerCase();
    const name = c.name?.toLowerCase() || "";
    const phone = c.phone?.toLowerCase() || "";
    const username = c.username?.toLowerCase() || "";
    return name.includes(term) || phone.includes(term) || username.includes(term);
  });

  const handleEditClick = (customer: any) => {
    setEditingCustomer(customer);
    setNewUsername(customer.username || "");
    setNewPassword("");
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCustomer) return;
    
    setIsUpdating(true);
    
    try {
      // Only send if they changed something
      const u = newUsername !== editingCustomer.username ? newUsername : undefined;
      const p = newPassword.length >= 6 ? newPassword : undefined;
      
      if (!u && !p) {
        toast.info("No changes made.");
        setEditingCustomer(null);
        setIsUpdating(false);
        return;
      }
      
      const res = await adminUpdateCustomerCredentials(editingCustomer.id, u, p);
      
      if (res.error) throw new Error(res.error);
      
      toast.success("Customer credentials updated successfully!");
      setEditingCustomer(null);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to update customer");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <div className="bg-card border-border rounded-xl shadow-sm border overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between bg-muted/20">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <Input 
              placeholder="Search customers..." 
              className="pl-9 bg-background" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead>Customer Name</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead className="text-center">Total Orders</TableHead>
              <TableHead className="text-right">Lifetime Value</TableHead>
              <TableHead className="text-right">Last Order Date</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  No customers found yet.
                </TableCell>
              </TableRow>
            ) : (
              filteredCustomers.map((customer, idx) => (
                <TableRow key={customer.id || idx}>
                  <TableCell className="font-medium">
                    {customer.name}
                    {customer.is_registered && (
                      <span className="ml-2 inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold text-green-600 border-green-200 bg-green-50">
                        Registered
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {customer.username || <span className="text-muted-foreground italic">Guest</span>}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{customer.phone}</TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex items-center justify-center bg-primary/10 text-primary rounded-full px-2.5 py-0.5 text-xs font-semibold">
                      {customer.total_orders}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-bold text-primary">₹{customer.total_spent}</TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {new Date(customer.last_order_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-center">
                    {customer.is_registered ? (
                      <Button variant="ghost" size="icon" onClick={() => handleEditClick(customer)}>
                        <Edit2 className="w-4 h-4 text-blue-500" />
                      </Button>
                    ) : (
                      <span className="text-xs text-muted-foreground">N/A</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!editingCustomer} onOpenChange={(open) => !open && setEditingCustomer(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Customer Credentials</DialogTitle>
            <DialogDescription>
              Update the username or password for <strong>{editingCustomer?.name}</strong>.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUpdate} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="edit-username">New Username</Label>
              <Input 
                id="edit-username" 
                value={newUsername} 
                onChange={e => setNewUsername(e.target.value)} 
                minLength={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-password">New Password (leave blank to keep current)</Label>
              <Input 
                id="edit-password" 
                type="text" 
                value={newPassword} 
                onChange={e => setNewPassword(e.target.value)} 
                placeholder="Minimum 6 characters"
                minLength={6}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isUpdating}>
              {isUpdating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {isUpdating ? "Updating..." : "Save Changes"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
