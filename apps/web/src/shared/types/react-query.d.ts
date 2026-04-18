import type {
  UndefinedInitialDataOptions,
  UseMutationOptions,
} from "@tanstack/react-query";

export type OmitQueryOptions<
  QueryFn extends (...args: never[]) => unknown,
  Keys extends string,
> = Omit<UndefinedInitialDataOptions<Awaited<ReturnType<QueryFn>>>, Keys>;

export type OmitMutationOptions<
  MutationFn extends (...args: never[]) => unknown,
  Keys extends string,
> = Omit<
  UseMutationOptions<
    Awaited<ReturnType<MutationFn>>,
    Error,
    Parameters<MutationFn>[0]
  >,
  Keys
>;
