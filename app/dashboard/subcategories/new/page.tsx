"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import toast, { Toaster } from "react-hot-toast";
import { Loader2, ArrowLeft, ImagePlus } from "lucide-react";
import { getCategories, createSubcategory, uploadsUrl } from "@/lib/api";
import axios from "axios";

type Category = {
  id: number;
  name: string;
};

export default function NewSubcategoryPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    imageUrl: "",
  });
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // In a real app, this would be an API call
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        toast.error("Failed to fetch categories. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.categoryId) {
      toast.error("Please select a parent category.");
      return;
    }

    setIsSubmitting(true);

    try {
      // In a real app, this would be an API call
      await createSubcategory({
        name: formData.name,
        categoryId: Number.parseInt(formData.categoryId),
        imageUrl: formData.imageUrl,
      });

      toast.success("Subcategory created successfully!");
      router.push("/dashboard/subcategories");
    } catch (error) {
      toast.error("Failed to create subcategory. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      //setImages([...images, imageUrl]);
      setImagePreview(`${uploadsUrl}${imageUrl}`);
      setFormData({
        ...formData,
        imageUrl,
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" asChild className="mr-2">
          <Link href="/dashboard/subcategories">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Add Subcategory</h1>
      </div>

      <Card>
        <Toaster />
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Subcategory Information</CardTitle>
            <CardDescription>
              Create a new subcategory and assign it to a parent category.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Subcategory Image</Label>
              <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                <div className="relative h-40 w-40 overflow-hidden rounded-md border">
                  <img
                    src={imagePreview || "/placeholder.jpg"}
                    alt="Product preview"
                    className="h-full w-full object-cover"
                  />
                </div>

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
            <div className="space-y-2">
              <Label htmlFor="name">Subcategory Name</Label>
              <Input
                id="name"
                placeholder="e.g., Smartphones, Running Shoes, Fiction Books"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Parent Category</Label>
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
                    <SelectValue placeholder="Select a parent category" />
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
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href="/dashboard/subcategories">Cancel</Link>
            </Button>
            <Button type="submit" disabled={isSubmitting || isLoading}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Subcategory"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
