"use client";
import {
  useCreateLostMutation,
  useLostQuery,
  useUpdateLostMutation,
} from "@/shared/query-hooks";
import { endpoints } from "@dniproanimals/endpoints";
import { IconEdit, IconSearch, IconX } from "@dniproanimals/icons";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  type DialogProps,
} from "@dniproanimals/ui";
import { useQueryClient } from "@tanstack/react-query";
import {
  LOST_FORM_DEFAULTS,
  LostForm,
  lostFormValuesToBody,
  lostToFormValues,
  type LostFormValues,
} from "../LostForm";

interface LostFormDialogProps extends Omit<DialogProps, "children"> {
  editId: number | null;
  onClose: () => void;
}

export function LostFormDialog({
  editId,
  onClose,
  ...dialogProps
}: LostFormDialogProps) {
  const queryClient = useQueryClient();
  const { data: items = [] } = useLostQuery({ type: "lost" });
  const existing = editId != null ? items.find((i) => i.id === editId) : null;
  const isEditing = editId != null;

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: [endpoints.lost.list()] });
  const createMutation = useCreateLostMutation({
    onSuccess: () => {
      invalidate();
      onClose();
    },
  });
  const updateMutation = useUpdateLostMutation({
    onSuccess: () => {
      invalidate();
      onClose();
    },
  });

  const defaultValues: LostFormValues = existing
    ? lostToFormValues(existing)
    : LOST_FORM_DEFAULTS;

  const handleSubmit = (values: LostFormValues) => {
    const body = lostFormValuesToBody(values);
    if (editId != null) {
      updateMutation.mutate({ id: editId, body });
    } else {
      createMutation.mutate(body);
    }
  };

  const submitting = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog {...dialogProps}>
      <DialogContent hideClose className="max-w-md p-0 overflow-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>
            {isEditing ? "Редагувати оголошення" : "Загубив тварину"}
          </DialogTitle>
          <DialogDescription>Форма оголошення</DialogDescription>
        </DialogHeader>
        <div className="bg-red-500 px-5 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2 text-white">
            {isEditing ? <IconEdit size={18} /> : <IconSearch size={18} />}
            <h3 className="font-semibold">
              {isEditing ? "Редагувати оголошення" : "Загубив тварину"}
            </h3>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            <IconX size={20} />
          </Button>
        </div>
        <LostForm
          key={editId ?? "create"}
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          submitting={submitting}
          submitLabel={isEditing ? "Зберегти зміни" : "Опублікувати оголошення"}
        />
      </DialogContent>
    </Dialog>
  );
}
