"use client";
import type {
  AdoptionRequestWithAnimal,
  AdoptionStatus,
} from "@dniproanimals/contracts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  type DialogProps,
} from "@dniproanimals/ui";
import { RequestAnimalCard } from "./components/RequestAnimalCard";
import { RequestContactList } from "./components/RequestContactList";
import { RequestDetailHeader } from "./components/RequestDetailHeader";
import { RequestMessage } from "./components/RequestMessage";
import { RequestStatusActions } from "./components/RequestStatusActions";

interface RequestDetailDialogProps extends Omit<DialogProps, "children"> {
  request: AdoptionRequestWithAnimal | null;
  onStatusChange?: (status: AdoptionStatus) => void;
}

export function RequestDetailDialog({
  request,
  onStatusChange,
  ...dialogProps
}: RequestDetailDialogProps) {
  return (
    <Dialog {...dialogProps}>
      <DialogContent className="max-w-lg p-0 overflow-hidden">
        <DialogTitle className="sr-only">Деталі заявки</DialogTitle>
        <DialogDescription className="sr-only">
          Контактні дані, повідомлення та статус заявки на усиновлення.
        </DialogDescription>
        {request && (
          <>
            <RequestDetailHeader request={request} />
            <div className="p-5">
              <RequestAnimalCard request={request} />
              <RequestContactList request={request} />
              <RequestMessage message={request.message} />
              <RequestStatusActions
                request={request}
                onStatusChange={onStatusChange}
              />
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
