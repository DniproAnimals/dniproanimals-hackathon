/** Extract param names from a path pattern: "/api/:id/comments/:commentId" → "id" | "commentId" */
type ExtractParams<T extends string> =
  T extends `${string}:${infer Param}/${infer Rest}`
    ? Param | ExtractParams<Rest>
    : T extends `${string}:${infer Param}`
      ? Param
      : never;

/** If path has no params → no-arg function; otherwise → function with typed params object */
type EndpointFn<T extends string> = [ExtractParams<T>] extends [never]
  ? () => T
  : (params: Record<ExtractParams<T>, string | number>) => string;

/** Recursively map a nested object of path strings to typed endpoint functions */
export type TypedEndpoints<T> = {
  [K in keyof T]: T[K] extends string
    ? EndpointFn<T[K]>
    : T[K] extends object
      ? TypedEndpoints<T[K]>
      : never;
};

/** Runtime implementation: replaces :param segments with provided values */
export function createTypedEndpoints<T extends Record<string, unknown>>(
  routes: T,
): TypedEndpoints<T> {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(routes)) {
    if (typeof value === "string") {
      result[key] = (params?: Record<string, string | number>) => {
        if (!params) return value;
        return value.replace(/:(\w+)/g, (_, name) => String(params[name]));
      };
    } else if (typeof value === "object" && value !== null) {
      result[key] = createTypedEndpoints(value as Record<string, unknown>);
    }
  }

  return result as TypedEndpoints<T>;
}
