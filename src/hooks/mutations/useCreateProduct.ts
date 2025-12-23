"use client";

import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import type { Product } from "@/types/models";

type CreateProductData = Omit<Product, "id" | "account_id" | "created_at">;

/**
 * Create a new product
 */
export const useCreateProduct = (
  options?: Omit<
    UseMutationOptions<Product, Error, CreateProductData, unknown>,
    "mutationFn"
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (data: CreateProductData) =>
      apiClient.post<Product>("/api/products", data),
    onSuccess: async (...args) => {
      // Invalidate products list to refetch
      await queryClient.invalidateQueries({ queryKey: queryKeys.products });
      await options?.onSuccess?.(...args);
    },
  });
};
