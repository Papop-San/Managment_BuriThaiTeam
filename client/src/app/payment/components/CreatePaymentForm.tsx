"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { BannerSwitch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreate: (data: {
    name: string;
    data: string;
    account_type: string;
    is_active: boolean;
  }) => void;
}

export default function CreatePaymentForm({ open, onClose, onCreate }: Props) {
  const [name, setName] = useState("");
  const [paymentData, setPaymentData] = useState("");
  const [accountType, setAccountType] = useState("Promptpay");
  const [active, setActive] = useState(false);

  // ❗ State สำหรับ Error message
  const [errors, setErrors] = useState({
    name: "",
    data: "",
  });

  const handleSubmit = () => {
    const newErrors = {
      name: name.trim() === "" ? "กรุณากรอกชื่อบัญชี" : "",
      data: paymentData.trim() === "" ? "กรุณากรอกเบอร์ / เลขบัญชี" : "",
    };

    setErrors(newErrors);

    // ถ้ามี error กลับเลย ไม่ให้ส่ง form
    if (newErrors.name || newErrors.data) return;

    onCreate({
      name,
      data: paymentData,
      account_type: accountType,
      is_active: active,
    });

    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create Payment Account</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Name */}
          <div>
            <Label className="py-2">Name</Label>
            <Input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors({ ...errors, name: "" });
              }}
              placeholder="ชื่อบัญชี"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Data */}
          <div>
            <Label className="py-2">Data</Label>
            <Input
              value={paymentData}
              onChange={(e) => {
                setPaymentData(e.target.value);
                if (errors.data) setErrors({ ...errors, data: "" });
              }}
              placeholder="เบอร์ / เลขบัญชี"
            />
            {errors.data && <p className="text-red-500 text-sm mt-1">{errors.data}</p>}
          </div>

          {/* Account Type */}
          <div>
            <Label className="py-2">Account Type</Label>
            <Select value={accountType} onValueChange={setAccountType}>
              <SelectTrigger>
                <SelectValue placeholder="เลือกประเภทบัญชี" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Promptpay">Promptpay</SelectItem>
                <SelectItem value="Bank">Bank</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Active Switch */}
          <div className="flex items-center space-x-3">
            <Label>Active</Label>
            <BannerSwitch
              checked={active}
              onCheckedChange={setActive}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
