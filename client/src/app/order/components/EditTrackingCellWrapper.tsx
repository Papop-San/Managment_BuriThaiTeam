"use client";

import React, { useState } from "react";
import { OrderInterface } from "@/types/order";
import { EditTrackingCell } from "./trackingCell";

type Props = {
  row: { original: OrderInterface };
  onValueChange?: (newStatus: string) => void;
};

export function EditableTrackingWrapper({ row, onValueChange }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const value = row.original.tracking_number;
  const orderId = Number(row.original.sku.split("-")[1]);

  const handleSave = async (newValue: string) => {
    if (newValue === value) return; 

    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/order-management/${orderId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ tracking_number: newValue }),
        }
      );

      if (!res.ok) throw new Error("Update failed");

      if (onValueChange) onValueChange(newValue);
      console.log("Tracking updated:", newValue);
    } catch (err) {
      console.error(err);
      setError("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <EditTrackingCell
        value={value}
        onSave={handleSave}
        disabled={loading}
      />
      {error && <span className="text-red-500 text-xs">{error}</span>}
    </div>
  );
}
