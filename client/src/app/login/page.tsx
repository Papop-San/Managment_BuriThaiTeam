"use client"; // mark this as a client component since it uses useState

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Replace with your login logic (API call)
    alert(`Logging in with email: ${identifier} and password: ${password}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-8 rounded-md shadow-md w-full max-w-xl h-full max-h-screen "
      >
        <h1 className="text-2xl font-semibold mb-6 text-center">Sign In</h1>

        <div className="mb-4">
          <Label htmlFor="identifier" className="py-3">
            Email หรือ Username
          </Label>
          <Input
            id="identifier"
            type="text"
            placeholder="Email or Username"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
            autoComplete="username"
          />
        </div>

        <div className="mb-6">
          <Label htmlFor="password" className="py-3">
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <Button type="submit" className="w-full">
          Sign In
        </Button>
        <a
          href="#"
          className="ml-auto inline-block text-sm underline-offset-4 hover:underlin py-2"
        >
          Forgot your password?
        </a>
        <div className="flex gap-4 mt-4 items-center">
          <Button
            variant="outline"
            type="button"
            className="flex-1 flex items-center justify-center gap-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 533.5 544.3"
            >
              <path
                fill="#4285f4"
                d="M533.5 278.4c0-17.4-1.4-34.1-4.1-50.4H272v95.3h146.9c-6.4 34.7-25.6 64.1-54.6 83.7v69.4h88.4c51.6-47.5 80.8-117.5 80.8-198z"
              />
              <path
                fill="#34a853"
                d="M272 544.3c73.7 0 135.5-24.4 180.7-66.2l-88.4-69.4c-24.6 16.5-56 26.3-92.3 26.3-70.9 0-131-47.9-152.5-112.1H27.1v70.7C72.7 476.2 166.5 544.3 272 544.3z"
              />
              <path
                fill="#fbbc04"
                d="M119.5 322.9c-10.5-31.3-10.5-64.9 0-96.2v-70.7H27.1c-36.4 72.7-36.4 158.9 0 231.6l92.4-64.7z"
              />
              <path
                fill="#ea4335"
                d="M272 107.7c38.6-.6 75.4 13.6 103.5 39.7l77.4-77.4C408.4 24.2 341.6-.6 272 0 166.5 0 72.7 68.1 27.1 178.2l92.4 70.7C141 155.6 201.1 107.7 272 107.7z"
              />
            </svg>
            Google
          </Button>

          <Button
            variant="outline"
            type="button"
            className="flex-1 flex items-center justify-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
              width="24"
              height="24"
            >
              <path
                d="M22.675 0h-21.35C.6 0 0 .6 0 1.325v21.351C0 23.4.6 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.466.099 2.797.143v3.24l-1.918.001c-1.504 0-1.796.715-1.796 1.763v2.312h3.59l-.467 3.622h-3.123V24h6.116C23.4 24 24 23.4 24 22.675V1.325C24 .6 23.4 0 22.675 0z"
                fill="#1877F2"
              />
            </svg>
            Facebook
          </Button>
        </div>
      </form>
    </div>
  );
}
