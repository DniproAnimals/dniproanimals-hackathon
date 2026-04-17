import { serializeSearchParams } from "./serializeSearchParams";

export interface ApiClientConfig {
  baseUrl: string;
}

export interface HttpRequestOptions {
  endpoint: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  query?: Record<string, unknown>;
  body?: string | FormData;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  responseType?: "json" | "blob";
}

export type HttpFn = <T>(options: HttpRequestOptions) => Promise<T>;

export function createHttp(config: ApiClientConfig): HttpFn {
  return async function http<T>(options: HttpRequestOptions): Promise<T> {
    const { endpoint, method = "GET", query, body, headers, signal } = options;
    let url = `${config.baseUrl}${endpoint}`;
    if (query) {
      const qs = serializeSearchParams(query);
      if (qs) url += `?${qs}`;
    }

    const response = await fetch(url, {
      method,
      credentials: "include",
      headers,
      body,
      signal,
    });

    if (!response.ok) {
      const data = (await response.json().catch(() => ({}))) as Record<
        string,
        unknown
      >;
      throw new Error(
        (data.error as string) ||
          (data.message as string) ||
          `Request failed with status ${response.status}`,
      );
    }

    if (options.responseType === "blob") {
      return response.blob() as T;
    }

    return response.json() as T;
  };
}
