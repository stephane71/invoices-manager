"use client";

import { useMutation, useQueryClient, type UseMutationOptions } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import type { Client } from "@/types/models";

type CreateClientData = Omit<Client, "id" | "account_id" | "created_at">;

/**
 * Create a new client
 */
export const useCreateClient = (
  options?: Omit<
    UseMutationOptions<Client, Error, CreateClientData, unknown>,
    "mutationFn"
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (data: CreateClientData) =>
      apiClient.post<Client>("/api/clients", data),
    onSuccess: async (...args) => {
      // Invalidate clients list to refetch
      await queryClient.invalidateQueries({ queryKey: queryKeys.clients });
      await options?.onSuccess?.(...args);
    },
  });
};
