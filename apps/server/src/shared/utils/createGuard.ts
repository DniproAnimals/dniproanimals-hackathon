import type { FastifyReply, FastifyRequest } from "fastify";

type NextHandler<
  TBody = unknown,
  TParams = unknown,
  TQuery = unknown,
  TReply = unknown,
> = (
  request: FastifyRequest<{
    Body: TBody;
    Params: TParams;
    Querystring: TQuery;
  }>,
  reply: FastifyReply<{ Reply: TReply }>,
) => Promise<unknown>;

type Guard<
  TBody = unknown,
  TParams = unknown,
  TQuery = unknown,
  TReply = unknown,
> = (
  request: FastifyRequest<{
    Body: TBody;
    Params: TParams;
    Querystring: TQuery;
  }>,
  reply: FastifyReply<{ Reply: TReply }>,
) => Promise<void> | void;

export function createGuard(guard: Guard) {
  return function <
    TBody = unknown,
    TParams = unknown,
    TQuery = unknown,
    TReply = unknown,
  >(next: NextHandler<TBody, TParams, TQuery, TReply>) {
    return async function (
      request: FastifyRequest<{
        Body: TBody;
        Params: TParams;
        Querystring: TQuery;
      }>,
      reply: FastifyReply<{ Reply: TReply }>,
    ) {
      await guard(request, reply);
      return next(request, reply);
    };
  };
}
