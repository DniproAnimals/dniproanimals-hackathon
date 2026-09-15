import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { env } from "@dniproanimals/env";
import { randomUUID } from "node:crypto";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const EXTENSIONS_BY_MIME_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};
const MAX_SIZE = 10 * 1024 * 1024;

function getR2Config() {
  const required = {
    R2_ENDPOINT: env.R2_ENDPOINT,
    R2_ACCESS_KEY_ID: env.R2_ACCESS_KEY_ID,
    R2_SECRET_ACCESS_KEY: env.R2_SECRET_ACCESS_KEY,
    R2_BUCKET_NAME: env.R2_BUCKET_NAME,
    R2_PUBLIC_URL: env.R2_PUBLIC_URL,
  };
  const missing = Object.entries(required)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(`Cloudflare R2 is not configured: ${missing.join(", ")}`);
  }

  return {
    endpoint: required.R2_ENDPOINT!.replace(/\/$/, ""),
    accessKeyId: required.R2_ACCESS_KEY_ID!,
    secretAccessKey: required.R2_SECRET_ACCESS_KEY!,
    bucketName: required.R2_BUCKET_NAME!,
    publicUrl: required.R2_PUBLIC_URL!.replace(/\/$/, ""),
  };
}

function createObjectKey(extension: string) {
  const now = new Date();
  const year = String(now.getUTCFullYear());
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  return `photos/${year}/${month}/${Date.now()}-${randomUUID()}.${extension}`;
}

function createPublicUrl(baseUrl: string, objectKey: string) {
  const encodedKey = objectKey
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
  return `${baseUrl}/${encodedKey}`;
}

export const uploadService = {
  async uploadImage(input: {
    buffer: Buffer;
    filename: string;
    mimeType: string;
  }) {
    if (!ALLOWED_TYPES.includes(input.mimeType)) {
      throw new Error("Only images are allowed (JPEG, PNG, WebP, GIF)");
    }
    if (input.buffer.byteLength > MAX_SIZE) {
      throw new Error("File is too large (max 10MB)");
    }

    const extension = EXTENSIONS_BY_MIME_TYPE[input.mimeType];
    if (!extension) throw new Error("Unsupported image type");

    const config = getR2Config();
    const objectKey = createObjectKey(extension);
    const client = new S3Client({
      region: "auto",
      endpoint: config.endpoint,
      forcePathStyle: true,
      requestChecksumCalculation: "WHEN_REQUIRED",
      responseChecksumValidation: "WHEN_REQUIRED",
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    });

    try {
      await client.send(
        new PutObjectCommand({
          Bucket: config.bucketName,
          Key: objectKey,
          Body: input.buffer,
          ContentType: input.mimeType,
          CacheControl: "public, max-age=31536000, immutable",
        }),
      );
    } catch (error) {
      throw new Error(`Cloudflare R2 bucket was not found.`);
    }

    return { url: createPublicUrl(config.publicUrl, objectKey) };
  },
};
