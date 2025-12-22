"use client";

import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";

type ProfileValidation = {
  isValid: boolean;
  missingFields: string[];
};

/**
 * Check if the current user's profile is valid for invoice generation
 */
export const useProfileValidation = (
  options?: Omit<
    UseQueryOptions<ProfileValidation, Error>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery({
    queryKey: queryKeys.profileValidation,
    queryFn: () =>
      apiClient.get<ProfileValidation>("/api/profile/validation"),
    ...options,
  });
};
