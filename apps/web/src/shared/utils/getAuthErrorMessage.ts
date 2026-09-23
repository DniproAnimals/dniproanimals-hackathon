import { ApiError } from "@dniproanimals/api-client";

type AuthAction = "login" | "register" | "google";

const fallbackMessages: Record<AuthAction, string> = {
  login: "Не вдалося увійти. Спробуйте ще раз.",
  register: "Не вдалося створити акаунт. Спробуйте ще раз.",
  google: "Не вдалося увійти через Google. Спробуйте ще раз.",
};

export function getAuthErrorMessage(error: unknown, action: AuthAction) {
  if (!(error instanceof ApiError)) {
    return "Не вдалося з'єднатися із сервером. Перевірте інтернет-з'єднання та спробуйте ще раз.";
  }

  if (error.code === "EMAIL_NOT_VERIFIED") {
    return "Підтвердьте email перед входом. Перевірте свою пошту та перейдіть за посиланням у листі.";
  }

  if (action === "login" && error.status === 401) {
    return "Неправильний email або пароль.";
  }

  if (action === "register" && error.status === 409) {
    return "Акаунт із таким email уже існує. Спробуйте увійти.";
  }

  if (error.status === 429) {
    return "Забагато спроб. Зачекайте трохи та спробуйте ще раз.";
  }

  if (error.status === 400) {
    return action === "google"
      ? fallbackMessages.google
      : "Перевірте введені дані та спробуйте ще раз.";
  }

  if (error.status >= 500) {
    return "Сервіс тимчасово недоступний. Спробуйте ще раз пізніше.";
  }

  return fallbackMessages[action];
}
