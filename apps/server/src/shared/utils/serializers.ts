import type {
  adoptionRequestsTable,
  animalsTable,
  notificationsTable,
  usersTable,
} from "@dniproanimals/database";

type UserRow = typeof usersTable.$inferSelect;
type AnimalRow = typeof animalsTable.$inferSelect;
type AdoptionRow = typeof adoptionRequestsTable.$inferSelect;
type NotificationRow = typeof notificationsTable.$inferSelect;

export const parsePhotos = (raw: string | null): string[] => {
  if (!raw) return [];
  try {
    const v = JSON.parse(raw);
    return Array.isArray(v) ? v.filter((s) => typeof s === "string") : [];
  } catch {
    return [];
  }
};

export function toUserResponse(u: UserRow) {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    photo: u.photo ?? null,
    description: u.description ?? null,
    phone: u.phone ?? null,
    instagram: u.instagram ?? null,
    telegram: u.telegram ?? null,
    facebook: u.facebook ?? null,
    createdAt: u.createdAt.toISOString(),
  };
}

export function toAnimalResponse(a: AnimalRow) {
  return {
    id: a.id,
    name: a.name,
    description: a.description ?? null,
    type: a.type,
    breed: a.breed ?? null,
    sex: a.sex ?? null,
    ageMonths: a.ageMonths ?? null,
    weightKg: a.weightKg ?? null,
    size: a.size ?? null,
    color: a.color ?? null,
    vaccinated: a.vaccinated ?? null,
    sterilized: a.sterilized ?? null,
    trained: a.trained ?? null,
    commands: a.commands ?? null,
    photos: parsePhotos(a.photos),
    contactName: a.contactName ?? null,
    contactPhone: a.contactPhone ?? null,
    contactEmail: a.contactEmail ?? null,
    contactInstagram: a.contactInstagram ?? null,
    contactTelegram: a.contactTelegram ?? null,
    contactFacebook: a.contactFacebook ?? null,
    contactLocation: a.contactLocation ?? null,
    status: a.status,
    createdAt: a.createdAt.toISOString(),
    updatedAt: a.updatedAt.toISOString(),
  };
}

export function toAdoptionResponse(a: AdoptionRow) {
  return {
    id: a.id,
    animalId: a.animalId,
    name: a.name,
    email: a.email,
    phone: a.phone,
    instagram: a.instagram ?? null,
    telegram: a.telegram ?? null,
    facebook: a.facebook ?? null,
    location: a.location ?? null,
    message: a.message ?? null,
    status: a.status,
    createdAt: a.createdAt.toISOString(),
  };
}

export function toNotificationResponse(n: NotificationRow) {
  return {
    id: n.id,
    type: n.type,
    title: n.title,
    message: n.message ?? null,
    link: n.link ?? null,
    isRead: n.isRead,
    createdAt: n.createdAt.toISOString(),
  };
}
