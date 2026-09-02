"use client";
import {
  useAnimalDonationSupportersQuery,
  useSendAnimalSupportUpdateMutation,
  useUploadImageMutation,
} from "@/shared/query-hooks";
import type { Animal } from "@dniproanimals/contracts";
import {
  IconMail,
  IconPhoto,
  IconSend,
  IconUsers,
  IconX,
} from "@dniproanimals/icons";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
  Spinner,
} from "@dniproanimals/ui";
import Image from "next/image";
import { useRef, useState } from "react";

interface AnimalSupportManagerProps {
  animal: Pick<Animal, "id" | "name" | "donationsEnabled">;
}

export function AnimalSupportManager({ animal }: AnimalSupportManagerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const supporters = useAnimalDonationSupportersQuery(animal.id);
  const upload = useUploadImageMutation();
  const sendUpdate = useSendAnimalSupportUpdateMutation({
    onSuccess: () => {
      setPhotos([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
  });

  const handleFiles = async (files: FileList) => {
    const selectedFiles = Array.from(files);
    setUploadError(null);
    sendUpdate.reset();

    if (photos.length + selectedFiles.length > 10) {
      setUploadError("До одного оновлення можна додати не більше 10 фото.");
      return;
    }

    try {
      const uploaded = await Promise.all(
        selectedFiles.map((file) => upload.mutateAsync(file)),
      );
      setPhotos((current) => [
        ...current,
        ...uploaded.map((result) => result.url),
      ]);
    } catch (error) {
      setUploadError(
        error instanceof Error ? error.message : "Не вдалося завантажити фото.",
      );
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSend = () => {
    sendUpdate.mutate({
      animalId: animal.id,
      body: { photos },
    });
  };

  const summary = supporters.data;
  const supporterCount = summary?.count ?? 0;
  const error = supporters.error ?? sendUpdate.error;

  return (
    <Card className="mt-8">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <IconUsers aria-hidden="true" />
              Підтримка тварини
            </CardTitle>
            <CardDescription className="mt-1">
              Надішліть нові фотографії людям, які підтримують {animal.name}.
            </CardDescription>
          </div>
          <Badge variant="soft">
            {supporterCount} {supporterCount === 1 ? "людина" : "людей"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-5">
        {!animal.donationsEnabled && (
          <p className="rounded-xl bg-muted p-3 text-sm text-gray-medium">
            Спочатку увімкніть підтримку тварини та збережіть зміни.
          </p>
        )}

        <section aria-labelledby="animal-supporters-title">
          <h2
            id="animal-supporters-title"
            className="mb-3 text-sm font-semibold"
          >
            Активні жертвувателі
          </h2>

          {supporters.isLoading ? (
            <div className="flex items-center gap-2 text-sm text-gray-medium">
              <Spinner aria-label="Завантаження списку жертвувателів" />
              Завантаження...
            </div>
          ) : summary?.supporters.length ? (
            <ul className="flex max-h-48 flex-col gap-2 overflow-y-auto">
              {summary.supporters.map((supporter) => (
                <li
                  key={supporter.userId}
                  className="flex items-center gap-3 rounded-xl bg-gray-light p-3"
                >
                  <IconMail
                    aria-hidden="true"
                    className="text-green-secondary"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {supporter.name}
                    </p>
                    <a
                      href={`mailto:${supporter.email}`}
                      className="block truncate text-xs text-gray-medium hover:underline"
                    >
                      {supporter.email}
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-medium">
              Поки що цю тварину ніхто не підтримує.
            </p>
          )}
        </section>

        <Separator />

        <section aria-labelledby="animal-support-update-title">
          <h2
            id="animal-support-update-title"
            className="mb-1 text-sm font-semibold"
          >
            Нове фотооновлення
          </h2>
          <p className="mb-3 text-xs text-gray-medium">
            Додайте до 10 фотографій. Кожен жертвуватель отримає окремий лист.
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            className="hidden"
            onChange={(event) =>
              event.target.files && void handleFiles(event.target.files)
            }
          />

          <Button
            variant="outline"
            className="w-full"
            disabled={!animal.donationsEnabled || upload.isPending}
            onClick={() => fileInputRef.current?.click()}
          >
            <IconPhoto aria-hidden="true" />
            {upload.isPending ? "Завантаження..." : "Додати фотографії"}
          </Button>

          {photos.length > 0 && (
            <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
              {photos.map((photo, index) => (
                <div
                  key={photo}
                  className="group relative aspect-square overflow-hidden rounded-xl"
                >
                  <Image
                    src={photo}
                    alt={`${animal.name}: фото для оновлення ${index + 1}`}
                    fill
                    sizes="120px"
                    className="object-cover"
                  />
                  <button
                    type="button"
                    aria-label={`Видалити фото ${index + 1}`}
                    className="absolute right-1 top-1 flex size-7 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
                    onClick={() =>
                      setPhotos((current) =>
                        current.filter((_, photoIndex) => photoIndex !== index),
                      )
                    }
                  >
                    <IconX aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {(uploadError || error) && (
          <p role="alert" className="text-sm text-destructive">
            {uploadError ?? error?.message}
          </p>
        )}

        {sendUpdate.data && (
          <p role="status" className="rounded-xl bg-green-light p-3 text-sm">
            Надіслано: {sendUpdate.data.sentCount} з{" "}
            {sendUpdate.data.recipientCount}.
            {sendUpdate.data.failedCount > 0 &&
              ` Не вдалося доставити: ${sendUpdate.data.failedCount}.`}
          </p>
        )}

        <Button
          variant="primary"
          size="lg"
          className="w-full"
          disabled={
            !animal.donationsEnabled ||
            supporterCount === 0 ||
            photos.length === 0 ||
            upload.isPending ||
            sendUpdate.isPending
          }
          onClick={handleSend}
        >
          <IconSend aria-hidden="true" />
          {sendUpdate.isPending
            ? "Надсилання..."
            : `Надіслати ${supporterCount} ${supporterCount === 1 ? "людині" : "людям"}`}
        </Button>
      </CardContent>
    </Card>
  );
}
