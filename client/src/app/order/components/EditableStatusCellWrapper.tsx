"use client";

import React from "react";
import { EditableStatusCell } from "./statusCell";
import { OrderInterface } from "@/types/order";

type Props = {
  row: { original: OrderInterface };
  onValueChange?: (newStatus: OrderInterface["paymentStatus"]) => void;
};

export function EditableStatusCellWrapper({ row }: Props) {
  const orderId = Number(row.original.sku.split("-")[1]);
  const value = row.original.paymentStatus;

  const handleSave = async (newValue: OrderInterface["paymentStatus"]) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order-management/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({  status: newValue }),
      });
      if (!res.ok) throw new Error("Update failed");
      console.log("Updated:", newValue);
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  return (
    <EditableStatusCell
      value={value}
      options={["pending", "confirmed", "checking", "shipped", "completed", "canceled"]}
      colorMap={{
        pending: "bg-yellow-500",
        confirmed: "bg-blue-500",
        checking: "bg-purple-500",
        shipped: "bg-indigo-500",
        completed: "bg-green-600",
        canceled: "bg-red-600",
      }}
      onSave={handleSave}
    />
  );
}
