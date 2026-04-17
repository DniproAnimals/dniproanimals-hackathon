import {
  acceptInviteBodySchema,
  acceptInviteResponseSchema,
  createVolunteerBodySchema,
  createVolunteerResponseSchema,
  deleteVolunteerBodySchema,
  deleteVolunteerResponseSchema,
  inviteInfoQuerySchema,
  inviteInfoResponseSchema,
  listVolunteersResponseSchema,
  updateVolunteerBodySchema,
  updateVolunteerResponseSchema,
} from "@dniproanimals/contracts";
import { db, usersTable } from "@dniproanimals/database";
import { endpoints } from "@dniproanimals/endpoints";
import bcrypt from "bcryptjs";
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from "../../shared/errors";
import { createController, defineRoute } from "../../shared/types/controller";
import {
  toUserResponse,
  toVolunteerResponse,
} from "../../shared/utils/serializers";
import { withAuth } from "../auth/auth.guard";
import { organizationsService } from "../organizations/organizations.service";
import { usersService } from "../users/users.service";
import { volunteersService } from "./volunteers.service";

const ROUNDS = 10;

async function requireOrgOwner(userId: number) {
  const user = await usersService.getById(userId);
  if (!user?.orgId) throw new UnauthorizedError();
  const org = await organizationsService.getById(user.orgId);
  if (!org || org.ownerId !== user.id) throw new ForbiddenError();
  return { user, org };
}

export const volunteersController = createController({
  list: defineRoute({
    method: "GET",
    url: endpoints.volunteers.list(),
    schema: {
      response: { 200: listVolunteersResponseSchema },
    },
    handler: withAuth(async (request, reply) => {
      const user = await usersService.getById(request.session.userId);
      if (!user?.orgId) throw new UnauthorizedError();
      const rows = await volunteersService.listByOrg(user.orgId);
      return reply.send(rows.map(toVolunteerResponse));
    }),
  }),

  create: defineRoute({
    method: "POST",
    url: endpoints.volunteers.create(),
    schema: {
      body: createVolunteerBodySchema,
      response: { 200: createVolunteerResponseSchema },
    },
    handler: withAuth(async (request, reply) => {
      const { user } = await requireOrgOwner(request.session.userId);
      const { id, inviteToken } = await volunteersService.create(
        user.orgId!,
        request.body,
      );
      return reply.send({ id, inviteToken });
    }),
  }),

  update: defineRoute({
    method: "PUT",
    url: endpoints.volunteers.update(),
    schema: {
      body: updateVolunteerBodySchema,
      response: { 200: updateVolunteerResponseSchema },
    },
    handler: withAuth(async (request, reply) => {
      const { user } = await requireOrgOwner(request.session.userId);
      await volunteersService.update(user.orgId!, request.body);
      return reply.send({ success: true });
    }),
  }),

  delete: defineRoute({
    method: "DELETE",
    url: endpoints.volunteers.delete(),
    schema: {
      body: deleteVolunteerBodySchema,
      response: { 200: deleteVolunteerResponseSchema },
    },
    handler: withAuth(async (request, reply) => {
      const { user } = await requireOrgOwner(request.session.userId);
      const { userId } = await volunteersService.delete(
        user.orgId!,
        request.body.id,
      );
      if (userId) {
        await usersService.update(userId, { role: "user", orgId: null });
      }
      return reply.send({ success: true });
    }),
  }),

  inviteInfo: defineRoute({
    method: "GET",
    url: endpoints.volunteers.invite(),
    schema: {
      querystring: inviteInfoQuerySchema,
      response: { 200: inviteInfoResponseSchema },
    },
    handler: async (request, reply) => {
      const row = await volunteersService.findByInviteToken(
        request.query.token,
      );
      if (!row) throw new NotFoundError("Invite");
      if (row.volunteer.userId) throw new ConflictError("Invite already used");
      return reply.send({
        volunteerName: row.volunteer.name,
        volunteerSurname: row.volunteer.surname ?? null,
        orgName: row.orgName ?? null,
      });
    },
  }),

  acceptInvite: defineRoute({
    method: "POST",
    url: endpoints.volunteers.invite(),
    schema: {
      body: acceptInviteBodySchema,
      response: { 200: acceptInviteResponseSchema },
    },
    handler: async (request, reply) => {
      const row = await volunteersService.findByInviteToken(request.body.token);
      if (!row) throw new NotFoundError("Invite");
      if (row.volunteer.userId) throw new ConflictError("Invite already used");

      const existing = await usersService.getByEmail(request.body.email);
      if (existing) throw new ConflictError("Email already registered");

      const fullName = [row.volunteer.name, row.volunteer.surname]
        .filter(Boolean)
        .join(" ");
      const passwordHash = await bcrypt.hash(request.body.password, ROUNDS);

      const [newUser] = await db
        .insert(usersTable)
        .values({
          name: fullName,
          email: request.body.email,
          passwordHash,
          role: "volunteer",
          orgId: row.volunteer.orgId,
        })
        .returning();
      if (!newUser) throw new NotFoundError("User");

      await volunteersService.claim(row.volunteer.id, newUser.id);
      request.session.userId = newUser.id;
      return reply.send(toUserResponse(newUser));
    },
  }),
});
