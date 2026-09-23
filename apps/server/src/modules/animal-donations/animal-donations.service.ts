import {
  ANIMAL_SUPPORT_TYPE_LABELS,
  type SendAnimalSupportUpdateBody,
  type StartAnimalDonationBody,
} from "@dniproanimals/contracts";
import {
  and,
  animalDonationsTable,
  animalSupportUpdatesTable,
  animalsTable,
  asc,
  db,
  eq,
  or,
  sql,
  usersTable,
} from "@dniproanimals/database";
import { env } from "@dniproanimals/env";
import { render } from "@react-email/render";
import React from "react";
import { AnimalSupportAdminEmail } from "../../shared/emails/AnimalSupportAdminEmail";
import { AnimalSupportThankYouEmail } from "../../shared/emails/AnimalSupportThankYouEmail";
import { AnimalSupportUpdateEmail } from "../../shared/emails/AnimalSupportUpdateEmail";
import {
  getEmailTemplateText,
  resolveEmailTemplate,
} from "../../shared/emails/template";
import { BadRequestError, NotFoundError } from "../../shared/errors";
import { sendMail } from "../../shared/lib/mailer";
import { emailTemplateService } from "../email-templates/email-template.service";

async function getActiveSupporters(animalId: number) {
  const supporters = await db
    .select({
      userId: usersTable.id,
      name: usersTable.name,
      email: usersTable.email,
      phone: animalDonationsTable.phone,
      supportType: animalDonationsTable.supportType,
      startedAt: animalDonationsTable.startedAt,
    })
    .from(animalDonationsTable)
    .innerJoin(usersTable, eq(animalDonationsTable.userId, usersTable.id))
    .where(
      and(
        eq(animalDonationsTable.animalId, animalId),
        eq(animalDonationsTable.isActive, true),
      ),
    )
    .orderBy(asc(animalDonationsTable.startedAt));

  return supporters.map((supporter) => ({
    ...supporter,
    startedAt: supporter.startedAt.toISOString(),
  }));
}

async function sendSupportActivationEmails(
  userId: number,
  animalId: number,
  animalName: string,
  body: StartAnimalDonationBody,
) {
  const [[supporter], admins, thankYouTemplate, adminTemplate] =
    await Promise.all([
      db
        .select({ name: usersTable.name, email: usersTable.email })
        .from(usersTable)
        .where(eq(usersTable.id, userId))
        .limit(1),
      db
        .select({ email: usersTable.email })
        .from(usersTable)
        .where(
          or(eq(usersTable.role, "admin"), eq(usersTable.role, "superadmin")),
        ),
      emailTemplateService.get("animal-support-thank-you"),
      emailTemplateService.get("animal-support-admin"),
    ]);

  if (!supporter) return;

  const supportType = ANIMAL_SUPPORT_TYPE_LABELS[body.supportType];
  const variables = {
    supporterName: supporter.name,
    email: supporter.email,
    animalName,
    supportType,
    phone: body.phone,
  };
  const baseUrl = env.WEB_ORIGIN.replace(/\/$/, "");
  const animalUrl = `${baseUrl}/animals/${animalId}`;
  const dashboardUrl = `${baseUrl}/dashboard/animals/${animalId}/edit`;
  const thankYouContent = resolveEmailTemplate(thankYouTemplate, variables);
  const adminContent = resolveEmailTemplate(adminTemplate, variables);
  const [thankYouHtml, adminHtml] = await Promise.all([
    render(
      React.createElement(AnimalSupportThankYouEmail, {
        ...variables,
        animalUrl,
        template: thankYouTemplate,
      }),
    ),
    render(
      React.createElement(AnimalSupportAdminEmail, {
        ...variables,
        supporterEmail: supporter.email,
        dashboardUrl,
        template: adminTemplate,
      }),
    ),
  ]);

  const adminText = [
    getEmailTemplateText(adminContent.content),
    `Тварина: ${animalName}`,
    `Користувач: ${supporter.name}`,
    `Email: ${supporter.email}`,
    `Телефон: ${body.phone}`,
    `Тип підтримки: ${supportType}`,
    dashboardUrl,
  ].join("\n");
  const deliveryResults = await Promise.allSettled([
    sendMail({
      to: supporter.email,
      subject: thankYouContent.subject,
      text: [getEmailTemplateText(thankYouContent.content), animalUrl].join(
        "\n",
      ),
      html: thankYouHtml,
    }),
    ...admins.map((admin) =>
      sendMail({
        to: admin.email,
        subject: adminContent.subject,
        text: adminText,
        html: adminHtml,
      }),
    ),
  ]);

  deliveryResults.forEach((result) => {
    if (result.status === "rejected") {
      console.error("Failed to send animal support email:", result.reason);
    }
  });
}

export const animalDonationsService = {
  async getStatus(userId: number, animalId: number) {
    const [donation] = await db
      .select({ active: animalDonationsTable.isActive })
      .from(animalDonationsTable)
      .where(
        and(
          eq(animalDonationsTable.userId, userId),
          eq(animalDonationsTable.animalId, animalId),
        ),
      )
      .limit(1);

    return donation?.active ?? false;
  },

  async start(
    userId: number,
    animalId: number,
    animalName: string,
    body: StartAnimalDonationBody,
  ) {
    const [activated] = await db
      .insert(animalDonationsTable)
      .values({ userId, animalId, ...body })
      .onConflictDoUpdate({
        target: [animalDonationsTable.userId, animalDonationsTable.animalId],
        set: {
          ...body,
          isActive: true,
          startedAt: sql<Date>`now()`,
          canceledAt: null,
          updatedAt: sql<Date>`now()`,
        },
        setWhere: eq(animalDonationsTable.isActive, false),
      })
      .returning({ id: animalDonationsTable.id });

    if (activated) {
      try {
        await sendSupportActivationEmails(userId, animalId, animalName, body);
      } catch (error) {
        console.error("Failed to send animal support notifications:", error);
      }
    }

    return true;
  },

  async cancel(userId: number, animalId: number) {
    await db
      .update(animalDonationsTable)
      .set({
        isActive: false,
        canceledAt: sql<Date>`now()`,
        updatedAt: sql<Date>`now()`,
      })
      .where(
        and(
          eq(animalDonationsTable.userId, userId),
          eq(animalDonationsTable.animalId, animalId),
          eq(animalDonationsTable.isActive, true),
        ),
      );

    return false;
  },

  async supporters(animalId: number) {
    return getActiveSupporters(animalId);
  },

  async deactivateSupporter(userId: number, animalId: number) {
    return this.cancel(userId, animalId);
  },

  async sendUpdate(
    authorId: number,
    animalId: number,
    body: SendAnimalSupportUpdateBody,
  ) {
    const [animal] = await db
      .select({
        name: animalsTable.name,
        donationsEnabled: animalsTable.donationsEnabled,
      })
      .from(animalsTable)
      .where(eq(animalsTable.id, animalId))
      .limit(1);

    if (!animal) throw new NotFoundError("Animal");
    if (!animal.donationsEnabled) {
      throw new BadRequestError("Donations are disabled for this animal");
    }

    const supporters = await getActiveSupporters(animalId);
    if (supporters.length === 0) {
      throw new BadRequestError("Animal has no active supporters");
    }

    const baseUrl = env.WEB_ORIGIN.replace(/\/$/, "");
    const animalUrl = `${baseUrl}/animals/${animalId}`;
    const template = await emailTemplateService.get("animal-support-update");
    const content = resolveEmailTemplate(template, { animalName: animal.name });
    const subject = content.subject;
    const text = [
      getEmailTemplateText(content.content),
      ...body.photos,
      animalUrl,
    ].join("\n");
    const html = await render(
      React.createElement(AnimalSupportUpdateEmail, {
        animalName: animal.name,
        animalUrl,
        photos: body.photos,
        template,
      }),
    );

    const deliveryResults = await Promise.allSettled(
      supporters.map((supporter) =>
        sendMail({
          to: supporter.email,
          subject,
          text,
          html,
        }),
      ),
    );
    const sentCount = deliveryResults.filter(
      (result) => result.status === "fulfilled",
    ).length;
    const recipientCount = supporters.length;
    const failedCount = recipientCount - sentCount;

    const [update] = await db
      .insert(animalSupportUpdatesTable)
      .values({
        animalId,
        authorId,
        photos: JSON.stringify(body.photos),
        recipientCount,
        sentCount,
        failedCount,
      })
      .returning({ id: animalSupportUpdatesTable.id });

    return {
      updateId: update!.id,
      recipientCount,
      sentCount,
      failedCount,
    };
  },
};
