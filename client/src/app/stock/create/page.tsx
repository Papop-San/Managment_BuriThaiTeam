"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FiArrowLeft, FiPlus, FiMinus, FiTrash2 } from "react-icons/fi";
import Image from "next/image";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

import { Switch } from "@/components/ui/switch";
import { UploadedFile } from "../dtos/upload-file.dto";
import { ProductFormValues } from "../dtos/product.dto";
import { VariantItemProps } from "../dtos/variant.dto";

/* ===================== VARIANT ITEM ===================== */

const VariantItem = ({
  vIndex,
  control,
  register,
  onDeleteVariant,
  onDeleteInventory,
}: VariantItemProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `variants.${vIndex}.inventories`,
  });

  return (
    <div className="border p-4 rounded-md space-y-4">
      {/* ===== Variant Name ===== */}
      <FormField
        control={control}
        name={`variants.${vIndex}.variant_name`}
        render={({ field }) => (
          <FormItem>
            <div className="flex justify-between items-center">
              <FormLabel>Variant</FormLabel>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => onDeleteVariant(vIndex)}
              >
                <FiMinus />
              </Button>
            </div>
            <FormControl>
              <Input {...field} placeholder="Variant name" />
            </FormControl>
          </FormItem>
        )}
      />

      {/* ===== Inventories ===== */}
      {fields.map((inv, iIndex) => (
        <div key={inv.id} className="flex gap-2 items-center">
          <Input
            {...register(
              `variants.${vIndex}.inventories.${iIndex}.inventory_name`
            )}
            placeholder="Inventory"
          />

          <Input
            type="number"
            {...register(`variants.${vIndex}.inventories.${iIndex}.price`, {
              valueAsNumber: true,
            })}
            placeholder="Price"
          />

          <Input
            type="number"
            {...register(`variants.${vIndex}.inventories.${iIndex}.stock`, {
              valueAsNumber: true,
            })}
            placeholder="Stock"
          />

          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => onDeleteInventory(vIndex, iIndex, remove)}
          >
            <FiMinus />
          </Button>
        </div>
      ))}

      {/* ===== Add Inventory ===== */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => append({ inventory_name: "", price: 0, stock: 0 })}
      >
        <FiPlus /> Add Inventory
      </Button>
    </div>
  );
};

/* ===================== MAIN ===================== */

export default function CreateProduct() {
  const router = useRouter();
  const [images, setImages] = useState<UploadedFile[]>([]);

  const form = useForm<ProductFormValues>({
    defaultValues: {
      name: "",
      brand: "",
      short_description: "",
      description: "",
      id_category: "",
      variants: [],
    },
  });

  const { control } = form;

  const { fields, append , remove} = useFieldArray({
    control,
    name: "variants",
  });
  const onDeleteVariant = (vIndex: number) => {
    remove(vIndex); 
  };
  
  const onDeleteInventory = (
    _vIndex: number,
    iIndex: number,
    removeInventory: (index: number) => void
  ) => {
    removeInventory(iIndex); 
  };

  /* ===================== IMAGE UPLOAD ===================== */
  const isVideoFile = (url: string) => {
    return /\.(mp4|webm|ogg|mov|avi|mkv)$/i.test(url);
  };

  //Upload Handle
  const handleUploadImages = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newImages: UploadedFile[] = Array.from(files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      type: "slide",
      is_cover: false,
    }));

    setImages((prev) => [...prev, ...newImages]);
  };

  /* ===================== SUBMIT ===================== */

  const onSubmit: SubmitHandler<ProductFormValues> = async (data) => {
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("brand", data.brand);
    formData.append("short_description", data.short_description);
    formData.append("description", data.description);
    formData.append("id_category", data.id_category);
    formData.append("variants", JSON.stringify(data.variants));

    images.forEach((img) => {
      if (img.file) {
        formData.append("images", img.file);
      }
    });

    formData.append(
      "imagesMeta",
      JSON.stringify(
        images.map((img) => ({
          is_cover: img.is_cover,
          type: img.type,
        }))
      )
    );

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    router.back();
  };

  /* ===================== UI ===================== */

  return (
    <Form {...form}>
      <Button variant="outline" onClick={() => router.back()}>
        <FiArrowLeft /> Back
      </Button>

      <Card className="mt-5 mx-10">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Create Product</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* ================= IMAGES ================= */}
            <div className="space-y-4">
              <h3 className="font-semibold">Images</h3>

              <Button type="button" variant="outline" asChild>
                <label className="flex items-center gap-2 cursor-pointer">
                  <FiPlus /> Upload
                  <input
                    type="file"
                    multiple
                    hidden
                    accept="image/*,video/*"
                    onChange={(e) => handleUploadImages(e.target.files)}
                  />
                </label>
              </Button>
              <div className="grid grid-cols-[repeat(auto-fill,200px)] gap-4">
                {images.map((img, index) => {
                  const isVideo = isVideoFile(img.preview);
                  return (
                    <div
                      key={img.id ?? img.preview}
                      className="relative border rounded-md p-2 space-y-2 w-[200px]"
                    >
                      {/* ❌ DELETE (เฉพาะของที่ยังไม่ save) */}
                      {!img.id && (
                        <button
                          type="button"
                          className="absolute top-1 right-1 z-10 bg-white rounded-full p-1 shadow"
                          onClick={() =>
                            setImages((prev) =>
                              prev.filter((_, i) => i !== index)
                            )
                          }
                        >
                          <FiTrash2 className="text-red-500 w-4 h-4" />
                        </button>
                      )}
                      {/* PREVIEW */}
                      <div className="relative w-full aspect-square bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                        {isVideo ? (
                          <video
                            src={img.preview}
                            controls
                            preload="metadata"
                            className="max-w-full max-h-full object-contain"
                          />
                        ) : (
                          <Image
                            src={img.preview}
                            alt=""
                            fill
                            className="object-contain"
                          />
                        )}
                      </div>
                      {/* SWITCH COVER (image only) */}
                      {!isVideo && (
                        <div className="flex justify-between items-center">
                          <Switch
                            checked={img.is_cover}
                            onCheckedChange={(check) => {
                              setImages((prev) =>
                                prev.map((p, i) => {
                                  if (p.file?.type.startsWith("video/"))
                                    return p;
                                  if (i === index) {
                                    return {
                                      ...p,
                                      is_cover: check,
                                      type: check ? "cover" : "slide",
                                    };
                                  }
                                  return {
                                    ...p,
                                    is_cover: false,
                                    type: "slide",
                                  };
                                })
                              );
                            }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ================= TEXT ================= */}
            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="brand"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="short_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short Description</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="id_category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category ID</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* ================= VARIANTS ================= */}
            {fields.map((field, vIndex) => (
              <VariantItem
                key={field.id} // ✅ สำคัญมาก
                vIndex={vIndex}
                control={control}
                register={form.register}
                onDeleteVariant={onDeleteVariant}
                onDeleteInventory={onDeleteInventory}
              />
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={() =>
                append({
                  variant_name: "",
                  inventories: [{ inventory_name: "", price: 0, stock: 0 }],
                })
              }
            >
              <FiPlus /> Add Variant
            </Button>

            <Button type="submit" className="w-full">
              Create Product
            </Button>
          </form>
        </CardContent>
      </Card>
    </Form>
  );
}
