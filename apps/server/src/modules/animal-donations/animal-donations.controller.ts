import {
  animalDonationParamsSchema,
  animalDonationResponseSchema,
} from "@dniproanimals/contracts";
import { endpoints } from "@dniproanimals/endpoints";
import { BadRequestError, NotFoundError } from "../../shared/errors";
import { createController, defineRoute } from "../../shared/types/controller";
import { animalsService } from "../animals/animals.service";
import { withAuth } from "../auth/auth.guard";
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
});
