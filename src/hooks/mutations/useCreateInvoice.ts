"use client";

import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import type { Invoice } from "@/types/models";

type CreateInvoiceData = Omit<Invoice, "id" | "account_id" | "created_at">;

/**
 * Create a new invoice
 */
export const useCreateInvoice = (
  options?: Omit<
    UseMutationOptions<Invoice, Error, CreateInvoiceData, unknown>,
    "mutationFn"
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (data: CreateInvoiceData) =>
      apiClient.post<Invoice>("/api/invoices", data),
    onSuccess: async (...args) => {
      // Invalidate invoices list to refetch
      await queryClient.invalidateQueries({ queryKey: queryKeys.invoices });
      await options?.onSuccess?.(...args);
    },
  });
};
