import type { SendAnimalSupportUpdateBody } from "@dniproanimals/contracts";
import {
  and,
  animalDonationsTable,
  animalSupportUpdatesTable,
  animalsTable,
  asc,
  db,
  eq,
  sql,
  usersTable,
} from "@dniproanimals/database";
import { env } from "@dniproanimals/env";
import { render } from "@react-email/render";
import React from "react";
import { AnimalSupportUpdateEmail } from "../../shared/emails/AnimalSupportUpdateEmail";
import { resolveEmailTemplate } from "../../shared/emails/template";
import { BadRequestError, NotFoundError } from "../../shared/errors";
import { sendMail } from "../../shared/lib/mailer";
import { emailTemplateService } from "../email-templates/email-template.service";

async function getActiveSupporters(animalId: number) {
  const supporters = await db
    .select({
      userId: usersTable.id,
      name: usersTable.name,
      email: usersTable.email,
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

  async start(userId: number, animalId: number) {
    await db
      .insert(animalDonationsTable)
      .values({ userId, animalId })
      .onConflictDoUpdate({
        target: [animalDonationsTable.userId, animalDonationsTable.animalId],
        set: {
          isActive: true,
          startedAt: sql<Date>`case when ${animalDonationsTable.isActive} then ${animalDonationsTable.startedAt} else now() end`,
          canceledAt: null,
          updatedAt: sql<Date>`case when ${animalDonationsTable.isActive} then ${animalDonationsTable.updatedAt} else now() end`,
        },
      });

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
      content.message,
      ...body.photos,
      content.actionLabel ? `${content.actionLabel}: ${animalUrl}` : animalUrl,
      content.footer,
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
