
import { getSession } from "@/lib/session";

const BACKEND_URL = process.env.BACKEND_URL;

if (!BACKEND_URL) {
  throw new Error("BACKEND_URL is not defined");
}

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  headers?: HeadersInit;
  params?: Record<string, string | number | boolean | null | undefined>;
};

export async function serverAPI<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const {
    method = "GET",
    body,
    headers,
    params,
  } = options;

  // Get logged-in user session
  const userSession = await getSession();

  // Check whether the request body is FormData
  const isFormData = body instanceof FormData;

  // Build query parameters
  const queryParams = new URLSearchParams();

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });
  }

  // Build URL
  const url = `${BACKEND_URL}${endpoint}${
    queryParams.toString()
      ? `?${queryParams.toString()}`
      : ""
  }`;

  // Build headers
  const requestHeaders: HeadersInit = {
    // Django Knox authentication
    ...(userSession?.token
      ? {
          Authorization: `Token ${userSession.token}`,
        }
      : {}),

    // Add JSON content type ONLY when the body is NOT FormData
    ...(!isFormData
      ? {
          "Content-Type": "application/json",
        }
      : {}),

    // Allow custom headers to override defaults
    ...headers,
  };

  // Make request
  const response = await fetch(url, {
    method,
    headers: requestHeaders,

    body:
      body === undefined
        ? undefined
        : isFormData
        ? body
        : JSON.stringify(body),
  });

  // Parse response
  const responseData = await response.json().catch(() => null);

  // Handle API errors
  if (!response.ok) {
    throw new Error(
      responseData?.error ||
        responseData?.detail ||
        responseData?.errors
          ? JSON.stringify(
              responseData?.errors ||
                responseData?.error ||
                responseData?.detail
            )
          : "Something went wrong"
    );
  }

  return responseData as T;
}
