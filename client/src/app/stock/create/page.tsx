"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FiArrowLeft, FiPlus, FiMinus, FiTrash2 } from "react-icons/fi";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import * as SwitchPrimitive from "@radix-ui/react-switch";

type UploadedFile = {
  file: File;
  preview: string; // <- เก็บ object URL
  type: "video" | "slide" | "cover";
  isCoverSwitch: boolean;
};

type Inventory = {
  inventory_name: string;
  price: string;
  quantity: number;
};

type ProductVariant = {
  variant_name: string;
  inventories: Inventory[];
};

type ProductFormValues = {
  productName: string;
  category: string;
  status: string;
  variants: ProductVariant[];
  imagesWithMeta?: UploadedFile[];
};

// Nested Component สำหรับ Variant + Inventory
type VariantItemProps = {
  vIndex: number;
  control: any;
  register: any;
  removeVariant: (index: number) => void;
};

const VariantItem: React.FC<VariantItemProps> = ({
  vIndex,
  control,
  register,
  removeVariant,
}) => {
  const {
    fields: inventoryFields,
    append: appendInventory,
    remove: removeInventory,
  } = useFieldArray({
    control,
    name: `variants.${vIndex}.inventories`,
  });

  return (
    <div className="border p-4 rounded-md space-y-4">
      {/* Variant */}
      <div className="flex items-center gap-2">
        <FormField
          control={control}
          name={`variants.${vIndex}.variant_name`}
          rules={{ required: "กรุณากรอกชื่อรุ่นสินค้า" }}
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>รุ่นสินค้า</FormLabel>
              <FormControl>
                <Input {...field} placeholder="กรอกรุ่นสินค้า" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="button"
          variant="destructive"
          onClick={() => removeVariant(vIndex)}
        >
          <FiMinus />
        </Button>
      </div>

      {/* Inventories */}
      {inventoryFields.map((inv, iIndex) => (
        <div
          key={inv.id}
          className="flex items-center gap-2 border p-2 rounded-md"
        >
          <Input
            {...register(
              `variants.${vIndex}.inventories.${iIndex}.inventory_name`
            )}
            placeholder="ชื่อคลัง"
          />
          <Input
            {...register(`variants.${vIndex}.inventories.${iIndex}.price`)}
            placeholder="ราคา"
          />
          <Input
            type="number"
            {...register(`variants.${vIndex}.inventories.${iIndex}.quantity`)}
            placeholder="จำนวน"
          />
          <Button
            type="button"
            variant="destructive"
            onClick={() => removeInventory(iIndex)}
          >
            <FiMinus />
          </Button>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={() =>
          appendInventory({ inventory_name: "", price: "", quantity: 0 })
        }
      >
        <FiPlus /> เพิ่ม Inventory
      </Button>
    </div>
  );
};

export default function UpdateProduct() {
  const form = useForm<ProductFormValues>({
    defaultValues: {
      productName: "เสื้อยืดลายแมว",
      category: "clothing",
      status: "in_stock",
      variants: [
        {
          variant_name: "สีขาว - S",
          inventories: [
            { inventory_name: "คลัง A", price: "399", quantity: 10 },
            { inventory_name: "คลัง B", price: "399", quantity: 5 },
          ],
        },
        {
          variant_name: "สีดำ - M",
          inventories: [
            { inventory_name: "คลัง A", price: "399", quantity: 8 },
          ],
        },
      ],
      imagesWithMeta: [],
    },
  });

  const router = useRouter();

  const {
    fields: variantFields,
    append: appendVariant,
    remove: removeVariant,
  } = useFieldArray({
    control: form.control,
    name: "variants",
  });

  const onSubmit: SubmitHandler<ProductFormValues> = (data) => {
    console.log("Updated Product:", data);
    alert("บันทึกข้อมูลสินค้าสำเร็จ");
  };

  const files: UploadedFile[] = form.watch("imagesWithMeta") || [];

  // Cleanup object URLs ตอน unmount
  useEffect(() => {
    return () => {
      files.forEach((f) => URL.revokeObjectURL(f.preview));
    };
  }, [files]);

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles: UploadedFile[] = Array.from(e.target.files).map((file) => ({
      file,
      preview: URL.createObjectURL(file), // สร้าง URL ครั้งเดียว
      type: "slide",
      isCoverSwitch: false,
    }));
    form.setValue("imagesWithMeta", [...files, ...newFiles]);
  };

  const handleSwitchChange = (index: number, value: boolean) => {
    form.setValue(
      "imagesWithMeta",
      files.map((f, i) => {
        if (i === index)
          return { ...f, isCoverSwitch: value, type: value ? "cover" : f.type };
        if (value) return { ...f, isCoverSwitch: false }; // lock cover แค่ตัวเดียว
        return f;
      })
    );
  };

  const handleTypeChange = (
    index: number,
    value: "video" | "slide" | "cover"
  ) => {
    form.setValue(
      "imagesWithMeta",
      files.map((f, i) => (i === index ? { ...f, type: value } : f))
    );
  };

  const handleRemoveFile = (index: number) => {
    URL.revokeObjectURL(files[index].preview); // ล้าง object URL
    form.setValue(
      "imagesWithMeta",
      files.filter((_, i) => i !== index)
    );
  };

  return (
    <Form {...form}>
      <div className="m-2">
        <Button
          type="button"
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => router.back()}
        >
          <FiArrowLeft /> Back
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row justify-center ">
        {/* Detail Product */}
        <div className="flex justify-center relative w-full lg:w-2/3">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center">
                Create Product
              </CardTitle>
            </CardHeader>

            <CardContent>
              <FormItem>
                <FormLabel>อัพโหลดรูป</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFilesChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>

              {/* Preview + Select + Switch */}
              {files.length > 0 && (
                <div className="mt-4 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-80 overflow-auto">
                  {files.map((f, index) => (
                    <div
                      key={index}
                      className="border rounded-md p-2 flex flex-col items-center gap-2 relative"
                    >
                      <img
                        src={f.preview} // ใช้ preview ที่สร้างไว้
                        alt={`preview-${index}`}
                        className="w-24 h-24 object-cover rounded-md"
                      />

                      {/* Remove button */}
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1 p-1"
                        onClick={() => handleRemoveFile(index)}
                      >
                        <FiTrash2 />
                      </Button>

                      {/* Select */}
                      <Select
                        value={f.type}
                        onValueChange={(value) =>
                          handleTypeChange(
                            index,
                            value as "video" | "slide" | "cover"
                          )
                        }
                        disabled={f.isCoverSwitch}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="video">Video</SelectItem>
                          <SelectItem value="slide">Slide</SelectItem>
                          <SelectItem value="cover">Cover</SelectItem>
                        </SelectContent>
                      </Select>

                      {/* Switch */}
                      <div className="flex items-center gap-2">
                        <span>Cover</span>
                        <SwitchPrimitive.Root
                          checked={f.isCoverSwitch}
                          onCheckedChange={(value) =>
                            handleSwitchChange(index, value as boolean)
                          }
                          className={`w-10 h-6 rounded-full ${
                            f.isCoverSwitch ? "bg-blue-500" : "bg-gray-300"
                          } relative transition-colors`}
                        >
                          <span
                            className={`block w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${
                              f.isCoverSwitch
                                ? "translate-x-4"
                                : "translate-x-0"
                            }`}
                          />
                        </SwitchPrimitive.Root>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>

            <CardContent>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
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

                {/* Variants */}
                {variantFields.map((variant, vIndex) => (
                  <VariantItem
                    key={variant.id}
                    vIndex={vIndex}
                    control={form.control}
                    register={form.register}
                    removeVariant={removeVariant}
                  />
                ))}

                {/* Add Variant */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    appendVariant({
                      variant_name: "",
                      inventories: [
                        { inventory_name: "", price: "", quantity: 0 },
                      ],
                    })
                  }
                >
                  <FiPlus /> เพิ่ม Variant
                </Button>

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

                <div className="flex justify-center mt-5">
                  <Button type="submit">Submit</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Form>
  );
}
