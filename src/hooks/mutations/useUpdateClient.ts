"use client";

import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import type { Client } from "@/types/models";

type UpdateClientData = Partial<Omit<Client, "id" | "account_id" | "created_at">>;

/**
 * Update an existing client
 */
export const useUpdateClient = (
  id: string,
  options?: Omit<
    UseMutationOptions<Client, Error, UpdateClientData, unknown>,
    "mutationFn"
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (data: UpdateClientData) =>
      apiClient.patch<Client>(`/api/clients/${id}`, data),
    onSuccess: async (...args) => {
      // Invalidate both the clients list and the specific client
      await queryClient.invalidateQueries({ queryKey: queryKeys.clients });
      await queryClient.invalidateQueries({ queryKey: queryKeys.client(id) });
      await options?.onSuccess?.(...args);
    },
  });
};
