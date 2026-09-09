"use server";

import { serverAPI } from "@/lib/serverAPI";
import { createCustomerSession, deleteCustomerSession, deleteSession } from "@/lib/session";
import { redirect } from "next/dist/client/components/navigation";

export type CreateUserPayload = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  username: string;
  password: string;
  user_type: "ADMIN" | "CUSTOMER";
};

export type LoginUserPayload = {
  username: string;
  password: string;
};

export type LoginCustomerResponse = {
  message: string;
  user: {
    id: number;
    username: string;
    name: string;
    email: string;
    token: string
    phone_number: string | null;
    user_type: "ADMIN" | "CUSTOMER";
    first_name ?: string;
    last_name ? : string;
  };
};


/* =========================================================
   CREATE USER
========================================================= */

export async function createUser(data: CreateUserPayload | null | undefined) {
  try {
    if (!data) {
      return {
        success: false,
        error: "User data is required",
      };
    }

    const response = await serverAPI("/users/create-user/",
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
          : "Failed to create user",
    };
  }
}


/* =========================================================
   CUSTOMER LOGIN
========================================================= */

export async function loginCustomer(
  data: LoginUserPayload | null | undefined
) {
  try {
    if (!data) {
      return {
        success: false,
        error: "Login credentials are required",
      };
    }

    const response =
      await serverAPI<LoginCustomerResponse>(
        "/users/customer-login/",
        {
          method: "POST",
          body: data,
        }
      );

    // Make sure backend returned a user
    if (!response?.user) {
      return {
        success: false,
        error: "Invalid login response from server",
      };
    }

    // Create customer session cookie
    await createCustomerSession(response.user);

    return {
      success: true,
      data: response,
    };

  } catch (error) {

    console.log(error,"KOKOKOKOKOKSOSKJIJ")

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to login",
    };
  }
}

export async function logoutCustomer() {
  try {
    await deleteCustomerSession();

    return {
      success: true,
      status: 200,
      message: "Logout successful",
    };
  } catch (error) {
    return {
      success: false,
      status: 400,
      message: "Failed to logout",
    };
  }
}