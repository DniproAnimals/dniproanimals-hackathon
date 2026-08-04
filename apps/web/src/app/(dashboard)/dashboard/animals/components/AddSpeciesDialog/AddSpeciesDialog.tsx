"use client";
import {
  useAddBreedsMutation,
  useCreateSpeciesMutation,
  useSpeciesQuery,
} from "@/shared/query-hooks";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
} from "@dniproanimals/ui";
import { useState } from "react";

export function AddSpeciesDialog() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"create" | "update">("create");
  const [name, setName] = useState("");
  const [selectedSpeciesId, setSelectedSpeciesId] = useState<string>("");
  const [breedsText, setBreedsText] = useState("");

  const { data: species = [] } = useSpeciesQuery();

  const handleSuccess = () => {
    setOpen(false);
    setName("");
    setBreedsText("");
    setSelectedSpeciesId("");
    window.location.reload();
  };

  const createMutation = useCreateSpeciesMutation({
    onSuccess: handleSuccess,
  });

  const addBreedsMutation = useAddBreedsMutation({
    onSuccess: handleSuccess,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!breedsText.trim()) return;

    const breeds = breedsText
      .split(",")
      .map((b) => b.trim())
      .filter(Boolean);

    if (activeTab === "create") {
      if (!name.trim()) return;
      createMutation.mutate({
        name: name.trim(),
        breeds,
      });
    } else {
      if (!selectedSpeciesId) return;
      addBreedsMutation.mutate({
        speciesId: Number(selectedSpeciesId),
        breeds,
      });
    }
  };

  const isPending = createMutation.isPending || addBreedsMutation.isPending;

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
          <DialogTitle>Додати вид або породи</DialogTitle>
          <DialogDescription>
            Створіть новий вид тварини або додайте нові породи до вже існуючого
            виду.
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as "create" | "update")}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="create">Новий вид</TabsTrigger>
            <TabsTrigger value="update">Існуючий вид</TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit} className="space-y-4">
            <TabsContent value="create" className="mt-0 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="species-name">Назва виду *</Label>
                <Input
                  id="species-name"
                  placeholder="Наприклад: Лисиця"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={activeTab === "create"}
                />
              </div>
            </TabsContent>

            <TabsContent value="update" className="mt-0 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="existing-species">Оберіть вид *</Label>
                <Select
                  value={selectedSpeciesId}
                  onValueChange={setSelectedSpeciesId}
                  required={activeTab === "update"}
                >
                  <SelectTrigger id="existing-species">
                    <SelectValue placeholder="Оберіть вид тварини" />
                  </SelectTrigger>
                  <SelectContent>
                    {species.map((s) => (
                      <SelectItem key={s.id} value={String(s.id)}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            <div className="space-y-1.5">
              <Label htmlFor="species-breeds">Породи (через кому) *</Label>
              <Textarea
                id="species-breeds"
                placeholder="Наприклад: Руда, Сіра, Полярна"
                value={breedsText}
                onChange={(e) => setBreedsText(e.target.value)}
                rows={3}
                required
              />
              <p className="text-xs text-gray-500 font-light font-sans">
                Вкажіть породи, розділяючи їх комами. Вони будуть доступні при
                додаванні тварини цього виду.
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isPending}
              >
                Скасувати
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={
                  isPending ||
                  (activeTab === "create"
                    ? !name.trim()
                    : !selectedSpeciesId) ||
                  !breedsText.trim()
                }
              >
                {isPending ? "Збереження..." : "Додати"}
              </Button>
            </div>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
