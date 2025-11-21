// src/components/ui/switch.tsx
"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

interface Props {
  checked: boolean; // controlled
  onCheckedChange?: (checked: boolean) => void;
}

export function BannerSwitch({ checked, onCheckedChange }: Props) {
  return (
    <SwitchPrimitive.Root
      checked={checked}
      onCheckedChange={onCheckedChange}
      className={cn(
        "relative inline-flex h-5 w-10 cursor-pointer rounded-full border transition-colors duration-200",
        checked ? "bg-green-500" : "bg-gray-200" // track สีตาม checked
      )}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          "bg-white block w-4 h-4 rounded-full transition-transform duration-200 ease-in-out",
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </SwitchPrimitive.Root>
  );
}
