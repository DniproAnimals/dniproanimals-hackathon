import { endpoints } from "@dniproanimals/endpoints";

export const queryKeys = {
  auth: {
    me: [endpoints.auth.me()] as const,
  },
  animals: {
    all: [endpoints.animals.list()] as const,
    list: (query?: Record<string, unknown>) =>
      [endpoints.animals.list(), query ?? null] as const,
    detail: (id: number) => [endpoints.animals.get({ id })] as const,
  },
  organizations: {
    all: [endpoints.organizations.list()] as const,
    list: () => [endpoints.organizations.list()] as const,
    detail: (id: number) => [endpoints.organizations.get({ id })] as const,
    animals: (id: number) => [endpoints.organizations.animals({ id })] as const,
    volunteers: (id: number) =>
      [endpoints.organizations.volunteers({ id })] as const,
  },
  adoption: {
    all: [endpoints.adoption.list()] as const,
    list: (query?: Record<string, unknown>) =>
      [endpoints.adoption.list(), query ?? null] as const,
  },
  lost: {
    all: [endpoints.lost.list()] as const,
    list: (query?: Record<string, unknown>) =>
      [endpoints.lost.list(), query ?? null] as const,
  },
  favorites: {
    list: [endpoints.favorites.list()] as const,
  },
  volunteers: {
    list: [endpoints.volunteers.list()] as const,
    invite: (token: string) => [endpoints.volunteers.invite(), token] as const,
  },
  notifications: {
    list: [endpoints.notifications.list()] as const,
  },
};
