"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Package,
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";
import {
  deleteProduct,
  getCategories,
  getProducts,
  getSubcategories,
  getSuppliers,
  uploadsUrl,
} from "@/lib/api";
import { Category } from "../categories/page";
import { Subcategory } from "../subcategories/page";
import { Supplier } from "../suppliers/page";

export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  amount: number;
  sold?: number;
  imageUrl?: string;
  category: { id: number; name: string };
  subcategory: { id: number; name: string; categoryId: number };
  supplier?: { id: number; name: string };
  imageUrls: string[];
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubCategories] = useState<Subcategory[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  const [categoryId, setCategoryId] = useState<string>("");
  const [subcategoryId, setSubcategoryId] = useState<string>("");
  const [supplierId, setSupplierId] = useState<string>("");
  const [productName, setProductNme] = useState<string>("");

  useEffect(() => {
    fetchCategories();
    fetchSubcategories();
    fetchSuppliers();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      const params: any = {
        productName,
      };

      if (categoryId !== "") {
        params.categoryId = Number(categoryId);
      }
      if (subcategoryId !== "") {
        params.subcategoryId = Number(subcategoryId);
      }
      if (supplierId !== "") {
        params.supplierId = Number(supplierId);
      }

      const data: Product[] = await getProducts(params);
      setProducts(data);
    };
    fetchProducts();
  }, [categoryId, subcategoryId, supplierId, productName]);

  const fetchCategories = async () => {
    const data = await getCategories();
    setCategories(data);
  };

  const fetchSubcategories = async () => {
    const data = await getSubcategories();
    setSubCategories(data);
  };

  const fetchSuppliers = async () => {
    const data = await getSuppliers();
    setSuppliers(data);
  };

  // const filteredProducts = products.filter((product) => {
  //   const matchesSearch =
  //     product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     product.description.toLowerCase().includes(searchQuery.toLowerCase())

  //   const matchesCategory = categoryFilter === "all" || product.categoryName === categoryFilter

  //   return matchesSearch && matchesCategory
  // })

  const handleDeleteProduct = (id: number) => {
    deleteProduct(id);
    setProducts(products.filter((product) => product.id !== id));
  };

  console.log(products);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">
            Manage your product inventory and details
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/products/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select
            value={categoryId || "all"} // Default to "all" if categoryId is an empty string
            onValueChange={(value) =>
              setCategoryId(value === "all" ? "" : value)
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={subcategoryId || "all"} // Default to "all" if subcategoryId is an empty string
            onValueChange={(value) =>
              setSubcategoryId(value === "all" ? "" : value)
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Subcategories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subcategories</SelectItem>
              {subcategories.map((subcategory) => (
                <SelectItem
                  key={subcategory.id}
                  value={subcategory.id.toString()}
                >
                  {subcategory.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={supplierId || "all"} // Default to "all" if supplierId is an empty string
            onValueChange={(value) =>
              setSupplierId(value === "all" ? "" : value)
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Suppliers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Suppliers</SelectItem>
              {suppliers.map((supplier) => (
                <SelectItem key={supplier.id} value={supplier.id.toString()}>
                  {supplier.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Sold</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <Package className="h-8 w-8 text-muted-foreground" />
                    <p className="mt-2 text-lg font-medium">
                      No products found
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Try adjusting your search or filter to find what you're
                      looking for.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          product.imageUrls[0] ? uploadsUrl+product.imageUrls[0] : "/placeholder.jpg"
                        }
                        alt={product.name}
                        className="h-16 w-16 rounded-md object-cover"
                      />
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {product.description}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{product.category?.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {product.subcategory.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                  <TableCell>{product.amount}</TableCell>
                  <TableCell>{product.sold}</TableCell>
                  <TableCell>{product.supplier?.name || "—"}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/products/${product.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            <span>View</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/products/${product.id}/edit`}>
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Edit</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
