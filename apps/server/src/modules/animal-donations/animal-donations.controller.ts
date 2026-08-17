import {
  animalDonationParamsSchema,
  animalDonationResponseSchema,
  animalDonationSupportersSummarySchema,
  sendAnimalSupportUpdateBodySchema,
  sendAnimalSupportUpdateResponseSchema,
} from "@dniproanimals/contracts";
import { endpoints } from "@dniproanimals/endpoints";
import { BadRequestError, NotFoundError } from "../../shared/errors";
import { createController, defineRoute } from "../../shared/types/controller";
import { animalsService } from "../animals/animals.service";
import { withAuth, withDashboardRole } from "../auth/auth.guard";
import { animalDonationsService } from "./animal-donations.service";

export const animalDonationsController = createController({
  status: defineRoute({
    method: "GET",
    url: endpoints.animalDonations.status({ animalId: ":animalId" }),
    schema: {
      params: animalDonationParamsSchema,
      response: { 200: animalDonationResponseSchema },
    },
    handler: withAuth(async (request, reply) => {
      const active = await animalDonationsService.getStatus(
        request.session.userId,
        request.params.animalId,
      );
      return reply.send({ active });
    }),
  }),

  start: defineRoute({
    method: "POST",
    url: endpoints.animalDonations.start({ animalId: ":animalId" }),
    schema: {
      params: animalDonationParamsSchema,
      response: { 200: animalDonationResponseSchema },
    },
    handler: withAuth(async (request, reply) => {
      const animal = await animalsService.getById(request.params.animalId);
      if (!animal) throw new NotFoundError("Animal");
      if (!animal.donationsEnabled) {
        throw new BadRequestError("Donations are disabled for this animal");
      }

      const active = await animalDonationsService.start(
        request.session.userId,
        request.params.animalId,
      );
      return reply.send({ active });
    }),
  }),

  cancel: defineRoute({
    method: "DELETE",
    url: endpoints.animalDonations.cancel({ animalId: ":animalId" }),
    schema: {
      params: animalDonationParamsSchema,
      response: { 200: animalDonationResponseSchema },
    },
    handler: withAuth(async (request, reply) => {
      const active = await animalDonationsService.cancel(
        request.session.userId,
        request.params.animalId,
      );
      return reply.send({ active });
    }),
  }),

  supporters: defineRoute({
    method: "GET",
    url: endpoints.animalDonations.supporters({ animalId: ":animalId" }),
    schema: {
      params: animalDonationParamsSchema,
      response: { 200: animalDonationSupportersSummarySchema },
    },
    handler: withDashboardRole(async (request, reply) => {
      const supporters = await animalDonationsService.supporters(
        request.params.animalId,
      );
      return reply.send({ count: supporters.length, supporters });
    }),
  }),

  sendUpdate: defineRoute({
    method: "POST",
    url: endpoints.animalDonations.sendUpdate({ animalId: ":animalId" }),
    schema: {
      params: animalDonationParamsSchema,
      body: sendAnimalSupportUpdateBodySchema,
      response: { 200: sendAnimalSupportUpdateResponseSchema },
    },
    handler: withDashboardRole(async (request, reply) => {
      const result = await animalDonationsService.sendUpdate(
        request.session.userId,
        request.params.animalId,
        request.body,
      );
      return reply.send(result);
    }),
  }),
});
