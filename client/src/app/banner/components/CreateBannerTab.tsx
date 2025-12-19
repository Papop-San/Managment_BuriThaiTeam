"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateBannerTab({ open, onClose, onSuccess }: Props) {
  const [file, setFile] = useState<File | undefined>();
  const [preview, setPreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // เลือกรูป → preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  // ลบรูป
  const removeImage = () => {
    setFile(undefined);
    setPreview(null);
  };

  // upload + create banner
  const handleSubmit = async () => {
    if (!file) return;

    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append("images", file);

      const res = await fetch(`${API_URL}/banners`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Create banner failed");
      }

      // success
      onSuccess();
      onClose();

      // reset state
      setFile(undefined);
      setPreview(null);
    } catch (err) {
      console.error(err);
      setError("Upload banner failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <div className="space-y-4">
          {/* Upload input */}
          <DialogHeader>
            <DialogTitle></DialogTitle>
          </DialogHeader>

          <div>
            <Label className="mb-2 block">Banner Image</Label>
            <Input type="file" accept="image/*" onChange={handleFileChange} />
          </div>

          {/* Preview */}
          {preview && (
            <div className="relative w-full">
              <img
                src={preview}
                alt="Banner preview"
                className="w-full rounded-lg border object-cover"
              />
              <button
                onClick={removeImage}
                className="absolute top-2 right-2 bg-black/60 rounded-full p-1"
              >
                <X className="text-white w-5 h-5" />
              </button>
            </div>
          )}

          {/* Error */}
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit} disabled={!file || loading}>
            {loading ? "Uploading..." : "Upload"}
          </Button>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
