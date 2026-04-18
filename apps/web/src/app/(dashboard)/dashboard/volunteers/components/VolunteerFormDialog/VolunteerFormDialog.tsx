"use client";
import {
  useCreateVolunteerMutation,
  useUpdateVolunteerMutation,
} from "@/shared/query-hooks";
import type { Volunteer } from "@dniproanimals/contracts";
import { endpoints } from "@dniproanimals/endpoints";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  type DialogProps,
} from "@dniproanimals/ui";
import { useQueryClient } from "@tanstack/react-query";
import {
  VOLUNTEER_FORM_DEFAULTS,
  VolunteerForm,
  volunteerFormValuesToBody,
  volunteerToFormValues,
  type VolunteerFormValues,
} from "../VolunteerForm";

interface VolunteerFormDialogProps extends Omit<DialogProps, "children"> {
  volunteer: Volunteer | null;
  onClose: () => void;
}

export function VolunteerFormDialog({
  volunteer,
  onClose,
  ...dialogProps
}: VolunteerFormDialogProps) {
  const queryClient = useQueryClient();
  const isEditing = volunteer != null;

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: [endpoints.volunteers.list()] });
    queryClient.invalidateQueries({ queryKey: [endpoints.volunteers.stats()] });
  };
  const createMutation = useCreateVolunteerMutation({
    onSuccess: () => {
      invalidate();
      onClose();
    },
  });
  const updateMutation = useUpdateVolunteerMutation({
    onSuccess: () => {
      invalidate();
      onClose();
    },
  });

  const defaultValues: VolunteerFormValues = volunteer
    ? volunteerToFormValues(volunteer)
    : VOLUNTEER_FORM_DEFAULTS;

  const handleSubmit = (values: VolunteerFormValues) => {
    const body = volunteerFormValuesToBody(values);
    if (volunteer) {
      updateMutation.mutate({ id: volunteer.id, ...body });
    } else {
      createMutation.mutate(body);
    }
  };

  const submitting = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog {...dialogProps}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Редагувати волонтера" : "Додати волонтера"}
          </DialogTitle>
        </DialogHeader>
        <VolunteerForm
          key={volunteer?.id ?? "create"}
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          submitting={submitting}
          submitLabel={isEditing ? "Зберегти зміни" : "Додати волонтера"}
        />
      </DialogContent>
    </Dialog>
  );
}
