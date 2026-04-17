import { type ApiClientConfig, createHttp } from "../createHttp";
import { createAdoptionApiService } from "../services/adoption";
import { createAnimalsApiService } from "../services/animals";
import { createAuthApiService } from "../services/auth";
import { createFavoritesApiService } from "../services/favorites";
import { createLostApiService } from "../services/lost";
import { createNotificationsApiService } from "../services/notifications";
import { createOrganizationsApiService } from "../services/organizations";
import { createSuperadminApiService } from "../services/superadmin";
import { createUploadApiService } from "../services/upload";
import { createVolunteersApiService } from "../services/volunteers";

export function createApiClient(config: ApiClientConfig) {
  const http = createHttp(config);

  return {
    auth: createAuthApiService(http),
    animals: createAnimalsApiService(http),
    organizations: createOrganizationsApiService(http),
    adoption: createAdoptionApiService(http),
    lost: createLostApiService(http),
    favorites: createFavoritesApiService(http),
    volunteers: createVolunteersApiService(http),
    notifications: createNotificationsApiService(http),
    superadmin: createSuperadminApiService(http),
    upload: createUploadApiService(http),
  };
}

export type ApiClient = ReturnType<typeof createApiClient>;
