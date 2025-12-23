"use client";

import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { InvoiceListItem } from "@/components/invoices/invoices";
import { apiClient } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";

/**
 * Fetch a single invoice by ID
 */
export const useInvoice = (
  id: string | undefined,
  options?: Omit<
    UseQueryOptions<InvoiceListItem, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: queryKeys.invoice(id || ""),
    queryFn: () => apiClient.get<InvoiceListItem>(`/api/invoices/${id}`),
    enabled: !!id, // Only fetch if ID is provided
    ...options,
  });
};
