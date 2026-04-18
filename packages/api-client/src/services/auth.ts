import type {
  User,
  LoginBody,
  LogoutResponse,
  RegisterBody,
} from "@dniproanimals/contracts";
import { endpoints } from "@dniproanimals/endpoints";
import type { HttpFn } from "../utils";

export function createAuthApiService(http: HttpFn) {
  return {
    register: (body: RegisterBody) =>
      http<User>({
        endpoint: endpoints.auth.register(),
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      }),

    login: (body: LoginBody) =>
      http<User>({
        endpoint: endpoints.auth.login(),
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      }),

    logout: () =>
      http<LogoutResponse>({
        endpoint: endpoints.auth.logout(),
        method: "POST",
      }),

    me: () =>
      http<User>({
        endpoint: endpoints.auth.me(),
      }),
  };
}
