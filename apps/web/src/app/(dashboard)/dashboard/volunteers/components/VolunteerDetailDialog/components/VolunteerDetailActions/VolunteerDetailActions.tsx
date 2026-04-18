"use client";
import {
  useCurrentOrg,
  useDeleteVolunteerMutation,
} from "@/shared/query-hooks";
import type { Volunteer } from "@dniproanimals/contracts";
import { endpoints } from "@dniproanimals/endpoints";
import { IconEdit, IconLink, IconTrash } from "@dniproanimals/icons";
import { Button } from "@dniproanimals/ui";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

interface VolunteerDetailActionsProps {
  volunteer: Volunteer;
  onEdit: (volunteer: Volunteer) => void;
  onClose: () => void;
}

export function VolunteerDetailActions({
  volunteer,
  onEdit,
  onClose,
}: VolunteerDetailActionsProps) {
  const { isOwner } = useCurrentOrg();
  const queryClient = useQueryClient();
  const [copied, setCopied] = useState(false);

  const deleteMutation = useDeleteVolunteerMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [endpoints.volunteers.list()],
      });
      queryClient.invalidateQueries({
        queryKey: [endpoints.volunteers.stats()],
      });
      onClose();
    },
  });

  if (!isOwner) return null;

  const copyInviteLink = () => {
    if (!volunteer.inviteToken) return;
    navigator.clipboard.writeText(
      `${window.location.origin}/invite?token=${volunteer.inviteToken}`,
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = () => {
    if (!confirm("Видалити волонтера?")) return;
    deleteMutation.mutate({ id: volunteer.id });
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="soft"
        size="lg"
        onClick={() => onEdit(volunteer)}
        className="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-100"
      >
        <IconEdit size={14} /> Редагувати
      </Button>
      {!volunteer.userId && volunteer.inviteToken && (
        <Button
          variant="subtle"
          size="lg"
          onClick={copyInviteLink}
          className="flex-1"
        >
          <IconLink size={14} />
          {copied ? "Скопійовано!" : "Запрошення"}
        </Button>
      )}
      <Button
        variant="ghost"
        size="lg"
        onClick={handleDelete}
        className="bg-red-50 text-destructive hover:bg-red-100 px-3"
      >
        <IconTrash size={14} />
      </Button>
    </div>
  );
}
