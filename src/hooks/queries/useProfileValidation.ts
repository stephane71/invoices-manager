"use client";

import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import type { ProfileValidationResult } from "@/lib/validation";

/**
 * Check if the current user's profile is valid for invoice generation
 */
export const useProfileValidation = (
  options?: Omit<
    UseQueryOptions<ProfileValidationResult, Error>,
    "queryKey" | "queryFn"
  >,
) => {
  return useQuery({
    queryKey: queryKeys.profileValidation,
    queryFn: () =>
      apiClient.get<ProfileValidationResult>("/api/profile/validate"),
    ...options,
  });
};
