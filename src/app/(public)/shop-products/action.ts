

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

