import type { UploadImageResponse } from "@dniproanimals/contracts";
import { endpoints } from "@dniproanimals/endpoints";
import type { HttpFn } from "../createHttp";

export function createUploadApiService(http: HttpFn) {
  return {
    image: (file: File) => {
      const form = new FormData();
      form.append("file", file);
      return http<UploadImageResponse>({
        endpoint: endpoints.upload.image(),
        method: "POST",
        body: form,
      });
    },
  };
}
