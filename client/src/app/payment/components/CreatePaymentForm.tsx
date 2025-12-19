"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { BannerSwitch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreatePaymentPayload, PaymentMethod } from "@/types/payment";

interface CreatePaymentFormProps {
  open: boolean;
  onClose: () => void;
  onCreate: (data: CreatePaymentPayload) => void;
}

export default function CreatePaymentForm({
  open,
  onClose,
  onCreate,
}: CreatePaymentFormProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [payKey, setPayKey] = useState("");
  const [accountType, setAccountType] =
    useState<PaymentMethod>("PROMPTPAY");
  const [active, setActive] = useState(false);

  const handleSubmit = () => {
    if (!firstName || !lastName || !payKey) return;

    onCreate({
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      payKey: payKey.trim(),
      payment_method: accountType,
      is_active: active,
    });

    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Create Payment Account</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label className="py-2">First Name</Label>
            <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          </div>

          <div>
            <Label  className="py-2" >Last Name</Label>
            <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </div>

          <div>
            <Label  className="py-2" >Data</Label>
            <Input value={payKey} onChange={(e) => setPayKey(e.target.value)} />
          </div>

          <div>
            <Label  className="py-2">Account Type</Label>
            <Select value={accountType} onValueChange={(v) => setAccountType(v as PaymentMethod)}>
              <SelectTrigger>
                <SelectValue placeholder="SELECT ACCOUNT TYPE" />
              </SelectTrigger>
              <SelectContent side="bottom" align="start">
                <SelectItem value="PROMPTPAY">PROMPTPAY</SelectItem>
                <SelectItem value="BANK">BANK</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-3 py-2" >
            <Label>Active</Label>
            <BannerSwitch checked={active} onCheckedChange={setActive} />
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
