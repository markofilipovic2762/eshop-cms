"use client";

import type React from "react";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import { useToast } from "@/components/ui/use-toast";
import { Loader2, ArrowLeft, ImagePlus } from "lucide-react";
import {
  getCategories,
  getSubcategories,
  getSuppliers,
  createProduct,
  api,
  uploadsUrl,
} from "@/lib/api";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
type Category = {
  id: number;
  name: string;
};

type Subcategory = {
  id: number;
  name: string;
  categoryId: number;
};

type Supplier = {
  id: number;
  name: string;
};

export default function NewProductPage() {
  const router = useRouter();
  //const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState<
    Subcategory[]
  >([]);
  const [imagesPreview, setImagesPreview] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    amount: "",
    categoryId: "",
    subcategoryId: "",
    supplierId: "",
    imageUrls: [] as string[],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, subcategoriesData, suppliersData] =
          await Promise.all([
            getCategories(),
            getSubcategories(),
            getSuppliers(),
          ]);

        setCategories(categoriesData);
        setSubcategories(subcategoriesData);
        setSuppliers(suppliersData);
      } catch (error) {
        toast.error("Failed to load data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  useEffect(() => {}, [images, imagesPreview]);

  // Filter subcategories when category changes
  useEffect(() => {
    if (formData.categoryId) {
      const filtered = subcategories.filter(
        (subcategory) => subcategory.categoryId === Number(formData.categoryId)
      );
      setFilteredSubcategories(filtered);

      // Reset subcategory selection if current selection doesn't belong to the selected category
      if (
        formData.subcategoryId &&
        !filtered.some((s) => s.id === Number(formData.subcategoryId))
      ) {
        setFormData((prev) => ({ ...prev, subcategoryId: "" }));
      }
    } else {
      setFilteredSubcategories([]);
      setFormData((prev) => ({ ...prev, subcategoryId: "" }));
    }
  }, [formData.categoryId, subcategories, formData.subcategoryId]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (images.length > 2) {
      toast.success("You can only upload up to 3 images.");
      return;
    }
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size exceeds 2MB. Please upload a smaller image.");
      return;
    }
    const formDejta = new FormData();
    formDejta.append("file", file);
    let imageUrl: string;
    try {
      const response = await axios.post(
        "http://localhost:5056/products/upload",
        formDejta,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      imageUrl = response.data;
      console.log("Image uploaded:", imageUrl);
      setImages([...images, imageUrl]);
      setImagesPreview([...imagesPreview, uploadsUrl + imageUrl]);
      setFormData({
        ...formData,
        imageUrls: [...images, imageUrl],
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image. Please try again.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate form
    if (
      !formData.name ||
      !formData.price ||
      !formData.amount ||
      !formData.categoryId
    ) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      const productData = {
        ...formData,
        price: Number.parseFloat(formData.price),
        amount: Number.parseInt(formData.amount),
        categoryId: Number.parseInt(formData.categoryId),
        subcategoryId: Number.parseInt(formData.subcategoryId),
        supplierId: formData.supplierId
          ? Number.parseInt(formData.supplierId)
          : null,
        imagesUrl: images,
      };

      const response = await createProduct(productData);
      console.log("Product created:", response.data);
      toast.success("Product created successfully!");
      setTimeout(() => {
        router.push("/dashboard/products");
      }, 1000);
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("Failed to create product. Please try again.");
    } finally {
      setIsSubmitting(false);
      setFormData({
        name: "",
        description: "",
        price: "",
        amount: "",
        categoryId: "",
        subcategoryId: "",
        supplierId: "",
        imageUrls: [],
      });
      setImagesPreview([]);
      setImages([]);
    }
  };

  console.log("Images preview:", imagesPreview);
  console.log("images:", images);
  console.log("Form data:", formData);

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" asChild className="mr-2">
          <Link href="/dashboard/products">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Add Product</h1>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
            <CardDescription>
              Create a new product for your store.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Product Images */}
            <div className="space-y-2">
              <Label>Product Images</Label>
              <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                {imagesPreview.map((image, index) => (
                  <div
                    key={index}
                    className="relative h-40 w-40 overflow-hidden rounded-md border"
                  >
                    <img
                      src={image || "/placeholder.png"}
                      alt="Product preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
                {/* <div className="relative h-40 w-40 overflow-hidden rounded-md border">
                  <img
                    src={imagesPreview[] || "/placeholder.svg"}
                    alt="Product preview"
                    className="h-full w-full object-cover"
                  />
                </div> */}
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="image" className="cursor-pointer">
                    <div className="flex h-10 items-center justify-center rounded-md border border-dashed px-4 py-2 text-sm hover:bg-muted">
                      <ImagePlus className="mr-2 h-4 w-4" />
                      <span>Upload Image</span>
                    </div>
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleImageChange}
                    />
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Recommended size: 800x800px. Max size: 2MB.
                  </p>
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Wireless Headphones"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your product..."
                className="min-h-32"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="price">Price ($) *</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Stock Quantity *</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0"
                  min="0"
                  step="1"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            {/* Categories and Supplier */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                {isLoading ? (
                  <div className="flex h-10 w-full items-center rounded-md border border-input bg-background px-3 py-2">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Loading categories...
                    </span>
                  </div>
                ) : (
                  <Select
                    value={formData.categoryId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, categoryId: value })
                    }
                    required
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.length === 0 ? (
                        <div className="flex items-center justify-center p-2 text-sm text-muted-foreground">
                          No categories found
                        </div>
                      ) : (
                        categories.map((category) => (
                          <SelectItem
                            key={category.id}
                            value={category.id.toString()}
                          >
                            {category.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="subcategory">Subcategory</Label>
                <Select
                  value={formData.subcategoryId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, subcategoryId: value })
                  }
                  disabled={
                    !formData.categoryId || filteredSubcategories.length === 0
                  }
                >
                  <SelectTrigger id="subcategory">
                    <SelectValue placeholder="Select a subcategory" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredSubcategories.length === 0 ? (
                      <div className="flex items-center justify-center p-2 text-sm text-muted-foreground">
                        {formData.categoryId
                          ? "No subcategories found"
                          : "Select a category first"}
                      </div>
                    ) : (
                      filteredSubcategories.map((subcategory) => (
                        <SelectItem
                          key={subcategory.id}
                          value={subcategory.id.toString()}
                        >
                          {subcategory.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="supplier">Supplier</Label>
              {isLoading ? (
                <div className="flex h-10 w-full items-center rounded-md border border-input bg-background px-3 py-2">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Loading suppliers...
                  </span>
                </div>
              ) : (
                <Select
                  value={formData.supplierId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, supplierId: value })
                  }
                >
                  <SelectTrigger id="supplier">
                    <SelectValue placeholder="Select a supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.length === 0 ? (
                      <div className="flex items-center justify-center p-2 text-sm text-muted-foreground">
                        No suppliers found
                      </div>
                    ) : (
                      suppliers.map((supplier) => (
                        <SelectItem
                          key={supplier.id}
                          value={supplier.id.toString()}
                        >
                          {supplier.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href="/dashboard/products">Cancel</Link>
            </Button>
            <Button type="submit" disabled={isSubmitting || isLoading}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Product"
              )}
            </Button>
          </CardFooter>
        </form>
        <Toaster position="top-center" />
      </Card>
    </div>
  );
}
