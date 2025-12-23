"use client";

import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";

/**
 * Delete a client
 */
export const useDeleteClient = (
  id: string,
  options?: Omit<UseMutationOptions<void, Error, void, unknown>, "mutationFn">
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: () => apiClient.delete<void>(`/api/clients/${id}`),
    onSuccess: async (...args) => {
      // Invalidate clients list to refetch
      await queryClient.invalidateQueries({ queryKey: queryKeys.clients });
      // Remove the deleted client from cache
      await queryClient.removeQueries({ queryKey: queryKeys.client(id) });
      await options?.onSuccess?.(...args);
    },
  });
};
