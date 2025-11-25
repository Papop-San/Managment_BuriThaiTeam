"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; 
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

interface OrderSelectCellProps {
  value: number;
  maxOrder: number;
  onSubmit: (value: number) => void;
}

export const OrderSelectCell: React.FC<OrderSelectCellProps> = ({
  value,
  maxOrder,
  onSubmit,
}) => {
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<number>(value);

  const handleSubmit = () => {
    onSubmit(selectedValue);
    setOpen(false);
  };

  return (
    <>
      <div
        className="cursor-pointer"
        onDoubleClick={() => setOpen(true)}
      >
        {value}
      </div>

      {/* Dialog / Popup */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-80">
          <DialogHeader>
            <DialogTitle>เลือกลำดับ Banner</DialogTitle>
          </DialogHeader>

          <div className="my-4 flex flex-col gap-2">
            <label htmlFor="order">Order (1 - {maxOrder})</label>
            <Input
              type="number"
              id="order"
              value={selectedValue}
              min={1}
              max={maxOrder}
              onChange={(e) => setSelectedValue(Number(e.target.value))}
            />
          </div>

          <DialogFooter className="flex justify-end gap-2">
          <Button onClick={handleSubmit}>Submit</Button>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
