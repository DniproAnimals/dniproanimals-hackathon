import type {
  FastifyReply,
  FastifyRequest,
  HTTPMethods,
  RouteOptions,
} from "fastify";
import type { z, ZodTypeAny } from "zod";

type InferSchema<T> = T extends ZodTypeAny ? z.output<T> : unknown;
type InferResponse<T> =
  T extends Record<number, infer V>
    ? V extends ZodTypeAny
      ? z.input<V>
      : unknown
    : unknown;

interface DefineRouteOptions<
  TBody extends ZodTypeAny | undefined = undefined,
  TParams extends ZodTypeAny | undefined = undefined,
  TQuerystring extends ZodTypeAny | undefined = undefined,
  TResponse extends Record<number, ZodTypeAny> | undefined = undefined,
> {
  method: HTTPMethods | HTTPMethods[];
  url: string;
  schema?: {
    body?: TBody;
    params?: TParams;
    querystring?: TQuerystring;
    response?: TResponse;
  };
  handler: (
    request: FastifyRequest<{
      Body: InferSchema<TBody>;
      Params: InferSchema<TParams>;
      Querystring: InferSchema<TQuerystring>;
    }>,
    reply: FastifyReply<{ Reply: InferResponse<TResponse> }>,
  ) => Promise<unknown>;
}

export function defineRoute<
  TBody extends ZodTypeAny | undefined = undefined,
  TParams extends ZodTypeAny | undefined = undefined,
  TQuerystring extends ZodTypeAny | undefined = undefined,
  TResponse extends Record<number, ZodTypeAny> | undefined = undefined,
>(
  opts: DefineRouteOptions<TBody, TParams, TQuerystring, TResponse>,
): RouteOptions {
  return opts as unknown as RouteOptions;
}

export function createController<T extends Record<string, RouteOptions>>(
  controller: T,
): T {
  return controller;
}
