"use client";

import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import type { Profile } from "@/types/models";

type UpdateProfileData = Partial<Omit<Profile, "id" | "created_at" | "updated_at">>;

/**
 * Update the current user's profile
 */
export const useUpdateProfile = (
  options?: Omit<
    UseMutationOptions<Profile, Error, UpdateProfileData, unknown>,
    "mutationFn"
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (data: UpdateProfileData) =>
      apiClient.put<Profile>("/api/profile", data),
    onSuccess: async (...args) => {
      // Invalidate profile to refetch
      await queryClient.invalidateQueries({ queryKey: queryKeys.profile });
      await queryClient.invalidateQueries({ queryKey: queryKeys.profileValidation });
      await options?.onSuccess?.(...args);
    },
  });
};
