
"use server";

import { serverAPI } from "@/lib/serverAPI";


// ------------------------------------
// Payment Provider
// ------------------------------------

export type PaymentProviderParams = {
  page?: number;
  page_size?: number;
};


export type PaymentConfigDataParams = {
    payment_provider_id?: number;
    
}

export type PaymentProvider = {
  id: number;
  name: string;
};


export type PaymentConfigData = {
      id : number;
      provider : number;
      provider_name : string;
      key_id : string;
      key_secret: string;
      key_secret_configured : boolean;
      is_active : boolean
}


// ------------------------------------
// Payment Configuration
// ------------------------------------

export type PaymentConfig = {
  id?: number;
  provider: number;
  key_id: string;
  key_secret?: string;
  is_active: boolean;
};


// ------------------------------------
// Get Payment Providers
// ------------------------------------

export async function getPaymentProviders(
  params: PaymentProviderParams = {}
) {
  try {

    const paymentProviders =
      await serverAPI<PaymentProvider[]>(
        "/settings/payment-providers-list/",
        {
          method: "GET",
          params,
        }
      );

    return {
      success: true,
      data: paymentProviders,
    };

  } catch (error) {

    console.error(
      "Get payment providers error:",
      error
    );

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch payment providers",
    };
  }
}

export async function getPaymentConfigData(params: PaymentConfigDataParams) {
  try {
    const paymentConfigData = await serverAPI<PaymentConfigData>(
        "/settings/get-payment-config-data/",
        {
          method: "GET",
          params,
        }
      );

    return {
      success: true,
      data: paymentConfigData,
    };

  } catch (error) {

    console.error(
      "Get payment config error:",
      error
    );

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch payment configuration",
    };
  }
}


// ------------------------------------
// Create Payment Configuration
// ------------------------------------

export async function createPaymentConfig(
  data: PaymentConfig
) {
  try {

    const response = await serverAPI("/settings/create-payment-config/",
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

    console.error(
      "Create payment configuration error:",
      error
    );

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to save payment configuration",
    };
  }
}


// ------------------------------------
// Update Payment Configuration
// ------------------------------------

export async function updatePaymentConfig(
  id: number,
  data: Partial<PaymentConfig>
) {
  try {

    const response =
      await serverAPI(
        "/settings/update-payment-config/",
        {
          method: "PUT",

          params: {
            payment_gateway_id: id,
          },

          body: data,
        }
      );

    return {
      success: true,
      data: response,
    };

  } catch (error) {

    console.error(
      "Update payment configuration error:",
      error
    );

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update payment configuration",
    };
  }
}
