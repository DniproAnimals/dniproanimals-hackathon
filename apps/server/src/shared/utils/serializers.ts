import type {
  adoptionRequestsTable,
  animalsTable,
  lostAnimalsTable,
  notificationsTable,
  organizationsTable,
  usersTable,
  volunteersTable,
} from "@dniproanimals/database";

type UserRow = typeof usersTable.$inferSelect;
type OrgRow = typeof organizationsTable.$inferSelect;
type AnimalRow = typeof animalsTable.$inferSelect;
type AdoptionRow = typeof adoptionRequestsTable.$inferSelect;
type LostRow = typeof lostAnimalsTable.$inferSelect;
type VolunteerRow = typeof volunteersTable.$inferSelect;
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
    orgId: u.orgId ?? null,
    createdAt: u.createdAt.toISOString(),
  };
}

export function toOrganizationResponse(o: OrgRow) {
  return {
    id: o.id,
    name: o.name,
    description: o.description ?? null,
    photo: o.photo ?? null,
    location: o.location ?? null,
    phone: o.phone ?? null,
    email: o.email ?? null,
    instagram: o.instagram ?? null,
    telegram: o.telegram ?? null,
    facebook: o.facebook ?? null,
    website: o.website ?? null,
    ownerId: o.ownerId,
    status: o.status,
    monobankJarId: o.monobankJarId ?? null,
    createdAt: o.createdAt.toISOString(),
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
    orgId: a.orgId ?? null,
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

export function toLostResponse(l: LostRow) {
  return {
    id: l.id,
    title: l.title,
    description: l.description,
    type: l.type,
    animalType: l.animalType ?? null,
    breed: l.breed ?? null,
    sex: l.sex ?? null,
    color: l.color ?? null,
    size: l.size ?? null,
    location: l.location ?? null,
    lastSeenLocation: l.lastSeenLocation ?? null,
    lastSeenDate: l.lastSeenDate ?? null,
    contactName: l.contactName,
    contactPhone: l.contactPhone,
    photos: parsePhotos(l.photos),
    resolved: l.resolved,
    createdAt: l.createdAt.toISOString(),
  };
}

export function toVolunteerResponse(v: VolunteerRow) {
  return {
    id: v.id,
    orgId: v.orgId,
    userId: v.userId ?? null,
    name: v.name,
    surname: v.surname ?? null,
    photo: v.photo ?? null,
    description: v.description ?? null,
    phone: v.phone ?? null,
    email: v.email ?? null,
    instagram: v.instagram ?? null,
    telegram: v.telegram ?? null,
    inviteToken: v.inviteToken ?? null,
    createdAt: v.createdAt.toISOString(),
  };
}

export function toNotificationResponse(n: NotificationRow) {
  return {
    id: n.id,
    orgId: n.orgId ?? null,
    type: n.type,
    title: n.title,
    message: n.message ?? null,
    link: n.link ?? null,
    isRead: n.isRead,
    createdAt: n.createdAt.toISOString(),
  };
}
