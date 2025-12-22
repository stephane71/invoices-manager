"use client";

import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import type { Product } from "@/types/models";

/**
 * Fetch a single product by ID
 */
export const useProduct = (
  id: string | undefined,
  options?: Omit<UseQueryOptions<Product, Error>, "queryKey" | "queryFn">
) => {
  return useQuery({
    queryKey: queryKeys.product(id || ""),
    queryFn: () => apiClient.get<Product>(`/api/products/${id}`),
    enabled: !!id, // Only fetch if ID is provided
    ...options,
  });
};
