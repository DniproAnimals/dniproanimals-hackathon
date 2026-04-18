"use client";
import {
  useAcceptInviteMutation,
  useInviteInfoQuery,
} from "@/shared/query-hooks";
import { endpoints } from "@dniproanimals/endpoints";
import { Skeleton } from "@dniproanimals/ui";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AcceptInviteForm,
  type AcceptInviteFormValues,
} from "./components/AcceptInviteForm";
import { InvalidInvite } from "./components/InvalidInvite";

export default function InvitePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const { data, isLoading, error } = useInviteInfoQuery(token, {
    enabled: !!token,
  });

  const acceptMutation = useAcceptInviteMutation({
    onSuccess: (user) => {
      queryClient.setQueryData([endpoints.auth.me()], user);
      router.push("/dashboard");
    },
  });

  const handleSubmit = (values: AcceptInviteFormValues) => {
    if (!token) return;
    acceptMutation.mutate({ token, ...values });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <Skeleton className="size-10 rounded-full" />
      </div>
    );
  }

  if (!token || !data) {
    return <InvalidInvite message={error?.message} />;
  }

  return (
    <>
      <div className="text-center mb-6">
        <h1 className="text-xl font-bold text-foreground mb-1">Запрошення</h1>
        <p className="text-sm text-gray-medium">
          Вас запрошено як волонтера{" "}
          <strong>
            {data.volunteerName}
            {data.volunteerSurname}
          </strong>{" "}
          до організації <strong>{data.orgName}</strong>
        </p>
      </div>
      <AcceptInviteForm
        onSubmit={handleSubmit}
        submitting={acceptMutation.isPending}
        errorMessage={acceptMutation.error?.message}
      />
    </>
  );
}
