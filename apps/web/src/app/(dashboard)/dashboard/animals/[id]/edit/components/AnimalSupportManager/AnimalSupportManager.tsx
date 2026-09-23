"use client";
import {
  useAnimalDonationSupportersQuery,
  useDeactivateAnimalSupporterMutation,
  useSendAnimalSupportUpdateMutation,
  useUploadImageMutation,
} from "@/shared/query-hooks";
import {
  ANIMAL_SUPPORT_TYPE_LABELS,
  type Animal,
} from "@dniproanimals/contracts";
import { endpoints } from "@dniproanimals/endpoints";
import {
  IconMail,
  IconPhone,
  IconPhoto,
  IconSend,
  IconTrash,
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
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useRef, useState } from "react";

interface AnimalSupportManagerProps {
  animal: Pick<Animal, "id" | "name" | "donationsEnabled">;
}

export function AnimalSupportManager({ animal }: AnimalSupportManagerProps) {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const supporters = useAnimalDonationSupportersQuery(animal.id);
  const upload = useUploadImageMutation();
  const deactivate = useDeactivateAnimalSupporterMutation({
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [
          endpoints.animalDonations.supporters({ animalId: animal.id }),
        ],
      }),
  });
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

  const handleDeactivate = (userId: number, name: string) => {
    if (!confirm(`Припинити підтримку від ${name}?`)) return;
    deactivate.mutate({ animalId: animal.id, userId });
  };

  const summary = supporters.data;
  const supporterCount = summary?.count ?? 0;
  const error = supporters.error ?? sendUpdate.error ?? deactivate.error;

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
            Активна підтримка
          </h2>

          {supporters.isLoading ? (
            <div className="flex items-center gap-2 text-sm text-gray-medium">
              <Spinner aria-label="Завантаження списку підтримки" />
              Завантаження...
            </div>
          ) : summary?.supporters.length ? (
            <ul className="flex max-h-80 flex-col gap-2 overflow-y-auto">
              {summary.supporters.map((supporter) => (
                <li
                  key={supporter.userId}
                  className="flex flex-col gap-3 rounded-xl bg-gray-light p-3 sm:flex-row sm:items-center"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {supporter.name}
                    </p>
                    <div className="mt-1 flex flex-col gap-1 text-xs text-gray-medium">
                      <a
                        href={`mailto:${supporter.email}`}
                        className="flex items-center gap-1.5 hover:underline"
                      >
                        <IconMail aria-hidden="true" />
                        <span className="truncate">{supporter.email}</span>
                      </a>
                      {supporter.phone ? (
                        <a
                          href={`tel:${supporter.phone}`}
                          className="flex items-center gap-1.5 hover:underline"
                        >
                          <IconPhone aria-hidden="true" />
                          {supporter.phone}
                        </a>
                      ) : null}
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <Badge variant="soft" size="sm">
                        {supporter.supportType
                          ? ANIMAL_SUPPORT_TYPE_LABELS[supporter.supportType]
                          : "Тип не вказано"}
                      </Badge>
                      <span className="text-xs text-gray-medium">
                        З{" "}
                        {new Date(supporter.startedAt).toLocaleDateString(
                          "uk-UA",
                        )}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive"
                    disabled={deactivate.isPending}
                    onClick={() =>
                      handleDeactivate(supporter.userId, supporter.name)
                    }
                  >
                    <IconTrash aria-hidden="true" data-icon="inline-start" />
                    Видалити
                  </Button>
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
            Додайте до 10 фотографій. Кожен підтримувач отримає окремий лист.
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
