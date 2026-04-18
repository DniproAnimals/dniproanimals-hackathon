import {
  superadminDeleteOrgBodySchema,
  superadminDeleteOrgResponseSchema,
  superadminListOrgsQuerySchema,
  superadminListOrgsResponseSchema,
  superadminOrgsStatsResponseSchema,
  superadminUpdateOrgBodySchema,
  superadminUpdateOrgResponseSchema,
} from "@dniproanimals/contracts";
import { endpoints } from "@dniproanimals/endpoints";
import { createController, defineRoute } from "../../shared/types/controller";
import { toOrganizationResponse } from "../../shared/utils/serializers";
import { withSuperadmin } from "./superadmin.guard";
import { superadminService } from "./superadmin.service";

export const superadminController = createController({
  listOrgs: defineRoute({
    method: "GET",
    url: endpoints.superadmin.listOrgs(),
    schema: {
      querystring: superadminListOrgsQuerySchema,
      response: { 200: superadminListOrgsResponseSchema },
    },
    handler: withSuperadmin(async (request, reply) => {
      const rows = await superadminService.listOrgs(request.query);
      return reply.send(rows.map(toOrganizationResponse));
    }),
  }),

  orgsStats: defineRoute({
    method: "GET",
    url: endpoints.superadmin.orgsStats(),
    schema: {
      response: { 200: superadminOrgsStatsResponseSchema },
    },
    handler: withSuperadmin(async (_request, reply) => {
      const stats = await superadminService.orgsStats();
      return reply.send(stats);
    }),
  }),

  updateOrg: defineRoute({
    method: "PUT",
    url: endpoints.superadmin.updateOrg(),
    schema: {
      body: superadminUpdateOrgBodySchema,
      response: { 200: superadminUpdateOrgResponseSchema },
    },
    handler: withSuperadmin(async (request, reply) => {
      await superadminService.updateOrgStatus(
        request.body.id,
        request.body.status,
      );
      return reply.send({ success: true });
    }),
  }),

  deleteOrg: defineRoute({
    method: "DELETE",
    url: endpoints.superadmin.deleteOrg(),
    schema: {
      body: superadminDeleteOrgBodySchema,
      response: { 200: superadminDeleteOrgResponseSchema },
    },
    handler: withSuperadmin(async (request, reply) => {
      await superadminService.deleteOrg(request.body.id);
      return reply.send({ success: true });
    }),
  }),
});
