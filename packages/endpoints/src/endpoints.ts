import { createTypedEndpoints } from "./createTypedEndpoints";

export const endpoints = createTypedEndpoints({
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    logout: "/auth/logout",
    me: "/auth/me",
    google: "/auth/google",
    verifyEmail: "/auth/verify-email",
    resendEmail: "/auth/resend-email",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
  },
  animals: {
    list: "/animals",
    stats: "/animals/stats",
    create: "/animals",
    get: "/animals/:id",
    update: "/animals/:id",
    delete: "/animals/:id",
    listSpecies: "/animals/species",
    createSpecies: "/animals/species",
    listBreeds: "/animals/breeds",
    addBreeds: "/animals/species/add-breeds",
  },
  adoption: {
    list: "/adoption",
    stats: "/adoption/stats",
    create: "/adoption",
    updateStatus: "/adoption",
  },
  contractTemplate: {
    get: "/contract-template/:type",
    update: "/contract-template/:type",
    pdf: "/contract-template/:type/pdf",
  },
  favorites: {
    list: "/favorites",
    toggle: "/favorites",
  },
  animalDonations: {
    status: "/animal-donations/:animalId",
    start: "/animal-donations/:animalId",
    cancel: "/animal-donations/:animalId",
    supporters: "/animal-donations/:animalId/supporters",
    sendUpdate: "/animal-donations/:animalId/updates",
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
