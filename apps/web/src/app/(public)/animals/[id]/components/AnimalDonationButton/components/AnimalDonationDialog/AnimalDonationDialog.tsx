"use client";
import {
  useAnimalDonationStatusQuery,
  useCancelAnimalDonationMutation,
  useStartAnimalDonationMutation,
} from "@/shared/query-hooks";
import type { User } from "@dniproanimals/contracts";
import { endpoints } from "@dniproanimals/endpoints";
import { IconHeart, IconMail } from "@dniproanimals/icons";
import {
  Button,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Spinner,
} from "@dniproanimals/ui";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";

interface AnimalDonationDialogProps {
  animalId: number;
  animalName: string;
  user?: User;
  isUserLoading: boolean;
}

export function AnimalDonationDialog({
  animalId,
  animalName,
  user,
  isUserLoading,
}: AnimalDonationDialogProps) {
  const queryClient = useQueryClient();
  const queryKey = [endpoints.animalDonations.status({ animalId })];
  const status = useAnimalDonationStatusQuery(animalId, {
    enabled: !!user,
  });
  const start = useStartAnimalDonationMutation({
    onSuccess: (data) => queryClient.setQueryData(queryKey, data),
  });
  const cancel = useCancelAnimalDonationMutation({
    onSuccess: (data) => queryClient.setQueryData(queryKey, data),
  });

  if (isUserLoading) {
    return (
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Підтримати {animalName}</DialogTitle>
          <DialogDescription>
            Перевіряємо ваш обліковий запис.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center py-6">
          <Spinner aria-label="Завантаження облікового запису" />
        </div>
      </DialogContent>
    );
  }

  if (!user) {
    return (
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="mb-2 flex size-12 items-center justify-center rounded-full bg-green-light text-green-secondary">
            <IconHeart aria-hidden="true" />
          </div>
          <DialogTitle>Увійдіть, щоб підтримати {animalName}</DialogTitle>
          <DialogDescription>
            Пожертва прив’язується до вашого облікового запису. Фото та новини
            надходитимуть на підтверджену email-адресу.
          </DialogDescription>
        </DialogHeader>
        <Button asChild className="w-full">
          <Link href="/auth/signin">Увійти до облікового запису</Link>
        </Button>
      </DialogContent>
    );
  }

  if (status.isLoading) {
    return (
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Підтримати {animalName}</DialogTitle>
          <DialogDescription>Перевіряємо стан пожертви.</DialogDescription>
        </DialogHeader>
        <div className="flex justify-center py-6">
          <Spinner aria-label="Завантаження стану пожертви" />
        </div>
      </DialogContent>
    );
  }

  const active = status.data?.active ?? false;
  const error = status.error ?? start.error ?? cancel.error;

  const handleStart = () => {
    cancel.reset();
    start.mutate(animalId);
  };

  const handleCancel = () => {
    start.reset();
    cancel.mutate(animalId);
  };

  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <div className="mb-2 flex size-12 items-center justify-center rounded-full bg-green-light text-green-secondary">
          <IconHeart aria-hidden="true" />
        </div>
        <DialogTitle>
          {active ? `Ви підтримуєте ${animalName}` : `Підтримати ${animalName}`}
        </DialogTitle>
        <DialogDescription>
          {active
            ? "Пожертва активна. Раз на місяць волонтери надсилатимуть вам нові фото та історії про тваринку."
            : "Оформіть регулярну пожертву для тваринки. На цьому етапі кошти не списуються."}
        </DialogDescription>
      </DialogHeader>

      <div className="flex items-center gap-3 rounded-xl bg-gray-light p-3 text-sm">
        <IconMail aria-hidden="true" className="text-green-secondary" />
        <div className="min-w-0">
          <p className="text-xs text-gray-medium">Новини надходитимуть на</p>
          <p className="truncate font-medium text-foreground">{user.email}</p>
        </div>
      </div>

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error.message}
        </p>
      )}

      {active ? (
        <Button
          variant="outline"
          className="w-full text-destructive"
          disabled={cancel.isPending}
          onClick={handleCancel}
        >
          {cancel.isPending ? "Скасування..." : "Скасувати пожертву"}
        </Button>
      ) : (
        <Button
          variant="primary"
          className="w-full"
          disabled={start.isPending}
          onClick={handleStart}
        >
          {start.isPending ? "Оформлюємо..." : "Оформити пожертву"}
        </Button>
      )}
    </DialogContent>
  );
}
