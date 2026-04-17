import {
  superadminDeleteOrgBodySchema,
  superadminDeleteOrgResponseSchema,
  superadminUpdateOrgBodySchema,
  superadminUpdateOrgResponseSchema,
} from "@dniproanimals/contracts";
import { endpoints } from "@dniproanimals/endpoints";
import { createController, defineRoute } from "../../shared/types/controller";
import { withSuperadmin } from "./superadmin.guard";
import { superadminService } from "./superadmin.service";

export const superadminController = createController({
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
