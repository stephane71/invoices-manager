"use client";

import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import type { Product } from "@/types/models";

/**
 * Fetch all products for the current user
 */
export const useProducts = (
  options?: Omit<UseQueryOptions<Product[], Error>, "queryKey" | "queryFn">
) => {
  return useQuery({
    queryKey: queryKeys.products,
    queryFn: () => apiClient.get<Product[]>("/api/products"),
    ...options,
  });
};
