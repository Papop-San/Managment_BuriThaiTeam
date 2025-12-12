"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FiArrowLeft } from "react-icons/fi";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FiUpload, FiX, FiImage } from "react-icons/fi";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

type ProductFormValues = {
  productName: string;
  quantity: number;
  stock: number;
  category: string;
  status: string;
  images: File[];
};

export default function UpdateProduct() {
  const form = useForm<ProductFormValues>({
    defaultValues: {
      productName: "เสื้อยืดลายแมว",
      quantity: 10,
      stock: 5,
      category: "clothing",
      status: "in_stock",
      images: [],
    },
  });

  const router = useRouter();

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [mainImageIndex, setMainImageIndex] = useState(0);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const filesArray = Array.from(e.target.files).slice(0, 5);
    const previews = filesArray.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
    form.setValue("images", filesArray, { shouldValidate: true });
    setMainImageIndex(0);
  };

  const handleRemoveImage = (index: number) => {
    const updatedFiles = [...form.getValues("images")];
    updatedFiles.splice(index, 1);
    form.setValue("images", updatedFiles, { shouldValidate: true });

    const updatedPreviews = [...imagePreviews];
    updatedPreviews.splice(index, 1);
    setImagePreviews(updatedPreviews);

    if (mainImageIndex >= updatedPreviews.length) {
      setMainImageIndex(updatedPreviews.length - 1);
    }
  };

  const onSubmit: SubmitHandler<ProductFormValues> = (data) => {
    console.log("Updated Product:", data);
    alert("บันทึกข้อมูลสินค้าสำเร็จ");
  };

  return (
    <div>
      <Form {...form}>
        
        <div className="flex justify-center mt-8 relative">
          <Card className="w-full max-w-5xl">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center">
                Detail Stock Product
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                {/* Upload & Preview */}
                <div className="flex flex-col items-center">
                  <div
                    className="w-[600px] h-[300px] border border-gray-300 rounded-lg flex items-center justify-center overflow-hidden mb-2 bg-gray-100 relative cursor-pointer"
                    onClick={() =>
                      document.getElementById("product-image")?.click()
                    }
                  >
                    {imagePreviews.length > 0 ? (
                      <>
                        <img
                          src={imagePreviews[mainImageIndex]}
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

                  {imagePreviews.length > 1 && (
                    <div className="flex gap-2 mb-2">
                      {imagePreviews.map((preview, idx) => (
                        <div key={idx} className="relative">
                          <img
                            src={preview}
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

                {/* Product Name */}
                <FormField
                  control={form.control}
                  name="productName"
                  rules={{ required: "กรุณากรอกชื่อสินค้า" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ชื่อสินค้า</FormLabel>
                      <FormControl>
                        <Input placeholder="กรอกชื่อสินค้า" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Quantity */}
                <FormField
                  control={form.control}
                  name="quantity"
                  rules={{ required: "กรุณากรอกจำนวนสินค้า" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>จำนวนสินค้า</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="กรอกจำนวนสินค้า"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Stock */}
                <FormField
                  control={form.control}
                  name="stock"
                  rules={{ required: "กรุณากรอกสินค้าคงเหลือ" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>สินค้าคงเหลือ</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="กรอกสินค้าคงเหลือ"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Category */}
                <FormField
                  control={form.control}
                  name="category"
                  rules={{ required: "กรุณาเลือกหมวดหมู่" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>หมวดหมู่</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="เลือกหมวดหมู่" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="electronics">
                              อิเล็กทรอนิกส์
                            </SelectItem>
                            <SelectItem value="clothing">เสื้อผ้า</SelectItem>
                            <SelectItem value="accessories">
                              เครื่องประดับ
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Status */}
                <FormField
                  control={form.control}
                  name="status"
                  rules={{ required: "กรุณาเลือกสถานะ" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>สถานะ</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="เลือกสถานะ" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="in_stock">พร้อมขาย</SelectItem>
                            <SelectItem value="out_of_stock">
                              สินค้าหมด
                            </SelectItem>
                            <SelectItem value="pre_order">
                              พรีออเดอร์
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-center">
                  <Button type="submit" className="my-2">
                    Submit
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </Form>
    </div>
  );
}
