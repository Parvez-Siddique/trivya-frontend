"use server";

import { serverAPI } from "@/lib/serverAPI";


/*
 * ============================================================
 * PRODUCT STATUS
 * ============================================================
 */

export type ProductStatusPayload = {
  productId: number;
  isActive: boolean;
};


/*
 * ============================================================
 * PRODUCT VARIATION
 * ============================================================
 */

export type ProductVariation = {
  id?: number;

  size_variation: string;

  price_variation: string;

  variation_image_one: string | null;
  variation_image_two: string | null;
  variation_image_three: string | null;
  variation_image_four: string | null;
};


/*
 * ============================================================
 * PRODUCT
 * ============================================================
 */

export type Product = {
  id: number;

  product_name: string;

  subheading: string;

  description: string;

  product_image: string;

  isActive: boolean;

  created_at: string;

  updated_at: string;

  product_variations: ProductVariation[];
};


/*
 * ============================================================
 * PRODUCT LIST RESPONSE
 * ============================================================
 */

export type ProductListParams = {
  page?: number;
  page_size?: number;
};


/*
 * ============================================================
 * CREATE PRODUCT DATA
 * ============================================================
 *
 * Product price does NOT exist here.
 *
 * Price belongs to ProductDetails /
 * ProductVariation.
 * ============================================================
 */

export type CreateProductData = {
  product_name: string;

  subheading: string;

  description: string;

  product_image: File;

  isActive: boolean;
};


/*
 * ============================================================
 * CREATE PRODUCT VARIATION DATA
 * ============================================================
 */

export type CreateProductVariationData = {
  size_variation: string;

  price_variation: string;

  variation_image_one?: File;

  variation_image_two?: File;

  variation_image_three?: File;

  variation_image_four?: File;
};


/*
 * ============================================================
 * CREATE PRODUCT REQUEST
 * ============================================================
 */

export type CreateProductRequest = {
  product_data: CreateProductData;

  product_variation_data: CreateProductVariationData[];
};


/*
 * ============================================================
 * PRODUCT DETAIL RESPONSE
 * ============================================================
 */

export type ProductDetailResponse = {
  status: string;

  data: Product;
};


/*
 * ============================================================
 * CREATE PRODUCT
 * ============================================================
 */

export async function createProduct(
  formData: FormData
) {
  try {
    const data = await serverAPI<{
      status: string;
      product_id?: number;
    }>(
      "/products/create/",
      {
        method: "POST",
        body: formData,
      }
    );

    return {
      success: data.status === "SUCCESS",

      data,

      error:
        data.status === "SUCCESS"
          ? undefined
          : "Product creation failed",
    };

  } catch (error) {

    console.error(
      "Create product error:",
      error
    );

    return {
      success: false,

      error:
        error instanceof Error
          ? error.message
          : "Something went wrong",
    };
  }
}


/*
 * ============================================================
 * GET PRODUCTS
 * ============================================================
 */

export async function getProducts(
  params: ProductListParams = {}
) {
  try {

    const products = await serverAPI<Product[]>(
      "/products/list/",
      {
        method: "GET",
        params,
      }
    );

    return {
      success: true,

      data: products,
    };

  } catch (error) {

    console.error(
      "Get products error:",
      error
    );

    return {
      success: false,

      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch products",
    };
  }
}


export async function getProductDetails({
  product_id,
}: {
  product_id: number;
}) {
  try {

    const response =
      await serverAPI<ProductDetailResponse>(
        "/products/update/",
        {
          method: "GET",

          params: {
            product_id,
          },
        }
      );

    return {
      success:
        response.status === "SUCCESS",

      data:
        response.data,

      error:
        response.status === "SUCCESS"
          ? undefined
          : "Failed to fetch product",
    };

  } catch (error) {

    console.error(
      "Get product details error:",
      error
    );

    return {
      success: false,

      data: null,

      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch product",
    };
  }
}


export async function updateProduct(
  formData: FormData,
  product_id: number | undefined
) {
  try {

    const data =
      await serverAPI<{
        status: string;

        message?: string;

        data?: Product;
      }>(
        "/products/update/",
        {
          method: "PUT",

          params: {
            product_id,
          },

          body: formData,
        }
      );

    return {
      success:
        data.status === "SUCCESS",

      data,

      error:
        data.status === "SUCCESS"
          ? undefined
          : "Product update failed",
    };

  } catch (error) {

    console.error(
      "Update product error:",
      error
    );

    return {
      success: false,

      data: null,

      error:
        error instanceof Error
          ? error.message
          : "Something went wrong",
    };
  }
}


/*
 * ============================================================
 * PRODUCT STATUS CHANGE
 * ============================================================
 *
 * This remains separate from ProductUpdateView because
 * you already have a dedicated backend endpoint:
 *
 * PUT /products/status-change/
 * ============================================================
 */

export async function handleProductStatusChange(
  statusData: ProductStatusPayload
) {
  try {

    const data =
      await serverAPI<{
        status: string;
      }>(
        "/products/status-change/",
        {
          method: "PUT",

          body: statusData,
        }
      );

    return {
      success:
        data.status === "SUCCESS",

      error:
        data.status === "SUCCESS"
          ? undefined
          : "Failed to change product status",
    };

  } catch (error) {

    console.error(
      "Product status change error:",
      error
    );

    return {
      success: false,

      error:
        error instanceof Error
          ? error.message
          : "Something went wrong",
    };
  }
}


/*
 * ============================================================
 * DELETE PRODUCT
 * ============================================================
 *
 * Backend:
 *
 * DELETE /products/update/?product_id=1
 *
 * The backend deletes ProductDetails first and then Product.
 * ============================================================
 */

export async function handleProductDelete(
  productId: number
) {
  try {

    const data =
      await serverAPI<{
        status: string;

        message?: string;
      }>(
        "/products/update/",
        {
          method: "DELETE",

          params: {
            product_id: productId,
          },
        }
      );

    return {
      success:
        data.status === "SUCCESS",

      error:
        data.status === "SUCCESS"
          ? undefined
          : "Product deletion failed",
    };

  } catch (error) {

    console.error(
      "Product delete error:",
      error
    );

    return {
      success: false,

      error:
        error instanceof Error
          ? error.message
          : "Something went wrong",
    };
  }
}


/*
 * ============================================================
 * PUBLIC PRODUCT LIST
 * ============================================================
 *
 * No authentication.
 * ============================================================
 */

export async function getProductsPublicList(
  params: ProductListParams = {}
) {
  try {

    const products =
      await serverAPI<Product[]>(
        "/products/product-public-list/",
        {
          method: "GET",

          params,

          requiresAuth: false,
        }
      );

    return {
      success: true,

      data: products,
    };

  } catch (error) {

    console.error(
      "Get public products error:",
      error
    );

    return {
      success: false,

      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch products",
    };
  }
}