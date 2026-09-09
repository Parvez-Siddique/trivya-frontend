"use server";

import { serverAPI } from "@/lib/serverAPI";

export type Users = {
  username: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  phoneNumber: string | null;
  user_type: string;
};

export type CustomerListParams = {
  page?: number;
  page_size?: number;
};


export async function getCustomers(params: CustomerListParams = {}) {
  try {
    const customers = await serverAPI<Users[]>("/users/customers-list/", {
      method: "GET",
      params,
    });

    return {
      success: true,
      data: customers,
    };
  } catch (error) {
    console.error("Get customers error:", error);

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to fetch customers",
    };
  }
}