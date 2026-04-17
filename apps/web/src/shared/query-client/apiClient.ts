import { createApiClient } from "@dniproanimals/api-client";
import { env } from "@dniproanimals/env";

export const apiClient = createApiClient({ baseUrl: env.NEXT_PUBLIC_API_URL });
