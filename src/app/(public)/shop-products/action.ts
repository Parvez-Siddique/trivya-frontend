

"use server";

import { serverAPI } from "@/lib/serverAPI";

export type OrderDetails = {
  product: number;
  quantity: number;
  price: number;
};

export type CreateOrderPayload = {
  user: number;
  payment_status : string;
  total_quantity : string;
  total_price: string;
  order_details: OrderDetails[];
};


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
