"use client";

import {
  useMutation,
  type UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import type { Invoice } from "@/types/models";

type CreateInvoiceItem = {
  product_id: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
  quantityInput?: string;
};

type CreateInvoiceData = Omit<
  Invoice,
  "id" | "account_id" | "created_at" | "items"
> & {
  items: CreateInvoiceItem[];
};

/**
 * Create a new invoice
 */
export const useCreateInvoice = (
  options?: Omit<
    UseMutationOptions<Invoice, Error, CreateInvoiceData, unknown>,
    "mutationFn"
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (data: CreateInvoiceData) =>
      apiClient.post<Invoice>("/api/invoices", data),
    onSuccess: async (...args) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.invoices });
      await options?.onSuccess?.(...args);
    },
  });
};
