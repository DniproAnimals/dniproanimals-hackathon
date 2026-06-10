import { db, eq, usersTable } from "@dniproanimals/database";
import { env } from "@dniproanimals/env";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { sendMail } from "../../shared/lib/mailer";
import { googleService } from "../google";

const ROUNDS = 10;
const EMAIL_VERIFICATION_TTL_MS = 1000 * 60 * 60 * 24;

function buildVerificationLink(token: string) {
  const baseUrl = env.WEB_ORIGIN.replace(/\/$/, "");
  return `${baseUrl}/verify-email/confirm?token=${encodeURIComponent(token)}`;
}

async function sendVerificationEmail(email: string, token: string) {
  const verificationLink = buildVerificationLink(token);
  const subject = "Confirm your email";
  const text = `Welcome to DniproAnimals!\n\nConfirm your email: ${verificationLink}\n\nIf you did not create an account, ignore this email.`;
  const html = `
    <div style="font-family:Arial, sans-serif; line-height:1.6;">
      <h2>Welcome to DniproAnimals</h2>
      <p>Confirm your email by clicking the link below:</p>
      <p><a href="${verificationLink}">${verificationLink}</a></p>
      <p>If you did not create an account, you can ignore this email.</p>
    </div>
  `;

  await sendMail({ to: email, subject, text, html });
}

function createEmailVerificationToken() {
  return randomBytes(32).toString("hex");
}

export const authService = {
  async register(input: { name: string; email: string; password: string }) {
    const existing = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, input.email))
      .limit(1);

    if (existing[0]) return null;

    const passwordHash = await bcrypt.hash(input.password, ROUNDS);
    const token = createEmailVerificationToken();
    const tokenExpires = new Date(Date.now() + EMAIL_VERIFICATION_TTL_MS);

    const [user] = await db
      .insert(usersTable)
      .values({
        name: input.name,
        email: input.email,
        passwordHash,
        emailVerified: false,
        emailVerificationToken: token,
        emailVerificationTokenExpires: tokenExpires,
      })
      .returning();

    if (user) {
      await sendVerificationEmail(user.email, token);
    }

    return user ?? null;
  },

  async login(input: { email: string; password: string }) {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, input.email))
      .limit(1);

    if (!user || !user.passwordHash) return null;

    const ok = await bcrypt.compare(input.password, user.passwordHash);
    if (!ok) return null;
    if (!user.emailVerified) return null;

    return user;
  },

  async loginWithGoogleIdToken(idToken: string) {
    const payload = await googleService.verifyIdToken(idToken);
    if (!payload?.sub || !payload.email) return null;

    const email = payload.email.toLowerCase();
    const googleId = payload.sub;
    const name = payload.name ?? email.split("@")[0] ?? "User";
    const photo = payload.picture ?? null;

    const [byGoogle] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.googleId, googleId))
      .limit(1);

    if (byGoogle) {
      if (!byGoogle.emailVerified) {
        const [updated] = await db
          .update(usersTable)
          .set({
            emailVerified: true,
            emailVerificationToken: null,
            emailVerificationTokenExpires: null,
          })
          .where(eq(usersTable.id, byGoogle.id))
          .returning();
        return updated ?? byGoogle;
      }
      return byGoogle;
    }

    const [byEmail] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    if (byEmail) {
      const [updated] = await db
        .update(usersTable)
        .set({
          googleId,
          photo: byEmail.photo ?? photo,
          name: byEmail.name ?? name,
          emailVerified: true,
          emailVerificationToken: null,
          emailVerificationTokenExpires: null,
        })
        .where(eq(usersTable.id, byEmail.id))
        .returning();

      return updated ?? byEmail;
    }

    const [created] = await db
      .insert(usersTable)
      .values({
        name,
        email,
        passwordHash: null,
        googleId,
        photo,
        emailVerified: true,
      })
      .returning();

    return created ?? null;
  },

  async verifyEmail(token: string) {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.emailVerificationToken, token))
      .limit(1);

    if (!user) return { ok: false, reason: "not-found" } as const;
    if (user.emailVerified) {
      return { ok: false, reason: "used" } as const;
    }

    const expiresAt = user.emailVerificationTokenExpires;
    if (!expiresAt || expiresAt.getTime() < Date.now()) {
      return { ok: false, reason: "expired" } as const;
    }

    await db
      .update(usersTable)
      .set({
        emailVerified: true,
        emailVerificationToken: null,
        emailVerificationTokenExpires: null,
      })
      .where(eq(usersTable.id, user.id));

    return { ok: true } as const;
  },

  async getById(id: number) {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id))
      .limit(1);

    return user ?? null;
  },

  async resendVerificationEmail(email: string) {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email))
      .limit(1);

    if (!user) return { ok: true, reason: "ignored" } as const;
    if (user.emailVerified)
      return { ok: true, reason: "already-verified" } as const;

    const now = Date.now();
    const coolDown = 60 * 1000;

    if (user.emailVerificationTokenExpires) {
      if (
        now -
          user.emailVerificationTokenExpires.getTime() -
          EMAIL_VERIFICATION_TTL_MS <
        coolDown
      )
        return { ok: true, reason: "rate-limit" } as const;
    }

    const token = createEmailVerificationToken();
    const expiresAt = new Date(now + EMAIL_VERIFICATION_TTL_MS);

    await db
      .update(usersTable)
      .set({
        emailVerificationToken: token,
        emailVerificationTokenExpires: expiresAt,
      })
      .where(eq(usersTable.id, user.id));

    await sendVerificationEmail(user.email, token);

    return { ok: true } as const;
  },
};
