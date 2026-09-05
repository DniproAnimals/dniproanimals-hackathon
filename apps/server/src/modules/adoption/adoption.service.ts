import type {
  CreateAdoptionBody,
  ListAdoptionQuery,
} from "@dniproanimals/contracts";
import {
  adoptionRequestsTable,
  animalsTable,
  db,
  desc,
  eq,
  or,
  sql,
  usersTable,
} from "@dniproanimals/database";
import { render } from "@react-email/render";
import React from "react";
import { AdoptionAdminEmail } from "../../shared/emails/AdoptionAdminEmail";
import { AdoptionApplicantEmail } from "../../shared/emails/AdoptionApplicantEmail";
import {
  getEmailTemplateText,
  resolveEmailTemplate,
} from "../../shared/emails/template";
import { sendMail } from "../../shared/lib/mailer";
import { emailTemplateService } from "../email-templates/email-template.service";

type AdoptionInsert = typeof adoptionRequestsTable.$inferInsert;

async function sendAdoptionAdminEmail(
  adminEmails: string[],
  body: CreateAdoptionBody,
  animalName: string,
) {
  if (!adminEmails.length) return;

  const template = await emailTemplateService.get("adoption-admin");
  const content = resolveEmailTemplate(template, { animalName });
  const subject = content.subject;
  const text = [
    getEmailTemplateText(content.content),
    `Ім'я тварини: ${animalName}`,
    `ПІБ заявника: ${body.name}`,
    `Телефон: ${body.phone}`,
    `Email: ${body.email}`,
  ].join("\n");

  const html = await render(
    React.createElement(AdoptionAdminEmail, {
      body,
      animalName,
      template,
    }),
  );

  await sendMail({
    to: adminEmails.join(", "),
    subject,
    text,
    html,
  });
}

async function sendAdoptionApplicantEmail(
  body: CreateAdoptionBody,
  animalName: string,
) {
  const template = await emailTemplateService.get("adoption-applicant");
  const content = resolveEmailTemplate(template, {
    applicantName: body.name,
    animalName,
    phone: body.phone,
  });
  const html = await render(
    React.createElement(AdoptionApplicantEmail, {
      applicantName: body.name,
      animalName,
      phone: body.phone,
      template,
    }),
  );

  await sendMail({
    to: body.email,
    subject: content.subject,
    text: getEmailTemplateText(content.content),
    html,
  });
}

export const adoptionService = {
  async list(filters: ListAdoptionQuery = {}) {
    const rows = await db
      .select({
        request: adoptionRequestsTable,
        animal: {
          name: animalsTable.name,
          type: animalsTable.type,
        },
      })
      .from(adoptionRequestsTable)
      .leftJoin(
        animalsTable,
        eq(adoptionRequestsTable.animalId, animalsTable.id),
      )
      .orderBy(desc(adoptionRequestsTable.createdAt));

    const q = filters.q?.toLowerCase();

    const filtered = rows
      .filter((r) =>
        filters.status ? r.request.status === filters.status : true,
      )
      .filter((r) => {
        if (!q) return true;
        const hay =
          `${r.request.name} ${r.request.email} ${r.animal?.name ?? ""}`.toLowerCase();
        return hay.includes(q);
      })
      .map((r) => ({
        ...r.request,
        animalName: r.animal?.name ?? null,
        animalType: r.animal?.type ?? null,
      }));

    return filters.limit ? filtered.slice(0, filters.limit) : filtered;
  },

  async stats() {
    const [row] = await db
      .select({
        total: sql<number>`count(*)::int`,
        pending: sql<number>`count(*) filter (where ${adoptionRequestsTable.status} = 'pending')::int`,
        approved: sql<number>`count(*) filter (where ${adoptionRequestsTable.status} = 'approved')::int`,
        rejected: sql<number>`count(*) filter (where ${adoptionRequestsTable.status} = 'rejected')::int`,
      })
      .from(adoptionRequestsTable);
    return {
      total: row?.total ?? 0,
      pending: row?.pending ?? 0,
      approved: row?.approved ?? 0,
      rejected: row?.rejected ?? 0,
    };
  },

  async create(body: CreateAdoptionBody) {
    const insert: AdoptionInsert = {
      animalId: body.animalId,
      name: body.name,
      email: body.email,
      phone: body.phone,
      instagram: body.instagram ?? null,
      telegram: body.telegram ?? null,
      facebook: body.facebook ?? null,
      location: body.location ?? null,
      message: body.message ?? null,
    };
    const [created] = await db
      .insert(adoptionRequestsTable)
      .values(insert)
      .returning({ id: adoptionRequestsTable.id });

    void this.notifyAdmins(body);
    void this.notifyApplicant(body);
    return created!;
  },

  async updateStatus(id: number, status: "approved" | "rejected") {
    await db
      .update(adoptionRequestsTable)
      .set({ status })
      .where(eq(adoptionRequestsTable.id, id));
  },

  async getAnimalId(id: number) {
    const [row] = await db
      .select({ animalId: adoptionRequestsTable.animalId })
      .from(adoptionRequestsTable)
      .where(eq(adoptionRequestsTable.id, id))
      .limit(1);
    return row?.animalId ?? null;
  },

  async notifyAdmins(body: CreateAdoptionBody) {
    try {
      const [[animal], admins] = await Promise.all([
        db
          .select({ name: animalsTable.name })
          .from(animalsTable)
          .where(eq(animalsTable.id, body.animalId))
          .limit(1),

        db
          .select({ email: usersTable.email })
          .from(usersTable)
          .where(
            or(eq(usersTable.role, "admin"), eq(usersTable.role, "superadmin")),
          ),
      ]);

      if (!animal) return;

      const adminEmails = admins.map((a) => a.email);

      if (adminEmails.length === 0) return;

      await sendAdoptionAdminEmail(adminEmails, body, animal.name);
    } catch (err) {
      console.error("failed to send adoption email:", err);
    }
  },

  async notifyApplicant(body: CreateAdoptionBody) {
    try {
      const [animal] = await db
        .select({ name: animalsTable.name })
        .from(animalsTable)
        .where(eq(animalsTable.id, body.animalId))
        .limit(1);

      if (!animal) return;

      await sendAdoptionApplicantEmail(body, animal.name);
    } catch (err) {
      console.error("failed to send adoption applicant email:", err);
    }
  },
};
