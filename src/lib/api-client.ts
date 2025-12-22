/**
 * Centralized API client for making HTTP requests
 * Provides consistent error handling and response parsing
 */

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public fields?: Record<string, string>
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type ApiResponse<T> = {
  data: T;
  error?: never;
};

type ApiErrorResponse = {
  error: string;
  fields?: Record<string, string>;
  data?: never;
};

/**
 * Makes a fetch request with standardized error handling
 */
const apiFetch = async <T>(
  url: string,
  options?: RequestInit
): Promise<T> => {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(
      data.error || "An error occurred",
      response.status,
      data.fields
    );
  }

  return data as T;
};

/**
 * API client methods
 */
export const apiClient = {
  get: <T>(url: string) => apiFetch<T>(url, { method: "GET" }),

  post: <T>(url: string, body: unknown) =>
    apiFetch<T>(url, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  patch: <T>(url: string, body: unknown) =>
    apiFetch<T>(url, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  put: <T>(url: string, body: unknown) =>
    apiFetch<T>(url, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  delete: <T>(url: string) => apiFetch<T>(url, { method: "DELETE" }),
};
