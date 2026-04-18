import { QueryClient } from "@tanstack/react-query";
import { cache } from "react";

// Server-only factory: cache() makes the QueryClient request-scoped on the server.
// Must be called only from server components (layouts/pages) — never imported by client code.
export const getServerQueryClient = cache(
  () =>
    new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60 * 1000,
        },
      },
    }),
);
