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

/* ===================== TYPES ===================== */

type UploadedFile = {
  file: File | null;
  preview: string;
  type: "cover" | "slide" | "video";
  is_cover: boolean;
};

type Inventory = {
  inventory_name: string;
  price: number; // ✅ FIX
  stock: number;
};

type ProductVariant = {
  variant_name: string;
  inventories: Inventory[];
};

type ProductFormValues = {
  name: string; // ✅ FIX
  brand: string;
  short_description: string;
  description: string;
  id_category: string;
  variants: ProductVariant[];
};

/* ===================== VARIANT ITEM ===================== */

const VariantItem = ({ vIndex, control, register, removeVariant }: any) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `variants.${vIndex}.inventories`,
  });

  return (
    <div className="border p-4 rounded-md space-y-4">
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
                onClick={() => removeVariant(vIndex)}
              >
                <FiMinus />
              </Button>
            </div>
            <FormControl>
              <Input {...field} />
            </FormControl>
          </FormItem>
        )}
      />

      {fields.map((inv, iIndex) => (
        <div key={inv.id} className="flex gap-2">
          <Input
            {...register(
              `variants.${vIndex}.inventories.${iIndex}.inventory_name`
            )}
            placeholder="Inventory"
          />
          <Input
            type="number"
            {...register(
              `variants.${vIndex}.inventories.${iIndex}.price`,
              { valueAsNumber: true } // ✅ FIX
            )}
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
            onClick={() => remove(iIndex)}
          >
            <FiMinus />
          </Button>
        </div>
      ))}

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

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  /* ===================== IMAGE UPLOAD ===================== */
  const isVideoFile = (url: string) => {
    return /\.(mp4|webm|ogg|mov|avi|mkv)$/i.test(url);
  };

  const handleUploadImages = (files: FileList | null) => {
    if (!files) return;

    const newImages: UploadedFile[] = Array.from(files).map((file) => {
      const isVideo = file.type.startsWith("video/");

      return {
        file,
        preview: URL.createObjectURL(file),
        type: isVideo ? "video" : "slide",
        is_cover: false,
      };
    });

    setImages((prev) => {
      const hasCover = prev.some((img) => img.is_cover);

      return [
        ...prev,
        ...newImages.map((img, i) => {
          if (img.type === "video") return img;

          const isCover = !hasCover && i === 0;
          return {
            ...img,
            is_cover: isCover,
            type: isCover ? "cover" : "slide",
          };
        }),
      ];
    });
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
                {images.map((img, index) => (
                  <div
                    key={index}
                    className="border rounded-md p-2 space-y-2 w-[200px]"
                  >
                    {/* PREVIEW */}
                    <div className="relative w-full aspect-square bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                      {img.type === "video" ? (
                        <video
                          src={img.preview}
                          controls
                          className="max-w-full max-h-full object-contain"
                        />
                      ) : (
                        <Image
                          src={img.preview}
                          alt=""
                          fill
                          className="h-auto object-contain"
                        />
                      )}
                    </div>

                    {/* COVER SWITCH */}
                    {img.type !== "video" && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Cover</span>
<Switch
              checked={!!img.is_cover}
              onCheckedChange={(checked) =>
                setImages((prev) =>
                  prev.map((p, i) => {
        
                    if (isVideoFile(p.preview)) return p;
                    if (i === index) {
                      return { ...p, is_cover: checked };
                    }
                    return { ...p, is_cover: false };
                  })
                )
              }
            />
                      </div>
                    )}

                    {/* TYPE */}
                    <div className="text-xs text-gray-500 text-center uppercase">
                      {img.type}
                    </div>

                    {/* DELETE */}
                    <Button
                      variant="destructive"
                      size="sm"
                      className="w-full"
                      onClick={() =>
                        setImages((prev) => prev.filter((_, i) => i !== index))
                      }
                    >
                      <FiTrash2 className="mr-1" /> Delete
                    </Button>
                  </div>
                ))}
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
            {fields.map((_, vIndex) => (
              <VariantItem
                key={vIndex}
                vIndex={vIndex}
                control={control}
                register={form.register}
                removeVariant={remove}
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
