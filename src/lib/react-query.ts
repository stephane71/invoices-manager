"use client";

import { QueryClient } from "@tanstack/react-query";

/**
 * Creates a new QueryClient instance with default configuration
 * Used for React Query data fetching and caching
 */
export const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Data is considered fresh for 1 minute
        staleTime: 60 * 1000, // 1 minute

        // Unused data is garbage collected after 5 minutes
        gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)

        // Retry failed requests once
        retry: 1,

        // Don't refetch on window focus (can be enabled per-query if needed)
        refetchOnWindowFocus: false,

        // Don't refetch on reconnect by default
        refetchOnReconnect: false,

        // Refetch on mount if data is stale (default behavior)
        // This ensures invalidated queries refetch when components remount
        refetchOnMount: true,
      },
      mutations: {
        // Don't retry mutations by default
        retry: 0,
      },
    },
  });
};

// Singleton query client for the application
let browserQueryClient: QueryClient | undefined = undefined;

export const getQueryClient = () => {
  if (typeof window === "undefined") {
    // Server: always create a new query client
    return createQueryClient();
  } else {
    // Browser: use singleton pattern to prevent creating multiple clients
    if (!browserQueryClient) {
      browserQueryClient = createQueryClient();
    }
    return browserQueryClient;
  }
};
