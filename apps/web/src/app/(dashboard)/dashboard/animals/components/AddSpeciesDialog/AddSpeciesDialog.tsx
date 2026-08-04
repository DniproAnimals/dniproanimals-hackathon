"use client";
import { useCreateSpeciesMutation } from "@/shared/query-hooks";
import { IconPlus } from "@dniproanimals/icons";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
  Textarea,
} from "@dniproanimals/ui";
import { useState } from "react";

export function AddSpeciesDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [breedsText, setBreedsText] = useState("");

  const mutation = useCreateSpeciesMutation({
    onSuccess: () => {
      setOpen(false);
      setName("");
      setBreedsText("");
      window.location.reload();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const breeds = breedsText
      .split(",")
      .map((b) => b.trim())
      .filter(Boolean);

    mutation.mutate({
      name: name.trim(),
      breeds,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-1.5 bg-white border-gray-border"
        >
          <IconPlus size={16} />
          Додати вид
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Додати вид тварини</DialogTitle>
          <DialogDescription>
            Створіть новий вид тварини та задайте для нього породи.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="species-name">Назва виду *</Label>
            <Input
              id="species-name"
              placeholder="Наприклад: Лисиця"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="species-breeds">Породи (через кому)</Label>
            <Textarea
              id="species-breeds"
              placeholder="Наприклад: Руда, Сіра, Полярна"
              value={breedsText}
              onChange={(e) => setBreedsText(e.target.value)}
              rows={3}
            />
            <p className="text-xs text-gray-500 font-light">
              Вкажіть породи, розділяючи їх комами. Вони будуть доступні при
              додаванні тварини цього виду.
            </p>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={mutation.isPending}
            >
              Скасувати
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={mutation.isPending || !name.trim()}
            >
              {mutation.isPending ? "Збереження..." : "Додати"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
