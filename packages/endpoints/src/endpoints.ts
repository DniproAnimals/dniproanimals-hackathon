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
  lost: {
    list: "/lost",
    create: "/lost",
    update: "/lost/:id",
  },
  organizations: {
    list: "/organizations",
    create: "/organizations",
    updateStatus: "/organizations",
    updateOwn: "/organizations",
    get: "/organizations/:id",
    animals: "/organizations/:id/animals",
    volunteers: "/organizations/:id/volunteers",
    jar: "/organizations/jar",
  },
  superadmin: {
    listOrgs: "/superadmin/organizations",
    orgsStats: "/superadmin/organizations/stats",
    updateOrg: "/superadmin/organizations",
    deleteOrg: "/superadmin/organizations",
  },
  volunteers: {
    list: "/volunteers",
    stats: "/volunteers/stats",
    create: "/volunteers",
    update: "/volunteers",
    delete: "/volunteers",
    invite: "/volunteers/invite",
  },
  notifications: {
    list: "/notifications",
  },
  mail: {
    test: "/mail/test",
  },
  upload: {
    image: "/upload",
  },
} as const);
