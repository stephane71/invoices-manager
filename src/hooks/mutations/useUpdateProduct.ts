"use client";

import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import type { Product } from "@/types/models";

type UpdateProductData = Partial<Omit<Product, "id" | "account_id" | "created_at">>;

/**
 * Update an existing product
 */
export const useUpdateProduct = (
  id: string,
  options?: Omit<
    UseMutationOptions<Product, Error, UpdateProductData, unknown>,
    "mutationFn"
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (data: UpdateProductData) =>
      apiClient.patch<Product>(`/api/products/${id}`, data),
    onSuccess: async (...args) => {
      // Invalidate both the products list and the specific product
      await queryClient.invalidateQueries({ queryKey: queryKeys.products });
      await queryClient.invalidateQueries({ queryKey: queryKeys.product(id) });
      await options?.onSuccess?.(...args);
    },
  });
};
