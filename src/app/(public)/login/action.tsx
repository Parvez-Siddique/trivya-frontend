
"use server";

import { serverAPI } from "@/lib/serverAPI";
import { createSession, deleteSession} from "@/lib/session";
import { redirect } from "next/navigation";

export type LoginUserData = {
  username: string;
  password: string;
};

export type LoginUserResponse = {
  message: string;
  user: {
    id: number;
    username: string;
    name: string;
    email: string;
    phone_number: string | null;
    token: string;
    first_name ?: string;
    last_name ? : string;
    user_type: "ADMIN" | "CUSTOMER";
  };
};

export async function loginUser(payload: LoginUserData) {
  try {
    const data = await serverAPI<LoginUserResponse>("/users/admin-login/",
      {
        method: "POST",
        body: payload,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    await createSession(data.user);

    return {
      success: true,
      data,
    };

    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Something went wrong",
      };
    }
  }



export async function logoutUser() {
  try {
    await deleteSession();

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