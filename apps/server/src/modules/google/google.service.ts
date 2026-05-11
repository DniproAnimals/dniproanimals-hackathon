import { env } from "@dniproanimals/env";
import { OAuth2Client } from "google-auth-library";

const googleClient = new OAuth2Client(env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

export type GoogleIdTokenPayload = {
  sub: string | null;
  email: string | null;
  name: string | null;
  picture: string | null;
};

export const googleService = {
  async verifyIdToken(idToken: string): Promise<GoogleIdTokenPayload | null> {
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken,
        audience: env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      if (!payload) return null;

      return {
        sub: payload.sub ?? null,
        email: payload.email ?? null,
        name: payload.name ?? null,
        picture: payload.picture ?? null,
      };
    } catch {
      return null;
    }
  },
};
