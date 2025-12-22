"use client";

import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import type { Invoice } from "@/types/models";

/**
 * Fetch a single invoice by ID
 */
export const useInvoice = (
  id: string | undefined,
  options?: Omit<UseQueryOptions<Invoice, Error>, "queryKey" | "queryFn">
) => {
  return useQuery({
    queryKey: queryKeys.invoice(id || ""),
    queryFn: () => apiClient.get<Invoice>(`/api/invoices/${id}`),
    enabled: !!id, // Only fetch if ID is provided
    ...options,
  });
};
