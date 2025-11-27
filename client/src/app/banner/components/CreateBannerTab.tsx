"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { BannerSwitch } from "@/components/ui/switch";
import { X } from "lucide-react";

interface CreateBannerPayload {
  file?: File;          // ⭐ เปลี่ยนจาก File | null → optional File
  is_active: boolean;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateBannerPayload) => void; // ⭐ ใช้ payload type ใหม่
}

export default function CreateBannerTab({ open, onClose, onSubmit }: Props) {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | undefined>(undefined); 
  const [active, setActive] = useState<boolean>(false);

  // เมื่อเลือกไฟล์ → generate preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  // ลบรูป
  const removeImage = () => {
    setFile(undefined); // ⭐ reset undefined
    setPreview(null);
  };

  const handleSubmit = () => {
    onSubmit({
      file,        // ⭐ TS ไม่ error แล้ว
      is_active: active,
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Banner</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Upload Input */}
          <div>
            <Label className="mb-2 block">Banner Image</Label>
            <Input 
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          {/* Preview พร้อมปุ่มลบ */}
          {preview && (
            <div className="relative w-full">
              <img 
                src={preview} 
                className="w-full rounded-lg border object-cover"
              />

              {/* ปุ่ม X ลบรูป */}
              <button
                onClick={removeImage}
                className="absolute top-2 right-2 bg-black/50 rounded-full p-1"
              >
                <X className="text-white w-5 h-5" />
              </button>
            </div>
          )}

          {/* Active Switch */}
          <div className="flex items-center space-x-3">
            <Label>Active</Label>
            <BannerSwitch checked={active} onCheckedChange={setActive} />
          </div>
        </div>

        {/* Footer */}
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={handleSubmit} disabled={!file}>
            Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
