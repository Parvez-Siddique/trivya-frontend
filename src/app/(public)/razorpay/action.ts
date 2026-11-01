"use server";

import { serverAPI } from "@/lib/serverAPI";


export type CreatePaymentResponse = {
  status: "SUCCESS" | "FAILED";
  key: string;
  razorpay_order_id: string;
  amount: number;
  currency: string;
  order_code: string;
};

export type VerifyPaymentPayload = {
  order_id: number;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

export type VerifyPaymentResponse = {
  status: "SUCCESS" | "FAILED";
  message?: string;
  order_code?: string;
  error?: string;
};


export async function createPayment(orderId: number):  Promise<CreatePaymentResponse> {
  return await serverAPI<CreatePaymentResponse>(
    "/orders/create-payment/",
    {
        method: "POST",
        body:{
            order_id: orderId
        },
        requiresAuth: false 
    },
    
  );
}

export async function verifyPayment(paymentData: VerifyPaymentPayload): Promise<VerifyPaymentResponse> {
  return await serverAPI<VerifyPaymentResponse>("/orders/verify-payment/", {
    method: "POST",
    body: paymentData,
    requiresAuth: false,
  });
}