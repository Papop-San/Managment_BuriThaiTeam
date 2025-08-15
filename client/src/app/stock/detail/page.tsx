"use client";

import React, { useCallback, useState } from "react";
import Cropper, { Area } from "react-easy-crop";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import { FiUser } from "react-icons/fi";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// ฟังก์ชันช่วย crop รูป
async function getCroppedImg(imageSrc: string, croppedAreaPixels: Area): Promise<Blob | null> {
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

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/jpeg");
  });
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = url;
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
  });
}

type GenderType = "male" | "female" | "other";

type AccountFormValues = {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  gender: GenderType | "";
  birthDate?: string;
  avatar?: File | null;
};

export default function AccountForm() {
  const form = useForm<AccountFormValues>({
    defaultValues: {
      username: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      gender: "",
      birthDate: "",
      avatar: null,
    },
  });

  // State สำหรับ cropper
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Dropzone
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

  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCropConfirm = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
    if (!croppedBlob) return;

    const croppedFile = new File([croppedBlob], selectedFile?.name || "avatar.jpg", { type: "image/jpeg" });
    form.setValue("avatar", croppedFile, { shouldValidate: true });
    setImageSrc(URL.createObjectURL(croppedFile));
    setIsCropModalOpen(false);
  };

  const onSubmit = (data: AccountFormValues) => {
    console.log("Form data:", data);
  };

  return (
    <Form {...form}>
      <Card className="max-w-6xl mx-auto mt-20 p-6">
        <CardHeader className="text-center mt-5">
          <CardTitle className="text-4xl font-bold">Create Account</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-6">
            <div className="flex flex-col md:flex-row gap-8 md:gap-16">

              {/* Avatar */}
              <div className="flex-shrink-0 w-full md:w-[320px] flex flex-col items-center">
                <FormField
                  control={form.control}
                  name="avatar"
                  rules={{ required: "Avatar is required" }}
                  render={() => (
                    <FormItem>
                      <FormControl>
                        <div
                          {...getRootProps()}
                          className={`border-2 border-dashed cursor-pointer flex items-center justify-center mt-10 rounded-full overflow-hidden relative ${
                            isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
                          }`}
                          style={{
                            width: "100%",
                            maxWidth: 300,
                            height: "auto",
                            aspectRatio: "1 / 1",
                            minHeight: 300,
                          }}
                        >
                          <input {...getInputProps()} />
                          {imageSrc ? (
                            <img src={imageSrc} alt="Avatar Preview" className="w-full h-full object-cover rounded-full" />
                          ) : (
                            <FiUser className="text-gray-400" size={100} />
                          )}
                        </div>
                      </FormControl>

                      <Button
                        type="button"
                        onClick={() => document.querySelector<HTMLInputElement>('input[type="file"]')?.click()}
                        className="bg-black text-white rounded px-4 py-2 mt-5 w-full max-w-[300px]"
                      >
                        Upload Image
                      </Button>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Inputs */}
              <div className="flex-grow space-y-8 w-full">
                <FormField
                  control={form.control}
                  name="username"
                  rules={{ required: "Username is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Username" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  rules={{
                    required: "Email is required",
                    pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" placeholder="Email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-8 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="firstName"
                    rules={{ required: "First name is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="First Name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastName"
                    rules={{ required: "Last name is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Last Name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-8 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="phone"
                    rules={{
                      pattern: { value: /^[0-9]*$/, message: "Phone number must be numeric" },
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone (optional)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Phone Number" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="birthDate"
                    rules={{
                      required: "Birth date is required",
                      validate: (value) =>
                        !value ? "Birth date is required" : new Date(value) > new Date() ? "Birth date cannot be in the future" : true,
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Birth Date</FormLabel>
                        <FormControl>
                          <Input {...field} type="date" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Gender */}
                <FormField
                  control={form.control}
                  name="gender"
                  rules={{ required: "Gender is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <FormControl>
                        <div className="flex gap-6 flex-wrap">
                          {["male", "female", "other"].map((value) => (
                            <label key={value} className="inline-flex items-center space-x-3 cursor-pointer">
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

            {/* Submit */}
            <div className="flex justify-center mt-10">
              <Button type="submit" className="text-lg px-10 py-4">
                Create Account
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Modal Crop */}
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
