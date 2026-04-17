import { uploadImageResponseSchema } from "@dniproanimals/contracts";
import { endpoints } from "@dniproanimals/endpoints";
import type { MultipartFile } from "@fastify/multipart";
import { BadRequestError } from "../../shared/errors";
import { createController, defineRoute } from "../../shared/types/controller";
import { withAuth } from "../auth/auth.guard";
import { uploadService } from "./upload.service";

export const uploadController = createController({
  uploadImage: defineRoute({
    method: "POST",
    url: endpoints.upload.image(),
    schema: {
      response: { 200: uploadImageResponseSchema },
    },
    handler: withAuth(async (request, reply) => {
      const body = request.body as Record<string, unknown> | null;
      const file = body?.file as MultipartFile | undefined;
      if (!file) throw new BadRequestError("File is required");

      const buffer = await file.toBuffer();
      try {
        const result = await uploadService.uploadImage({
          buffer,
          filename: file.filename,
          mimeType: file.mimetype,
        });
        return reply.send(result);
      } catch (err) {
        throw new BadRequestError(
          err instanceof Error ? err.message : "Upload failed",
        );
      }
    }),
  }),
});
