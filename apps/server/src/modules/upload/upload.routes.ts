import type { FastifyZodInstance } from "../../shared/types/fastify";
import { uploadController } from "./upload.controller";

export function registerUploadRoutes(app: FastifyZodInstance) {
  app.route(uploadController.uploadImage);
}
