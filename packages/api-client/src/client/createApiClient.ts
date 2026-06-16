import { createAdoptionApiService } from "../services/adoption";
import { createAnimalsApiService } from "../services/animals";
import { createAuthApiService } from "../services/auth";
import { createFavoritesApiService } from "../services/favorites";
import { createFoundationApiService } from "../services/foundation";
import { createNotificationsApiService } from "../services/notifications";
import { createUploadApiService } from "../services/upload";
import { createUsersApiService } from "../services/users";
import { createHttp, type ApiClientConfig } from "../utils";

export function createApiClient(config: ApiClientConfig) {
  const http = createHttp(config);

  return {
    auth: createAuthApiService(http),
    animals: createAnimalsApiService(http),
    adoption: createAdoptionApiService(http),
    favorites: createFavoritesApiService(http),
    notifications: createNotificationsApiService(http),
    upload: createUploadApiService(http),
    foundation: createFoundationApiService(http),
    users: createUsersApiService(http),
  };
}

export type ApiClient = ReturnType<typeof createApiClient>;
