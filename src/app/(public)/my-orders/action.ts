

"use server";

import { serverAPI } from "@/lib/serverAPI";
import { getCustomerSession } from "@/lib/session";

export type CustomerOrderDetailDTO = {
  id: number;
  product: number;
  product_name: string;
  product_image: string | null;
  quantity: number;
  price: string;
};

export type CustomerOrderListDTO = {
  id: number;
  order_code: string;
  payment_status: string;
  customer_name: string;
  total_quantity: number;
  total_price: string;
  order_details: CustomerOrderDetailDTO[];
  created_at: string;
  updated_at: string;
};

export type CustomerOrderListParams = {
  page?: number;
  page_size?: number;
  customer_id?: number;
};

export async function getCustomerOrders(params: CustomerOrderListParams = {}) {
  try {
    const products = await serverAPI<CustomerOrderListDTO[]>("/orders/customer-orders/", {
      method: "GET",
      params
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

export async function getMyOrders(params: CustomerOrderListParams = {}) {
  try {
    const products = await serverAPI<CustomerOrderListDTO[]>("/orders/my-orders/", {
      method: "GET",
      params
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