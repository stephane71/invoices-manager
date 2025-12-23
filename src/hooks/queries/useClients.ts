"use client";

import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import type { Client } from "@/types/models";

/**
 * Fetch all clients for the current user
 */
export const useClients = (
  options?: Omit<UseQueryOptions<Client[], Error>, "queryKey" | "queryFn">
) => {
  return useQuery({
    queryKey: queryKeys.clients,
    queryFn: () => apiClient.get<Client[]>("/api/clients"),
    ...options,
  });
};
