"use client";

import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PaymentSlipImage } from "@/types/order";
import Image from "next/image";

interface SlipCellProps {
  slipImage: PaymentSlipImage | null | undefined;
}

export function SlipCell({ slipImage }: SlipCellProps) {
  if (!slipImage) {
    return <span className="text-gray-400">ไม่มีสลิป</span>;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          ดูสลิป
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>สลิปการชำระเงิน</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <Image
            src={slipImage.url}
            alt="payment slip"
            width={400}
            height={300}
            className="w-full rounded border"
          />

          <div className="text-sm space-y-1">
            <p>
              <b>ชื่อผู้โอน:</b> {slipImage.payer_name_th}
            </p>
            <p>
              <b>จำนวนเงิน:</b> {slipImage.amount}
            </p>
            <p>
              <b>ธนาคาร:</b> {slipImage.bank_name} ({slipImage.bank_code})
            </p>
            <p>
              <b>วันที่โอน:</b>{" "}
              {new Date(slipImage.transferred_at).toLocaleString()}
            </p>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">ปิด</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
