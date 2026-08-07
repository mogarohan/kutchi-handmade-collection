"use client";

import { Button } from "@/components/ui/button";
import { XCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { cancelOrder } from "@/app/actions/checkout";
import { toast } from "sonner";

export function CancelOrderButton({ orderId }: { orderId: string }) {
  const [isCancelling, setIsCancelling] = useState(false);

  const handleCancel = async () => {
    if (!window.confirm("Are you sure you want to cancel this order? This cannot be undone.")) {
      return;
    }

    setIsCancelling(true);
    try {
      const res = await cancelOrder(orderId);
      if (res.success) {
        toast.success("Order cancelled successfully.");
      } else {
        toast.error("Failed to cancel order: " + res.error);
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <Button 
      variant="destructive" 
      size="sm" 
      className="gap-2"
      onClick={handleCancel}
      disabled={isCancelling}
    >
      {isCancelling ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />}
      Cancel Order
    </Button>
  );
}
