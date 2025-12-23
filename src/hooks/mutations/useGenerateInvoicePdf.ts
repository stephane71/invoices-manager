"use client";

import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import type { Invoice } from "@/types/models";

/**
 * Generate PDF for an invoice
 */
export const useGenerateInvoicePdf = (
  id: string,
  options?: Omit<UseMutationOptions<Invoice, Error, void, unknown>, "mutationFn">
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: () =>
      apiClient.post<Invoice>(`/api/invoices/${id}/pdf`, {}),
    onSuccess: async (...args) => {
      // Invalidate the invoice to refetch with new pdf_url
      await queryClient.invalidateQueries({ queryKey: queryKeys.invoice(id) });
      await queryClient.invalidateQueries({ queryKey: queryKeys.invoices });
      await options?.onSuccess?.(...args);
    },
  });
};
