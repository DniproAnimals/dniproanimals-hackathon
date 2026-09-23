"use client";

import {
  useAnimalDonationStatusQuery,
  useCancelAnimalDonationMutation,
  useStartAnimalDonationMutation,
} from "@/shared/query-hooks";
import {
  ANIMAL_SUPPORT_TYPES,
  ANIMAL_SUPPORT_TYPE_LABELS,
  startAnimalDonationBodySchema,
  type StartAnimalDonationBody,
  type User,
} from "@dniproanimals/contracts";
import { endpoints } from "@dniproanimals/endpoints";
import { IconHeart, IconMail } from "@dniproanimals/icons";
import {
  Button,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  RadioGroup,
  RadioGroupItem,
  Spinner,
} from "@dniproanimals/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useForm } from "react-hook-form";

interface AnimalDonationDialogProps {
  animalId: number;
  animalName: string;
  user?: User;
  isUserLoading: boolean;
}

interface AuthenticatedAnimalDonationDialogProps {
  animalId: number;
  animalName: string;
  user: User;
}

function AuthenticatedAnimalDonationDialog({
  animalId,
  animalName,
  user,
}: AuthenticatedAnimalDonationDialogProps) {
  const queryClient = useQueryClient();
  const queryKey = [endpoints.animalDonations.status({ animalId })];
  const status = useAnimalDonationStatusQuery(animalId);
  const form = useForm<StartAnimalDonationBody>({
    resolver: zodResolver(startAnimalDonationBodySchema),
    defaultValues: {
      supportType: "financial",
      phone: user.phone ?? "",
    },
  });
  const start = useStartAnimalDonationMutation({
    onSuccess: (data) => queryClient.setQueryData(queryKey, data),
  });
  const cancel = useCancelAnimalDonationMutation({
    onSuccess: (data) => queryClient.setQueryData(queryKey, data),
  });

  if (status.isLoading) {
    return (
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Підтримати {animalName}</DialogTitle>
          <DialogDescription>Перевіряємо стан підтримки.</DialogDescription>
        </DialogHeader>
        <div className="flex justify-center py-6">
          <Spinner aria-label="Завантаження стану підтримки" />
        </div>
      </DialogContent>
    );
  }

  const active = status.data?.active ?? false;
  const error = status.error ?? start.error ?? cancel.error;

  const handleStart = (body: StartAnimalDonationBody) => {
    cancel.reset();
    start.mutate({ animalId, body });
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
            ? "Підтримка активна. Ми надсилатимемо вам новини про тварину."
            : "Оберіть зручний тип допомоги. Після заявки адміністратор зателефонує вам для узгодження деталей."}
        </DialogDescription>
      </DialogHeader>

      <div className="flex items-center gap-3 rounded-xl bg-gray-light p-3 text-sm">
        <IconMail aria-hidden="true" className="text-green-secondary" />
        <div className="min-w-0">
          <p className="text-xs text-gray-medium">Підтвердження надійде на</p>
          <p className="truncate font-medium text-foreground">{user.email}</p>
        </div>
      </div>

      {start.isSuccess ? (
        <p role="status" className="rounded-xl bg-green-light p-3 text-sm">
          Дякуємо! Ми отримали вашу заявку та невдовзі зателефонуємо.
        </p>
      ) : null}

      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error.message}
        </p>
      ) : null}

      {active ? (
        <Button
          variant="outline"
          className="w-full text-destructive"
          disabled={cancel.isPending}
          onClick={handleCancel}
        >
          {cancel.isPending ? "Відписуємо..." : "Припинити підтримку"}
        </Button>
      ) : (
        <Form {...form}>
          <form
            className="flex flex-col gap-4"
            onSubmit={form.handleSubmit(handleStart)}
          >
            <FormField
              control={form.control}
              name="supportType"
              render={({ field }) => (
                <FormItem>
                  <fieldset className="flex flex-col gap-1.5">
                    <legend className="text-sm font-medium">
                      Тип підтримки
                    </legend>
                    <FormControl>
                      <RadioGroup
                        value={field.value}
                        onValueChange={field.onChange}
                        className="grid gap-2 sm:grid-cols-2"
                      >
                        {ANIMAL_SUPPORT_TYPES.map((type) => {
                          const id = `animal-support-${type}`;
                          return (
                            <div
                              key={type}
                              className="flex min-h-11 items-center gap-3 rounded-xl border border-gray-border bg-white px-3 text-sm transition-colors hover:border-primary"
                            >
                              <RadioGroupItem id={id} value={type} />
                              <label
                                htmlFor={id}
                                className="flex min-h-11 flex-1 cursor-pointer items-center py-2"
                              >
                                {ANIMAL_SUPPORT_TYPE_LABELS[type]}
                              </label>
                            </div>
                          );
                        })}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </fieldset>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Номер телефону</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      autoComplete="tel"
                      placeholder="+380 00 000 00 00"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Адміністратор зателефонує, щоб узгодити допомогу.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={start.isPending}>
              {start.isPending ? "Надсилаємо..." : "Підтвердити підтримку"}
            </Button>
          </form>
        </Form>
      )}
    </DialogContent>
  );
}

export function AnimalDonationDialog({
  animalId,
  animalName,
  user,
  isUserLoading,
}: AnimalDonationDialogProps) {
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
            Підтримка прив’язується до вашого облікового запису, щоб ви могли
            отримувати новини та за потреби відписатися.
          </DialogDescription>
        </DialogHeader>
        <Button asChild className="w-full">
          <Link
            href={`/auth/signin?returnTo=${encodeURIComponent(`/animals/${animalId}`)}`}
          >
            Увійти до облікового запису
          </Link>
        </Button>
      </DialogContent>
    );
  }

  return (
    <AuthenticatedAnimalDonationDialog
      animalId={animalId}
      animalName={animalName}
      user={user}
    />
  );
}
