"use client";

import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import type { Profile } from "@/types/models";

/**
 * Fetch the current user's profile
 */
export const useProfile = (
  options?: Omit<UseQueryOptions<Profile, Error>, "queryKey" | "queryFn">
) => {
  return useQuery({
    queryKey: queryKeys.profile,
    queryFn: () => apiClient.get<Profile>("/api/profile"),
    ...options,
  });
};
