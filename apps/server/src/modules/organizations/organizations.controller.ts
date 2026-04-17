import {
  createOrganizationBodySchema,
  createOrganizationResponseSchema,
  getOrganizationParamsSchema,
  getOrganizationResponseSchema,
  listOrganizationsResponseSchema,
  orgAnimalsParamsSchema,
  orgAnimalsResponseSchema,
  orgVolunteersParamsSchema,
  orgVolunteersResponseSchema,
  updateJarBodySchema,
  updateJarResponseSchema,
  updateOrgStatusBodySchema,
  updateOrgStatusResponseSchema,
  updateOwnOrganizationBodySchema,
  updateOwnOrganizationResponseSchema,
} from "@dniproanimals/contracts";
import { endpoints } from "@dniproanimals/endpoints";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "../../shared/errors";
import { createController, defineRoute } from "../../shared/types/controller";
import {
  toAnimalResponse,
  toOrganizationResponse,
  toVolunteerResponse,
} from "../../shared/utils/serializers";
import { withAuth } from "../auth/auth.guard";
import { notificationsService } from "../notifications/notifications.service";
import { usersService } from "../users/users.service";
import { organizationsService } from "./organizations.service";

export const organizationsController = createController({
  list: defineRoute({
    method: "GET",
    url: endpoints.organizations.list(),
    schema: {
      response: { 200: listOrganizationsResponseSchema },
    },
    handler: async (request, reply) => {
      const userId = request.session.userId;
      const user = userId ? await usersService.getById(userId) : null;
      const rows =
        user?.role === "superadmin"
          ? await organizationsService.listAll()
          : await organizationsService.listApproved();
      return reply.send(rows.map(toOrganizationResponse));
    },
  }),

  get: defineRoute({
    method: "GET",
    url: endpoints.organizations.get({ id: ":id" }),
    schema: {
      params: getOrganizationParamsSchema,
      response: { 200: getOrganizationResponseSchema },
    },
    handler: async (request, reply) => {
      const org = await organizationsService.getById(request.params.id);
      if (!org) throw new NotFoundError("Organization");

      const userId = request.session.userId;
      const user = userId ? await usersService.getById(userId) : null;
      const isSuperadmin = user?.role === "superadmin";
      const isMember = user?.orgId === org.id;
      if (org.status !== "approved" && !isSuperadmin && !isMember) {
        throw new NotFoundError("Organization");
      }
      return reply.send(toOrganizationResponse(org));
    },
  }),

  animals: defineRoute({
    method: "GET",
    url: endpoints.organizations.animals({ id: ":id" }),
    schema: {
      params: orgAnimalsParamsSchema,
      response: { 200: orgAnimalsResponseSchema },
    },
    handler: async (request, reply) => {
      const rows = await organizationsService.animalsByOrg(request.params.id);
      return reply.send(rows.map(toAnimalResponse));
    },
  }),

  volunteers: defineRoute({
    method: "GET",
    url: endpoints.organizations.volunteers({ id: ":id" }),
    schema: {
      params: orgVolunteersParamsSchema,
      response: { 200: orgVolunteersResponseSchema },
    },
    handler: async (request, reply) => {
      const rows = await organizationsService.volunteersByOrg(
        request.params.id,
      );
      return reply.send(rows.map(toVolunteerResponse));
    },
  }),

  create: defineRoute({
    method: "POST",
    url: endpoints.organizations.create(),
    schema: {
      body: createOrganizationBodySchema,
      response: { 200: createOrganizationResponseSchema },
    },
    handler: withAuth(async (request, reply) => {
      const created = await organizationsService.create(
        request.body,
        request.session.userId,
      );
      await usersService.update(request.session.userId, {
        role: "admin",
        orgId: created.id,
      });
      await notificationsService.create({
        orgId: created.id,
        type: "org_created",
        title: `Нова організація: ${request.body.name}`,
        message: "Організація очікує модерації",
      });
      return reply.send({ id: created.id });
    }),
  }),

  updateStatus: defineRoute({
    method: "PATCH",
    url: endpoints.organizations.updateStatus(),
    schema: {
      body: updateOrgStatusBodySchema,
      response: { 200: updateOrgStatusResponseSchema },
    },
    handler: withAuth(async (request, reply) => {
      const user = await usersService.getById(request.session.userId);
      if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
        throw new ForbiddenError();
      }
      await organizationsService.updateStatus(
        request.body.id,
        request.body.status,
      );
      return reply.send({ success: true });
    }),
  }),

  updateOwn: defineRoute({
    method: "PUT",
    url: endpoints.organizations.updateOwn(),
    schema: {
      body: updateOwnOrganizationBodySchema,
      response: { 200: updateOwnOrganizationResponseSchema },
    },
    handler: withAuth(async (request, reply) => {
      const user = await usersService.getById(request.session.userId);
      if (!user?.orgId) throw new ForbiddenError();
      const org = await organizationsService.getById(user.orgId);
      if (!org || org.ownerId !== user.id) {
        throw new ForbiddenError("Only owner can edit organization");
      }
      if (!request.body.name) throw new BadRequestError("Name is required");
      await organizationsService.updateOwn(user.orgId, request.body);
      return reply.send({ success: true });
    }),
  }),

  updateJar: defineRoute({
    method: "PUT",
    url: endpoints.organizations.jar(),
    schema: {
      body: updateJarBodySchema,
      response: { 200: updateJarResponseSchema },
    },
    handler: withAuth(async (request, reply) => {
      const user = await usersService.getById(request.session.userId);
      if (!user?.orgId) throw new ForbiddenError();
      const org = await organizationsService.getById(user.orgId);
      if (!org || org.ownerId !== user.id) throw new ForbiddenError();
      await organizationsService.updateJar(
        user.orgId,
        request.body.monobankJarId ?? null,
      );
      return reply.send({ success: true });
    }),
  }),
});
