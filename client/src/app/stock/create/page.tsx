"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FiUpload, FiX, FiImage } from "react-icons/fi";

export default function UpdateProduct() {
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");

  const [images, setImages] = useState<{ file: File; preview: string }[]>([]);
  const [mainImageIndex, setMainImageIndex] = useState(0);

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    if (mainImageIndex >= newImages.length) {
      setMainImageIndex(newImages.length - 1);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const filesArray = Array.from(e.target.files);
    const newImages = filesArray.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    const combined = [...images, ...newImages].slice(0, 5);
    setImages(combined);
    if (newImages.length > 0) setMainImageIndex(images.length);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Updated Product:", {
      productName,
      quantity,
      category,
      stock,
      status,
      images,
      mainImageIndex,
    });
    alert("บันทึกข้อมูลสินค้าสำเร็จ");
  };

  return (
    <div className="flex justify-center mt-8 relative">
      <Card className="w-full max-w-5xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">
            Create Stock Product
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Upload & Preview */}
            <div className="flex flex-col items-center">
              <div className="w-[600px] h-[300px] border border-gray-300 rounded-lg flex items-center justify-center overflow-hidden mb-2 bg-gray-100 relative cursor-pointer">
                {images.length > 0 ? (
                  <>
                    <img
                      src={images[mainImageIndex].preview}
                      alt="Main Preview"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                    <div
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center cursor-pointer"
                      onClick={() => handleRemoveImage(mainImageIndex)}
                    >
                      <FiX size={14} />
                    </div>
                  </>
                ) : (
                  <FiImage size={40} className="text-gray-400" />
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 mb-2">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative">
                      <img
                        src={img.preview}
                        alt={`Preview ${idx}`}
                        className={`w-24 h-24 object-cover rounded border cursor-pointer ${
                          idx === mainImageIndex ? "border-blue-500" : ""
                        }`}
                        onClick={() => setMainImageIndex(idx)}
                      />
                      <div
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center cursor-pointer"
                        onClick={() => handleRemoveImage(idx)}
                      >
                        <FiX size={12} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <Button
                type="button"
                className="flex items-center gap-2 mt-5"
                onClick={() =>
                  document.getElementById("product-image")?.click()
                }
              >
                <FiUpload /> Upload Image
              </Button>

              <input
                id="product-image"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageChange}
              />
            </div>

            {/* Form Fields */}
            <div>
              <label className="block mb-1 font-medium">ชื่อสินค้า</label>
              <Input
                className="w-full"
                placeholder="กรอกชื่อสินค้า"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">จำนวนสินค้า</label>
              <Input
                className="w-full"
                type="number"
                placeholder="กรอกจำนวนสินค้า"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">หมวดหมู่</label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="เลือกหมวดหมู่" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="electronics">อิเล็กทรอนิกส์</SelectItem>
                  <SelectItem value="clothing">เสื้อผ้า</SelectItem>
                  <SelectItem value="accessories">เครื่องประดับ</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block mb-1 font-medium">สินค้าคงเหลือ</label>
              <Input
                className="w-full"
                type="number"
                placeholder="กรอกสินค้าคงเหลือ"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">สถานะ</label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="เลือกสถานะ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in_stock">พร้อมขาย</SelectItem>
                  <SelectItem value="out_of_stock">สินค้าหมด</SelectItem>
                  <SelectItem value="pre_order">พรีออเดอร์</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-center">
              <Button type="submit" className="my-2">
                 Submit
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
