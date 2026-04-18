"use client";
import {
  useCreateVolunteerMutation,
  useUpdateVolunteerMutation,
  useVolunteersQuery,
} from "@/shared/query-hooks";
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
  editId: number | null;
  onClose: () => void;
}

export function VolunteerFormDialog({
  editId,
  onClose,
  ...dialogProps
}: VolunteerFormDialogProps) {
  const queryClient = useQueryClient();
  const { data: volunteers = [] } = useVolunteersQuery();
  const existing =
    editId != null ? volunteers.find((v) => v.id === editId) : null;
  const isEditing = editId != null;

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

  const defaultValues: VolunteerFormValues = existing
    ? volunteerToFormValues(existing)
    : VOLUNTEER_FORM_DEFAULTS;

  const handleSubmit = (values: VolunteerFormValues) => {
    const body = volunteerFormValuesToBody(values);
    if (editId != null) {
      updateMutation.mutate({ id: editId, ...body });
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
          key={editId ?? "create"}
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          submitting={submitting}
          submitLabel={isEditing ? "Зберегти зміни" : "Додати волонтера"}
        />
      </DialogContent>
    </Dialog>
  );
}
