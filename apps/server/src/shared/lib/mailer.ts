import { env } from "@dniproanimals/env";
import nodemailer from "nodemailer";

type MailPayload = {
  to: string;
  subject: string;
  text?: string;
  html?: string;
};

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_PORT === 465,
  auth:
    env.SMTP_USER && env.SMTP_PASS
      ? { user: env.SMTP_USER, pass: env.SMTP_PASS }
      : undefined,
});

export async function sendMail(payload: MailPayload) {
  return transporter.sendMail({
    from: env.SMTP_FROM,
    ...payload,
  });
}
