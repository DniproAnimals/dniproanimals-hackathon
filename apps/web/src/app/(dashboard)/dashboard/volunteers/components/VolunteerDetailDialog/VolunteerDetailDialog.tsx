"use client";
import type { Volunteer } from "@dniproanimals/contracts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  type DialogProps,
} from "@dniproanimals/ui";
import { VolunteerAvatar } from "../VolunteerAvatar";
import { VolunteerStatusBadge } from "../VolunteerStatusBadge";
import { VolunteerContactList } from "./components/VolunteerContactList";
import { VolunteerDetailActions } from "./components/VolunteerDetailActions";

interface VolunteerDetailDialogProps extends Omit<DialogProps, "children"> {
  volunteer: Volunteer | null;
  onEdit: (volunteer: Volunteer) => void;
  onClose: () => void;
}

export function VolunteerDetailDialog({
  volunteer,
  onEdit,
  onClose,
  ...dialogProps
}: VolunteerDetailDialogProps) {
  return (
    <Dialog {...dialogProps}>
      <DialogContent className="p-0 overflow-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>{volunteer?.name ?? "Волонтер"}</DialogTitle>
          <DialogDescription>Деталі волонтера</DialogDescription>
        </DialogHeader>
        {volunteer && (
          <>
            <div className="relative h-20 bg-primary/30" />
            <div className="px-5 -mt-10 mb-4">
              <VolunteerAvatar volunteer={volunteer} size="lg" />
            </div>
            <div className="px-5 pb-5">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-lg font-bold">
                  {volunteer.name}
                  {volunteer.surname ? ` ${volunteer.surname}` : ""}
                </h2>
                <VolunteerStatusBadge active={!!volunteer.userId} />
              </div>
              {volunteer.description && (
                <p className="text-sm text-gray-medium mb-4">
                  {volunteer.description}
                </p>
              )}
              <VolunteerContactList volunteer={volunteer} />
              <VolunteerDetailActions
                volunteer={volunteer}
                onEdit={onEdit}
                onClose={onClose}
              />
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
