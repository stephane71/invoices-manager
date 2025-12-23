"use client";

import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import type { Client } from "@/types/models";

/**
 * Fetch a single client by ID
 */
export const useClient = (
  id: string | undefined,
  options?: Omit<UseQueryOptions<Client, Error>, "queryKey" | "queryFn">
) => {
  return useQuery({
    queryKey: queryKeys.client(id || ""),
    queryFn: () => apiClient.get<Client>(`/api/clients/${id}`),
    enabled: !!id, // Only fetch if ID is provided
    ...options,
  });
};
