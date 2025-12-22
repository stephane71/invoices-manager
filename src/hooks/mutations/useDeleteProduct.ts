"use client";

import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";

/**
 * Delete a product
 */
export const useDeleteProduct = (
  id: string,
  options?: Omit<UseMutationOptions<void, Error, void, unknown>, "mutationFn">
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: () => apiClient.delete<void>(`/api/products/${id}`),
    onSuccess: async (...args) => {
      // Invalidate products list to refetch
      await queryClient.invalidateQueries({ queryKey: queryKeys.products });
      // Remove the deleted product from cache
      await queryClient.removeQueries({ queryKey: queryKeys.product(id) });
      await options?.onSuccess?.(...args);
    },
  });
};
