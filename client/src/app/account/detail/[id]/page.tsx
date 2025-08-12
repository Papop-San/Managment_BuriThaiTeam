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
import { useForm, SubmitHandler } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import { FiUser } from "react-icons/fi";

// ฟังก์ชันช่วย crop รูปจาก canvas
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

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob);
    }, "image/jpeg");
  });
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (error) => reject(error);
    img.src = url;
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

const mockUserData: AccountFormValues = {
  username: "john_doe",
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phone: "0812345678",
  gender: "male",
  birthDate: "1990-01-01",
  avatar: null,
};

export default function AccountForm() {
  const form = useForm<AccountFormValues>({
    defaultValues: mockUserData,
  });

  // ตั้งค่า imageSrc เริ่มต้นเป็น URL รูป avatar ตัวอย่าง
  const [imageSrc, setImageSrc] = useState<string | null>(
    "https://i.pravatar.cc/300"
  );
  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
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

    const croppedFile = new File(
      [croppedBlob],
      selectedFile?.name || "avatar.jpg",
      { type: "image/jpeg" }
    );

    form.setValue("avatar", croppedFile, { shouldValidate: true });

    const croppedUrl = URL.createObjectURL(croppedFile);
    setImageSrc(croppedUrl);

    setIsCropModalOpen(false);
  };

  const onSubmit: SubmitHandler<AccountFormValues> = (data) => {
    console.log("Form data:", data);
    // ส่งข้อมูลพร้อม avatar (ไฟล์ที่ crop แล้ว) ไป backend
  };

  React.useEffect(() => {
    return () => {
      if (imageSrc) URL.revokeObjectURL(imageSrc);
    };
  }, [imageSrc]);

  return (
    <Form {...form}>
      <div className="max-w-6xl mx-auto p-10 mt-20 bg-white rounded-lg shadow-md border border-gray-200">
        <div className="text-center mb-8">
          <p className="text-4xl font-bold">Account Details</p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex flex-col md:flex-row gap-8 md:gap-16">
            {/* Left side: Avatar upload */}
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
                          isDragActive
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-300"
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
                          <img
                            src={imageSrc}
                            alt="Avatar Preview"
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          <FiUser className="text-gray-400" size={100} />
                        )}
                      </div>
                    </FormControl>

                    <button
                      type="button"
                      onClick={() => {
                        const input = document.querySelector(
                          'input[type="file"]'
                        ) as HTMLInputElement;
                        input?.click();
                      }}
                      className="bg-black text-white rounded px-4 py-2 mt-5 w-full max-w-[300px]"
                    >
                      Upload Image
                    </button>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Right side: Input fields */}
            <div className="flex-grow space-y-8 w-full">
              {/* Username */}
              <FormField
                control={form.control}
                name="username"
                rules={{ required: "Username is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold">
                      Username
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="text-xl p-3 font-medium"
                        placeholder="Username"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email address",
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg font-semibold">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="text-xl p-3 font-medium"
                        type="email"
                        placeholder="Email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-8 md:grid-cols-2">
                {/* First Name */}
                <FormField
                  control={form.control}
                  name="firstName"
                  rules={{ required: "First name is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold">
                        First Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="text-xl p-3 font-medium"
                          placeholder="First Name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Last Name */}
                <FormField
                  control={form.control}
                  name="lastName"
                  rules={{ required: "Last name is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold">
                        Last Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="text-xl p-3 font-medium"
                          placeholder="Last Name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-8 md:grid-cols-2">
                {/* Phone */}
                <FormField
                  control={form.control}
                  name="phone"
                  rules={{
                    pattern: {
                      value: /^[0-9]*$/,
                      message: "Phone number must be numeric",
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold">
                        Phone (optional)
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="text-xl p-3 font-medium"
                          type="tel"
                          placeholder="Phone Number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Birth Date */}
                <FormField
                  control={form.control}
                  name="birthDate"
                  rules={{
                    required: "Birth date is required",
                    validate: (value) => {
                      if (!value) return "Birth date is required";
                      if (new Date(value) > new Date()) {
                        return "Birth date cannot be in the future";
                      }
                      return true;
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold">
                        Birth Date
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="text-xl p-3 font-medium"
                          type="date"
                          {...field}
                        />
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

          <div className="flex justify-center mt-10">
            <Button className="text-lg px-10 py-4" type="submit">
              Update Account
            </Button>
          </div>
        </form>
      </div>

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
