

"use server";

import { serverAPI } from "@/lib/serverAPI";

export type OrderDetails = {
  product: number;
  quantity: number;
  product_size: string;
  price: number;
};

export type CreateOrderPayload = {
  user: number;
  payment_status : string;
  total_quantity : string;
  total_price: string;
  order_details: OrderDetails[];
};

export type CreateCustomerPayload = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  user_type?: "ADMIN" | "CUSTOMER";
  streetName?: string;
  area?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

export type PlaceOrderPayload = {
  customer_data: CreateCustomerPayload;
  order_data : CreateOrderPayload;
};


export type ProductVariation = {
  id?: number;

  size_variation: string;

  price_variation: string;

  variation_image_one: string | null;
  variation_image_two: string | null;
  variation_image_three: string | null;
  variation_image_four: string | null;
};

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

export type ProductDetailResponse = {
  status: string;

  data: Product;
};

export interface CartStorageItem {
  productId: number;
  variationId: number;
  product_count: number;
}

export interface GetCartDetailsItem {
  product_id: number;
  variation_id: number;
  product_count: number;
}

export interface GetCartDetailsPayload {
  cart: GetCartDetailsItem[];
}

export interface CartDetailDTO {
  product_id: number;
  variation_id: number;
  product_count: number;

  product_name: string;
  product_image: string | null;

  size_variation: string;
  price_variation: string | null;
}

export async function createOrder(data: CreateOrderPayload | null | undefined) {
  try {
    if (!data) {
      return {
        success: false,
        error: "Order data is required",
      };
    }

    const response = await serverAPI("/orders/create-order/",
      {
        method: "POST",
        body: data,
      }
    );

    return {
      success: true,
      data: response,
    };

  } catch (error) {

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to create order",
    };
  }
}

type PlaceOrderResponse = {
  status: "SUCCESS" | "FAILED";
};

export async function placeOrder(
  data: PlaceOrderPayload | null | undefined
): Promise<PlaceOrderResponse> {
  try {
    if (!data) {
      return {
        status: "FAILED",
      };
    }

    const response = await serverAPI(
      "/orders/place-order/",
      {
        method: "POST",
        body: data,
      }
    ) as PlaceOrderResponse;

    return response;

  } catch (error) {

    console.error("Failed to place order:", error);

    return {
      status: "FAILED",
    };
  }
}


export async function getPublicProductDetails({
  product_id,
}: {
  product_id: number;
}) {
  try {

    const response =
      await serverAPI<ProductDetailResponse>(
        "/products/get-public-product-details/",
        {
          method: "GET",

          params: {
            product_id,
          },
          requiresAuth: false
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


export async function getCartProductDetails({cart}: {
  cart: CartStorageItem[];
}) {
  try {
    const payload: GetCartDetailsPayload = {
      cart: cart.map((item) => ({
        product_id: item.productId,
        variation_id: item.variationId,
        product_count: item.product_count,
      })),
    };

    const response =
      await serverAPI<CartDetailDTO[]>(
        "/products/get-cart-details/",
        {
          method: "POST",
          body: payload,
          requiresAuth: false,
        }
      );

    // Your API returns the array directly.
    const cartDetails = Array.isArray(response)
      ? response
      : [];

    return {
      success: true,
      data: cartDetails,
      error: undefined,
    };
  } catch (error) {
    console.error(
      "Get cart details error:",
      error
    );

    return {
      success: false,
      data: [],
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch cart details",
    };
  }
}