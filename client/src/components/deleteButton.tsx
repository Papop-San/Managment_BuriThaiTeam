"use client";

import { useState } from "react";
import { LoaderIcon, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteButtonProps {
  endpoint: string;
  ids?: number[];
  confirmMessage?: string;
  disabled?: boolean;
  onSuccess?: () => void;
}

export default function DeleteButton({
  endpoint,
  ids = [],
  confirmMessage = "คุณต้องการลบรายการนี้ใช่ไหม?",
  disabled = false,
  onSuccess,
}: DeleteButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/${endpoint}`, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });

      const text = await res.text();
      const data = text ? JSON.parse(text) : {};
      if (!res.ok) throw new Error(data.message || "Delete failed");

      onSuccess?.();
      setOpen(false); // ปิด Dialog หลังลบ
    } catch (error) {
      console.error(error);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white"
              disabled={disabled || loading}
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogDescription>{confirmMessage}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2">
        <Button onClick={handleDelete} disabled={loading}>
            {loading ? <LoaderIcon className="w-4 h-4 animate-spin" /> : "Delete"}
          </Button>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
