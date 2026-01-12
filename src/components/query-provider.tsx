"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { getQueryClient } from "@/lib/react-query";

export const QueryProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/*<ReactQueryDevtools initialIsOpen={false} />*/}
    </QueryClientProvider>
  );
};
