
import { Category } from "@/app/dashboard/categories/page";
import { Order } from "@/app/dashboard/orders/page";
import { Product } from "@/app/dashboard/products/page";
import { Supplier } from "@/app/dashboard/suppliers/page";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { th } from "date-fns/locale";

export const uploadsUrl = "http://localhost:5056/uploads";
export const api = axios.create({
  baseURL: "http://localhost:5056",
  timeout: 1000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Products
export async function getProducts(params?: {
  categoryId?: number | null;
  subcategoryId?: number | null;
  supplierId?: number | null;
  productName?: string;
}): Promise<Product[]> {
  return api
    .get("/products", { params })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Products error:", error);
      toast({
        title: "Products fetch failed",
        description: "Please try again later.",
        variant: "destructive",
      });
      throw new Error("Products fetch failed");
    });
}

export async function getProduct(id: number): Promise<Product> {
  return api
    .get(`/products/${id}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Product error:", error);
      toast({
        title: "Product fetch failed",
        description: "Please try again later.",
        variant: "destructive",
      });
      throw new Error("Product fetch failed");
    });
}
export async function createProduct(data: {
  name: string;
  description: string;
  price: number;
  amount: number;
  sold?: number;
  imageUrl?: string;
  categoryId: number;
  subcategoryId: number;
  supplierId: number | null;
}) {
  return api
    .post("/products", data)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Product creation error:", error);
      toast({
        title: "Product creation failed",
        description: "Please try again later.",
        variant: "destructive",
      });
      throw new Error("Product creation failed");
    });
}
export async function updateProduct(
  id: number,
  data: {
    name: string;
    description: string;
    price: number;
    amount: number;
    sold?: number;
    imageUrl?: string;
    categoryId: number;
    subcategoryId: number;
    supplierId: number | null;
  }
) {
  return api
    .put(`/products/${id}`, data)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Product update error:", error);
      toast({
        title: "Product update failed",
        description: "Please try again later.",
        variant: "destructive",
      });
      throw new Error("Product update failed");
    });
}
export async function deleteProduct(id: number) {
  return api
    .delete(`/products/${id}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Product deletion error:", error);
      toast({
        title: "Product deletion failed",
        description: "Please try again later.",
        variant: "destructive",
      });
      throw new Error("Product deletion failed");
    });
}

// Categories
export async function getCategories(): Promise<Category[]> {
  return api
    .get("/categories")
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Categories error:", error);
      toast({
        title: "Categories fetch failed",
        description: "Please try again later.",
        variant: "destructive",
      });
      throw new Error("Categories fetch failed");
    });
}

export async function getCategory(id: number) : Promise<Category> {
  return api.get(`/categories/${id}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Category error:", error);
      toast({
        title: "Category fetch failed",
        description: "Please try again later.",
        variant: "destructive",
      });
      throw new Error("Category fetch failed");
    }
  )
}

export async function createCategory(data: { name: string }) {
  // Simulate API call
  api.post("/categories", data)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Category creation error:", error);
      toast({
        title: "Category creation failed",
        description: "Please try again later.",
        variant: "destructive",
      });
      throw new Error("Category creation failed");
    }
  );
}

export async function updateCategory(id: number, data: { name: string }) { 
  api.put(`/categories/${id}`, data)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Category update error:", error);
      toast({
        title: "Category update failed",
        description: "Please try again later.",
        variant: "destructive",
      });
      throw new Error("Category update failed");
    }
  );
}

export async function deleteCategory(id: number) {
  api.delete(`/categories/${id}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Category deletion error:", error);
      toast({
        title: "Category deletion failed",
        description: "Please try again later.",
        variant: "destructive",
      });
      throw new Error("Category deletion failed");
    }
  );
}

// Subcategories
export async function getSubcategories() {
  
  return api.get("/subcategories")
    .then((response) => {
      return response.data;
    }
  )
    .catch((error) => {
      console.error("Subcategories error:", error);
      toast({
        title: "Subcategories fetch failed",
        description: "Please try again later.",
        variant: "destructive",
      });
      throw new Error("Subcategories fetch failed");
    }
  );
}

export async function getSubcategory(id: number) {
  // Simulate API call
  return api.get(`/subcategories/${id}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Subcategory error:", error);
      toast({
        title: "Subcategory fetch failed",
        description: "Please try again later.",
        variant: "destructive",
      });
      throw new Error("Subcategory fetch failed");
    }
  );
}

export async function createSubcategory(data: {
  name: string;
  categoryId: number;
}) {
  
  api.post("/subcategories", data)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Subcategory creation error:", error);
      toast({
        title: "Subcategory creation failed",
        description: "Please try again later.",
        variant: "destructive",
      });
      throw new Error("Subcategory creation failed");
    }
  );
}

export async function updateSubcategory(
  id: number,
  data: { name: string; categoryId: number }
) {
  api.put(`/subcategories/${id}`, data)
    .then((response) => {
      return response.data;
    }
  )
    .catch((error) => {
      console.error("Subcategory update error:", error);
      toast({
        title: "Subcategory update failed",
        description: "Please try again later.",
        variant: "destructive",
      });
      throw new Error("Subcategory update failed");
    }
  );
}

export async function deleteSubcategory(id: number) {
  api.delete(`/subcategories/${id}`)
    .then((response) => {
      return response.data;
    }
  )
    .catch((error) => {
      console.error("Subcategory deletion error:", error);
      toast({
        title: "Subcategory deletion failed",
        description: "Please try again later.",
        variant: "destructive",
      });
      throw new Error("Subcategory deletion failed");
    }
  );
}

// Suppliers
export async function getSuppliers() : Promise<Supplier[]> {
  return api.get("/suppliers")
    .then((response) => {
      return response.data;
    }
  )
    .catch((error) => {
      console.error("Suppliers error:", error);
      toast({
        title: "Suppliers fetch failed",
        description: "Please try again later.",
        variant: "destructive",
      });
      throw new Error("Suppliers fetch failed");
    }
  );
}

export async function getSupplier(id: number) : Promise<Supplier> {
  return api.get(`/suppliers/${id}`)
    .then((response) => {
      return response.data;
    }
  )
    .catch((error) => {
      console.error("Supplier error:", error);
      toast({
        title: "Supplier fetch failed",
        description: "Please try again later.",
        variant: "destructive",
      });
      throw new Error("Supplier fetch failed");
    }
  );
}

export async function createSupplier(data: {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
}) {
  api.post("/suppliers", data)
    .then((response) => {
      return response.data;
    }
  )
    .catch((error) => {
      console.error("Supplier creation error:", error);
      toast({
        title: "Supplier creation failed",
        description: "Please try again later.",
        variant: "destructive",
      });
      throw new Error("Supplier creation failed");
    }
  );
}

export async function updateSupplier(
  id: number,
  data: {
    name: string;
    phone: string;
    email: string;
    address: string;
    city: string;
  }
) {
  api.put(`/suppliers/${id}`, data)
    .then((response) => {
      return response.data;
    }
  )
    .catch((error) => {
      console.error("Supplier update error:", error);
      toast({
        title: "Supplier update failed",
        description: "Please try again later.",
        variant: "destructive",
      });
      throw new Error("Supplier update failed");
    }
  );
}

export async function deleteSupplier(id: number) {
  api.delete(`/suppliers/${id}`)
    .then((response) => {
      return response.data;
    }
  )
    .catch((error) => {
      console.error("Supplier deletion error:", error);
      toast({
        title: "Supplier deletion failed",
        description: "Please try again later.",
        variant: "destructive",
      });
      throw new Error("Supplier deletion failed");
    }
  );
}

// Orders
export async function getOrders(): Promise<Order[]> {
  return api.get("/orders").then((response) => {
    return response.data;
  }
  ).catch((error) => {
    console.error("Orders error:", error);
    toast({
      title: "Orders fetch failed",
      description: "Please try again later.",
      variant: "destructive",
    });
    throw new Error("Orders fetch failed");
  }
  );
}

export async function getOrder(id: number) : Promise<Order> {
  return api.get(`/orders/${id}`).then((response) => {
    return response.data;
  }
  ).catch((error) => {
    console.error("Order error:", error);
    toast({
      title: "Order fetch failed",
      description: "Please try again later.",
      variant: "destructive",
    });
    throw new Error("Order fetch failed");
  }
  );
}

export async function updateOrderStatus(id: number, status: string) {
  api.put(`/orders/${id}/status`, { status })
    .then((response) => {
      return response.data;
    }
  )
    .catch((error) => {
      console.error("Order status update error:", error);
      toast({
        title: "Order status update failed",
        description: "Please try again later.",
        variant: "destructive",
      });
      throw new Error("Order status update failed");
    }
  );
}

export async function deleteOrder(id: number) {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 500);
  });
}
