"use server";

import { serverAPI } from "@/lib/serverAPI";

export type ProductStatusPayload = {
    productId : number
    isActive : boolean
}

export type CreateProductData = {
  product_name: string;
  subheading: string;
  description: string;
  product_qty: string;
  product_image: File;
  price: number;
};

export type Product = {
  id: number;
  product_name: string;
  subheading: string;
  product_qty: string;
  isActive: boolean;
  description: string;
  product_image: string;
  price: number;
  created_at: string;
  updated_at: string;
};

export type ProductListParams = {
  page?: number;
  page_size?: number;
};



export async function createProduct(formData: FormData) {
  try {
    const data = await serverAPI<{ status: string }>(
      "/products/create/",
      {
        method: "POST",
        body: formData,
      }
    );

    return {
      success: data.status === "SUCCESS",
      data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error
        ? error.message
        : "Something went wrong",
    };
  }
}

export async function getProducts(params: ProductListParams = {}) {
  try {
    const products = await serverAPI<Product[]>("/products/list/", {
      method: "GET",
      params,
    });

    return {
      success: true,
      data: products,
    };
  } catch (error) {
    console.error("Get products error:", error);

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch products",
    };
  }
}


export async function getProductDetails({ product_id }: { product_id: number }) {
  try {
    const products = await serverAPI<Product>("/products/getProduct/", {
      method: "GET",
      params: { product_id },
    });

    return {
      success: true,
      data: products,
    };
  } catch (error) {
    console.error("Get products error:", error);

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch products",
    };
  }
}


export async function updateProduct(
  formData: FormData,
  product_id: number
) {
  try {
    const data = await serverAPI<{ status: string }>(
      "/products/update/",
      {
        method: "PUT",
        params: { product_id },
        body: formData,
      }
    );

    return {
      success: data.status === "SUCCESS",
      data,
      error:
        data.status === "SUCCESS"
          ? undefined
          : "Product update failed",
    };
  } catch (error) {
    console.error("updateProduct error:", error);

    return {
      success: false,
      data: null,
      error:
        error instanceof Error
          ? error.message
          : String(error),
    };
  }
}


export async function handleProductStatusChange(statusData : ProductStatusPayload) {
  try {
    const data = await serverAPI<{ status: string }>(
      "/products/status-change/",
      {
        method: "PUT",
        body: statusData,
      }
    );

    return {
      success: data.status === "SUCCESS"
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error
        ? error.message
        : "Something went wrong",
    };
  }
}


export async function handleProductDelete(productId: number) {
  try {
    const data = await serverAPI<{ status: string }>(
      `/products/product-delete/?product_id=${productId}`,
      {
        method: "DELETE",
      }
    );

    return {
      success: data.status === "SUCCESS",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error
        ? error.message
        : "Something went wrong",
    };
  }
}