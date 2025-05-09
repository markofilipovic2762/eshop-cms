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
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, ArrowLeft, ImagePlus } from "lucide-react";
import { getCategory, updateCategory, uploadsUrl } from "@/lib/api";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

type CategoryFormData = {
  id: number;
  name: string;
  imageUrl?: string;
};

export default function EditCategoryPage({
  params,
}: {
  params: { id: string };
}) {
  const id = Number.parseInt(params.id);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CategoryFormData>({
    id: id,
    name: "",
    imageUrl: "",
  });
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const data = await getCategory(Number.parseInt(params.id));
        setFormData({
          id: data.id,
          name: data.name,
          imageUrl: data.imageUrl,
        });
      } catch (error) {
        toast.error("Failed to fetch category. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategory();
  }, [params.id, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // In a real app, this would be an API call
      await updateCategory(Number.parseInt(params.id), formData);

      toast.success("Category updated successfully!");
      router.push("/dashboard/categories");
    } catch (error) {
      toast.error("Failed to update category. Please try again.");
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
          <Link href="/dashboard/categories">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Edit Category</h1>
      </div>

      <Card>
        {isLoading ? (
          <div className="p-6 space-y-4">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-2/3" />
            <div className="space-y-2 pt-4">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="flex justify-between pt-4">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Category Information</CardTitle>
              <CardDescription>Update the category details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Category Image</Label>
                <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                  <div className="relative h-40 w-40 overflow-hidden rounded-md border">
                    <img
                      src={imagePreview || "/placeholder.jpg"}
                      alt="Product preview"
                      className="h-full w-full object-cover"
                    />
                  </div>

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
                <Label htmlFor="name">Category Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Electronics, Clothing, Home Decor"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" asChild>
                <Link href="/dashboard/categories">Cancel</Link>
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Category"
                )}
              </Button>
            </CardFooter>
          </form>
        )}
      </Card>
      <Toaster />
    </div>
  );
}
