"use client";
import type { LostAnimal } from "@dniproanimals/contracts";
import { IconX } from "@dniproanimals/icons";
import {
  Button,
  cn,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  type DialogProps,
} from "@dniproanimals/ui";
import { LostContactsPanel } from "./components/LostContactsPanel";
import { LostDetailActions } from "./components/LostDetailActions";
import { LostDetailAttributes } from "./components/LostDetailAttributes";
import { LostLastSeenPanel } from "./components/LostLastSeenPanel";
import { LostPhotoCarousel } from "./components/LostPhotoCarousel";

interface LostDetailDialogProps extends Omit<DialogProps, "children"> {
  item: LostAnimal | null;
  onEdit: (id: number) => void;
  onClose: () => void;
}

export function LostDetailDialog({
  item,
  onEdit,
  onClose,
  ...dialogProps
}: LostDetailDialogProps) {
  return (
    <Dialog {...dialogProps}>
      <DialogContent hideClose className="max-w-3xl p-0 overflow-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>{item?.title ?? "Оголошення"}</DialogTitle>
          <DialogDescription>Деталі оголошення</DialogDescription>
        </DialogHeader>
        {item && (
          <div className="md:flex">
            {item.photos.length > 0 && (
              <div className="md:w-1/2 p-5">
                <LostPhotoCarousel photos={item.photos} alt={item.title} />
              </div>
            )}
            <div
              className={cn(
                "p-5",
                item.photos.length > 0 ? "md:w-1/2" : "w-full",
              )}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <h2 className="text-lg font-bold">{item.title}</h2>
                <Button variant="ghost" size="icon-sm" onClick={onClose}>
                  <IconX size={20} />
                </Button>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-3">
                {item.description}
              </p>
              <LostDetailActions
                item={item}
                onEdit={onEdit}
                onClose={onClose}
              />
              <LostDetailAttributes item={item} />
              <LostLastSeenPanel item={item} />
              <LostContactsPanel item={item} />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
