"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cropper, { Area } from "react-easy-crop";
import { LoaderIcon } from "lucide-react";
import Image from "next/image";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FiArrowLeft } from "react-icons/fi";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm, SubmitHandler } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import { FiUser } from "react-icons/fi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useParams } from "next/navigation";
import { AccountFormValues } from "@/types/accounts";

// ---------- crop helpers ----------
async function getCroppedImg(
  imageSrc: string,
  croppedAreaPixels: Area
): Promise<Blob | null> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  canvas.width = croppedAreaPixels.width;
  canvas.height = croppedAreaPixels.height;

  ctx.drawImage(
    image,
    croppedAreaPixels.x,
    croppedAreaPixels.y,
    croppedAreaPixels.width,
    croppedAreaPixels.height,
    0,
    0,
    croppedAreaPixels.width,
    croppedAreaPixels.height
  );

  return new Promise((resolve) =>
    canvas.toBlob((blob) => resolve(blob), "image/jpeg")
  );
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

// ---- Format Phone --------
const formatThaiPhone = (phone: string) => {
  const digits = phone.replace(/\D/g, "").slice(0, 10);
  const match = digits.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
  if (!match) return digits;
  return [match[1], match[2], match[3]].filter(Boolean).join("-");
};

// -------- main component ---------
export default function AccountDetailForm() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id;
  const [initialValues, setInitialValues] = useState<AccountFormValues | null>(
    null
  );

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const form = useForm<AccountFormValues>({
    defaultValues: {
      username: "",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phone: "",
      gender: "",
      birthDate: "",
      avatar: null,
    },
  });

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // ---------- LOAD USER DATA ----------
  useEffect(() => {
    async function fetchUser() {
      setLoading(true); 
      setError(""); 
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`,
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }
        );

        if (!res.ok) {
          const errData = await res.json();
          setError(errData.message || "Failed to load user data");
          return;
        }

        const result = await res.json();
        const data = result.data;
        const formattedBirth = data.birthday ? data.birthday.split("T")[0] : "";

        const userData: AccountFormValues = {
          username: data.username ?? "",
          firstName: data.first_name ?? "",
          lastName: data.last_name ?? "",
          email: data.email ?? "",
          phone: data.phone ?? "",
          gender: data.gender ?? "",
          birthDate: formattedBirth ?? "",
          avatar: null,
        };

        form.reset(userData);
        setInitialValues(userData);
        setImageSrc(data.avatar ?? null);
      } catch (err) {
        console.error("LOAD USER ERROR:", err);
        setError("Network error: Unable to fetch user data");
      } finally {
        setLoading(false); 
      }
    }

    fetchUser();
  }, [userId, form]);

  // ---------- dropzone ----------
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (!acceptedFiles.length) return;
    const file = acceptedFiles[0];
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
      setIsCropModalOpen(true);
    };
    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
  });

  const onCropComplete = useCallback(
    (_: Area, croppedAreaPixels: Area) =>
      setCroppedAreaPixels(croppedAreaPixels),
    []
  );

  const handleCropConfirm = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
    if (!croppedBlob) return;

    const croppedFile = new File(
      [croppedBlob],
      selectedFile?.name || "avatar.jpg",
      {
        type: "image/jpeg",
      }
    );

    form.setValue("avatar", croppedFile, { shouldValidate: true });
    setImageSrc(URL.createObjectURL(croppedFile));
    setIsCropModalOpen(false);
  };

  // -------- SUBMIT --------
  const onSubmit: SubmitHandler<AccountFormValues> = async (data) => {
    if (!initialValues) return;

    setIsSubmitting(true);

    try {
      const formData = new FormData();

      Object.keys(data).forEach((key) => {
        const value = data[key as keyof AccountFormValues];
        const defaultValue = initialValues[key as keyof AccountFormValues];

        if (key === "avatar" && value instanceof File) {
          formData.append("avatar", value);
        } else if (value !== defaultValue && value !== "" && value != null) {
          const backendKey = key
            .replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`)
            .toLowerCase();
          formData.append(backendKey, value as string);
        }
      });

      if (formData.entries().next().done) return;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`,
        {
          method: "PUT",
          credentials: "include",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("UPDATE ERROR:", errorData);
        return;
      }

      console.log("Account updated successfully!");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // -------- RENDER --------
  return (
    <Form {...form}>
      {/* Back Button */}
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

      <Card className="max-w-6xl mx-auto mt-20 p-6">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold">Account Details</CardTitle>
        </CardHeader>

        <CardContent>
          {loading || isSubmitting ? (
            <div className="flex flex-col items-center justify-center py-10 space-y-3">
              <LoaderIcon className="h-10 w-10 animate-spin text-gray-500" />
              <p className="text-gray-500 text-lg">
                {loading ? "Loading user data..." : "Updating data..."}
              </p>
            </div>
          ) : error ? (
            <div className="text-center py-10 text-red-500 text-lg">
              {error}
            </div>
          ) : (
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* -------- Avatar + Form -------- */}
              <div className="flex flex-col md:flex-row gap-8 md:gap-16">
                {/* Avatar */}
                <div className="flex-shrink-0 w-full md:w-[320px] flex flex-col items-center">
                  <FormField
                    control={form.control}
                    name="avatar"
                    render={() => (
                      <FormItem>
                        <FormControl>
                          <div
                            {...getRootProps()}
                            className={`border-2 border-dashed cursor-pointer flex items-center justify-center mt-10 rounded-full overflow-hidden relative ${
                              isDragActive
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-300"
                            }`}
                            style={{
                              width: "100%",
                              maxWidth: 300,
                              aspectRatio: "1 / 1",
                              minHeight: 300,
                              position: "relative",
                            }}
                          >
                            <input {...getInputProps()} />

                            {imageSrc ? (
                              <Image
                                src={imageSrc}
                                alt="Avatar"
                                fill
                                className="rounded-full object-cover"
                                style={{ objectPosition: "center center" }}
                              />
                            ) : (
                              <FiUser size={100} className="text-gray-400" />
                            )}
                          </div>
                        </FormControl>

                        <Button
                          type="button"
                          className="bg-black text-white rounded px-4 py-2 mt-5 w-full max-w-[300px]"
                          onClick={() =>
                            document
                              .querySelector<HTMLInputElement>(
                                'input[type="file"]'
                              )
                              ?.click()
                          }
                        >
                          Upload Image
                        </Button>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* -------- RIGHT SIDE FORM -------- */}
                <div className="flex-grow space-y-8 w-full">
                  {/* First/Last */}
                  <div className="grid gap-8 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg font-semibold">
                            First Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              value={field.value ?? ""}
                              className="text-xl p-3 font-medium"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg font-semibold">
                            Last Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              value={field.value ?? ""}
                              className="text-xl p-3 font-medium"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* username */}
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg font-semibold">
                          Username
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value ?? ""}
                            className="text-xl p-3 font-medium"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* email */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg font-semibold">
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            {...field}
                            value={field.value ?? ""}
                            className="text-xl p-3 font-medium"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* phone + birth date */}
                  <div className="grid gap-8 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg font-semibold">
                            Phone
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              value={
                                field.value ? formatThaiPhone(field.value) : ""
                              }
                              className="text-xl p-3 font-medium"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="birthDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg font-semibold">
                            Birth Date
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              {...field}
                              value={field.value ?? ""}
                              className="text-xl p-3 font-medium"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* gender */}
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg font-semibold">
                          Gender
                        </FormLabel>
                        <FormControl>
                          <div className="flex gap-6 text-lg flex-wrap">
                            {["male", "female", "other"].map((value) => (
                              <label
                                key={value}
                                className="inline-flex items-center space-x-3 cursor-pointer"
                              >
                                <input
                                  type="radio"
                                  value={value}
                                  checked={field.value === value}
                                  onChange={() => field.onChange(value)}
                                  className="form-radio w-6 h-6"
                                />
                                <span className="capitalize">{value}</span>
                              </label>
                            ))}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* submit */}
              <div className="flex justify-center mt-10">
                <Button
                  type="submit"
                  className="text-lg px-10 py-4 flex items-center justify-center gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting && (
                    <LoaderIcon className="w-5 h-5 animate-spin" />
                  )}
                  Update Account
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Crop Modal */}
      {isCropModalOpen && imageSrc && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 max-w-md w-full">
            <div style={{ position: "relative", width: "100%", height: 400 }}>
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                minZoom={1}
                maxZoom={5}
              />
            </div>
            <div className="mt-4 flex justify-end gap-4">
              <Button variant="ghost" onClick={() => setIsCropModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCropConfirm}>Confirm Crop</Button>
            </div>
          </div>
        </div>
      )}
    </Form>
  );
}
