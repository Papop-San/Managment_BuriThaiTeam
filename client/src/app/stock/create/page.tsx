import React, { useCallback, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useDropzone } from "react-dropzone";

export default function ProductDetail() {
  return (
    <div className="flex justify-center mt-8">
      <Card className="max-w-full w-7xl ">
          <CardHeader>
              <CardTitle className="text-3xl font-bold text-center">Account Create</CardTitle>
          </CardHeader>
          <CardContent>
            
          </CardContent>
      </Card>
    </div>
  );
}
