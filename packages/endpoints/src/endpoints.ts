import { createTypedEndpoints } from "./createTypedEndpoints";

export const endpoints = createTypedEndpoints({
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    logout: "/auth/logout",
    me: "/auth/me",
    google: "/auth/google",
    verifyEmail: "/auth/verify-email",
  },
  animals: {
    list: "/animals",
    stats: "/animals/stats",
    create: "/animals",
    get: "/animals/:id",
    update: "/animals/:id",
    delete: "/animals/:id",
  },
  adoption: {
    list: "/adoption",
    stats: "/adoption/stats",
    create: "/adoption",
    updateStatus: "/adoption",
  },
  favorites: {
    list: "/favorites",
    toggle: "/favorites",
  },

  notifications: {
    list: "/notifications",
  },
  mail: {
    test: "/mail/test",
  },
  upload: {
    image: "/upload/image",
  },
  foundation: {
    get: "/foundation",
    update: "/foundation",
  },
  users: {
    list: "/users",
    updateRole: "/users/role",
  },
} as const);
