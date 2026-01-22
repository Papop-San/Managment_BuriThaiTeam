"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Payment Account</DialogTitle>
          <DialogDescription>
            Fill in the information below to create a payment account.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div className="grid gap-4 py-4">
            {/* First Name */}
            <div className="grid gap-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>

            {/* Last Name */}
            <div className="grid gap-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            {/* Pay Key */}
            <div className="grid gap-2">
              <Label htmlFor="payKey">Data</Label>
              <Input
                id="payKey"
                value={payKey}
                onChange={(e) => setPayKey(e.target.value)}
              />
            </div>

            {/* Account Type */}
            <div className="grid gap-2">
              <Label>Account Type</Label>
              <Select
                value={accountType}
                onValueChange={(v) =>
                  setAccountType(v as PaymentMethod)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PROMPTPAY">PROMPTPAY</SelectItem>
                  <SelectItem value="BANK">BANK</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Active */}
            <div className="flex items-center justify-between">
              <Label htmlFor="active">Active</Label>
              <Switch
                id="active"
                checked={active}
                onCheckedChange={setActive}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit">Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
