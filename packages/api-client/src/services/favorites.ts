import type {
  ListFavoritesResponse,
  ToggleFavoriteBody,
  ToggleFavoriteResponse,
} from "@dniproanimals/contracts";
import { endpoints } from "@dniproanimals/endpoints";
import type { HttpFn } from "../createHttp";

export function createFavoritesApiService(http: HttpFn) {
  return {
    list: () =>
      http<ListFavoritesResponse>({
        endpoint: endpoints.favorites.list(),
      }),
    toggle: (body: ToggleFavoriteBody) =>
      http<ToggleFavoriteResponse>({
        endpoint: endpoints.favorites.toggle(),
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      }),
  };
}
