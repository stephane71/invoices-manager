"use client";

import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { InvoiceListItem } from "@/components/invoices/invoices";
import { apiClient } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";

/**
 * Fetch all invoices for the current user
 */
export const useInvoices = (
  options?: Omit<
    UseQueryOptions<InvoiceListItem[], Error>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: queryKeys.invoices,
    queryFn: () => apiClient.get<InvoiceListItem[]>("/api/invoices"),
    ...options,
  });
};
