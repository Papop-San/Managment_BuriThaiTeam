"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm, SubmitHandler, useFieldArray } from "react-hook-form";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FiArrowLeft, FiPlus, FiMinus, FiTrash2 } from "react-icons/fi";
import { LoaderIcon } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import * as SwitchPrimitive from "@radix-ui/react-switch";

import { StockItem } from "@/types/stock";

/* ===================== TYPES ===================== */

type Product = {
  id: number;
  name: string;
};

type UploadedFile = {
  file: File | null;
  preview: string;
  type: "cover" | "slide" | "video";
  is_cover: boolean;
};

type Inventory = {
  inventory_name: string;
  price: number;
  stock: number;
};

type ProductVariant = {
  variant_name: string;
  inventories: Inventory[];
};

type ProductFormValues = {
  name: string;
  brand: string;
  short_description: string;
  description: string;
  id_category: string;
  variants: ProductVariant[];
};

/* ===================== MAIN ===================== */

export default function CreateProduct() {
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const [data, setData] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  const { control, reset } = form;

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "variants",
  });

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

  /* ===================== FETCH ===================== */

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${params.id}`,
        {
          credentials: "include",
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch");
      }

      const result = await res.json();
      const product = result.data;

      reset({
        name: product.name,
        brand: product.brand,
        short_description: product.short_description,
        description: product.description,
        id_category: product.id_category,
        variants: product.variants,
      });

      setImages(
        product.images.map((img: any) => ({
          file: null,
          preview: img.url,
          type: img.type,
          is_cover: img.is_cover,
        }))
      );
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) fetchData();
  }, [params.id]);
  /* ===================== IMAGE UPLOAD ===================== */

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

  /* ===================== UI ===================== */

  return (
    <>
      <Button variant="outline" onClick={() => router.back()}>
        <FiArrowLeft /> Back
      </Button>

      <Card className="mt-5 mx-10">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            Product Details
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10 space-y-3">
              <LoaderIcon className="h-10 w-10 animate-spin text-gray-500" />
              <p className="text-gray-500 text-lg">Loading data...</p>
            </div>
          ) : error ? (
            <div className="text-center py-10 text-red-500 text-lg">
              {error}
            </div>
          ) : (
            <div>
              <Form {...form} key={params.id}>
                <form className="space-y-6">
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
                              <SwitchPrimitive.Root
                                checked={img.is_cover}
                                onCheckedChange={(checked) =>
                                  setImages((prev) =>
                                    prev.map((p, i) => ({
                                      ...p,
                                      is_cover: i === index ? checked : false,
                                      type:
                                        i === index && checked
                                          ? "cover"
                                          : p.type === "cover"
                                          ? "slide"
                                          : p.type,
                                    }))
                                  )
                                }
                                className="relative inline-flex h-6 w-11 rounded-full
                              data-[state=checked]:bg-green-500
                              data-[state=unchecked]:bg-gray-300"
                              >
                                <SwitchPrimitive.Thumb
                                  className="block h-5 w-5 bg-white rounded-full
                translate-x-0 data-[state=checked]:translate-x-5 transition"
                                />
                              </SwitchPrimitive.Root>
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
                              setImages((prev) =>
                                prev.filter((_, i) => i !== index)
                              )
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
                        inventories: [
                          { inventory_name: "", price: 0, stock: 0 },
                        ],
                      })
                    }
                  >
                    <FiPlus /> Add Variant
                  </Button>
                </form>
              </Form>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
