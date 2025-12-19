"use client";

import { useState, useEffect } from "react";
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
import { PaymentItem, PaymentMethod,  } from "@/types/payment";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface UpdatePaymentFormProps {
  open: boolean;
  onClose: () => void;
  paymentItem: PaymentItem | null;
  
}

export default function UpdatePaymentForm({
  open,
  onClose,
  paymentItem,
}: UpdatePaymentFormProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [payKey, setPayKey] = useState("");
  const [accountType, setAccountType] = useState<PaymentMethod>("PROMPTPAY");
  const [active, setActive] = useState(false);

  const [errors, setErrors] = useState({
    first_name: "",
    last_name: "",
    payKey: "",
    payment_method: ""
  });

  useEffect(() => {
    if (paymentItem) {
      setFirstName(paymentItem.first_name ?? "");
      setLastName(paymentItem.last_name ?? "");
      setPayKey(paymentItem.payKey ?? "");
      setAccountType(paymentItem.payment_method ?? "PROMPTPAY");
      setActive(paymentItem.is_active ?? false);
    }
  }, [paymentItem]);

  const handleSubmit = async () => {
    const newErrors = {
      first_name: firstName.trim() === "" ? "กรุณากรอกชื่อ" : "",
      last_name: lastName.trim() === "" ? "กรุณากรอกนามสกุล" : "",
      payKey: payKey.trim() === "" ? "กรุณากรอกเบอร์ / เลขบัญชี" : "",
      payment_method: accountType.trim() === "" ? "กรุณาเลือกประเภทบัญชี" : "",
    };
    setErrors(newErrors);
    
    if (newErrors.first_name || newErrors.last_name || newErrors.payKey || newErrors.payment_method) return;
    
    if (!paymentItem) return;
  
    try {
      const res = await fetch(`${API_URL}/promtpay/${paymentItem.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          payKey: payKey.trim(),
          payment_method: accountType,          
          is_active: active,
        }),
      });
  
      if (!res.ok) throw new Error("Update payment failed");

      console.log("Submitting payment:", {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        payKey: payKey.trim(),
        payment_method: accountType,
        is_active: active,
      });
  
      // ปิด dialog ก่อน reload
      onClose();
      window.location.reload();
  
    } catch (err) {
      console.error(err);
      alert("อัปเดตข้อมูลไม่สำเร็จ");
    }
  };
  
  

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Update Payment Account</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* First Name */}
          <div>
            <Label className="py-2">First Name</Label>
            <Input
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
                if (errors.first_name) setErrors({ ...errors, first_name: "" });
              }}
              placeholder="ชื่อ"
            />
            {errors.first_name && <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>}
          </div>

          {/* Last Name */}
          <div>
            <Label className="py-2">Last Name</Label>
            <Input
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
                if (errors.last_name) setErrors({ ...errors, last_name: "" });
              }}
              placeholder="นามสกุล"
            />
            {errors.last_name && <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>}
          </div>

          {/* Pay Key */}
          <div>
            <Label className="py-2">Data</Label>
            <Input
              value={payKey}
              onChange={(e) => {
                setPayKey(e.target.value);
                if (errors.payKey) setErrors({ ...errors, payKey: "" });
              }}
              placeholder="เบอร์ / เลขบัญชี"
            />
            {errors.payKey && <p className="text-red-500 text-sm mt-1">{errors.payKey}</p>}
          </div>

          {/* Account Type */}
          <div>
            <Label className="py-2">Account Type</Label>
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

          {/* Active */}
          <div className="flex items-center space-x-3">
            <Label>Active</Label>
            <BannerSwitch checked={active} onCheckedChange={setActive} />
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit}>Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
