"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SearchByIdPage() {
  const [productId, setProductId] = useState("");
  const [product, setProduct] = useState<any>(null);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    setError("");
    setProduct(null);

    if (!productId) {
      setError("Please enter a Product ID");
      return;
    }

    try {
        const res = await fetch(`http://localhost:8080/api/products/${productId}`, {
            method: "GET",
            credentials: "include",
          });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Product not found");
        return;
      }

      setProduct(data.data);
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className="bg-white p-8 rounded-md shadow-md w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-6 text-center">Search Product by ID</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="mb-4">
          <Label htmlFor="productId" className="py-3">Product ID</Label>
          <Input
            id="productId"
            type="number"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            placeholder="Enter product ID"
          />
        </div>

        <Button type="button" onClick={handleSearch} className="w-full">Search</Button>

        {product && (
          <div className="mt-6 p-4 bg-gray-100 rounded-md">
            <h2 className="font-semibold text-lg">{product.name}</h2>
            <p>Brand: {product.brand}</p>
            <p>Description: {product.description}</p>
            <p>Category: {product.category?.name}</p>
            <p>Variants: {product.variants.length}</p>
            {product.images?.map((img: any) => (
              <img key={img.img_id} src={img.url} alt="Product" className="mt-2 w-32 h-32 object-cover" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
