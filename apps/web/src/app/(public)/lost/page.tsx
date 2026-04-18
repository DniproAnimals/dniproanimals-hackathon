"use client";
import ImageFallback from "@/shared/components/ImageFallback";
import {
  useCreateLostMutation,
  useLostQuery,
  useUpdateLostMutation,
  useUploadImageMutation,
} from "@/shared/query-hooks";
import type { LostAnimal, LostType } from "@dniproanimals/contracts";
import { endpoints } from "@dniproanimals/endpoints";
import {
  IconCalendar,
  IconCheck,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconEdit,
  IconEye,
  IconMapPin,
  IconPackage,
  IconPalette,
  IconPaw,
  IconPhone,
  IconPhoto,
  IconSearch,
  IconTag,
  IconUser,
  IconX,
} from "@dniproanimals/icons";
import {
  Button,
  cn,
  Dialog,
  DialogContent,
  Input,
  InputWithIcon,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Skeleton,
  Textarea,
} from "@dniproanimals/ui";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useRef, useState } from "react";

const dogBreeds = [
  "Німецька вівчарка",
  "Лабрадор",
  "Хаскі",
  "Бульдог",
  "Мікс",
];
const catBreeds = [
  "Європейська короткошерста",
  "Сіамська",
  "Мейн-кун",
  "Мікс",
];

const colorOptions = [
  { value: "Білий", color: "#ffffff" },
  { value: "Чорний", color: "#1a1a1a" },
  { value: "Сірий", color: "#9e9e9e" },
  { value: "Рудий", color: "#c45e1a" },
  { value: "Коричневий", color: "#6d4c2e" },
];

export default function LostAnimalsPage() {
  const queryClient = useQueryClient();
  const filter: LostType = "lost";
  const { data: items = [], isLoading: loading } = useLostQuery({
    type: filter,
  });
  const uploadMutation = useUploadImageMutation();
  const createMutation = useCreateLostMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [endpoints.lost.list()] });
      setShowForm(false);
      resetForm();
    },
  });
  const updateMutation = useUpdateLostMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [endpoints.lost.list()] });
      setShowForm(false);
      setSelectedItem(null);
      resetForm();
    },
  });

  const [showForm, setShowForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState<LostAnimal | null>(null);
  const [detailPhoto, setDetailPhoto] = useState(0);
  const [breedOpen, setBreedOpen] = useState(false);
  const [colorOpen, setColorOpen] = useState(false);
  const [breedSearch, setBreedSearch] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "lost" as LostType,
    animalType: "",
    breed: "",
    sex: "",
    color: "",
    size: "",
    location: "",
    lastSeenLocation: "",
    lastSeenDate: "",
    contactName: "",
    contactPhone: "",
    photos: [] as string[],
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      type: "lost",
      animalType: "",
      breed: "",
      sex: "",
      color: "",
      size: "",
      location: "",
      lastSeenLocation: "",
      lastSeenDate: "",
      contactName: "",
      contactPhone: "",
      photos: [],
    });
    setEditingId(null);
  };

  const openEditForm = (item: LostAnimal) => {
    setFormData({
      title: item.title,
      description: item.description,
      type: item.type,
      animalType: item.animalType || "",
      breed: item.breed || "",
      sex: item.sex || "",
      color: item.color || "",
      size: item.size || "",
      location: item.location || "",
      lastSeenLocation: item.lastSeenLocation || "",
      lastSeenDate: item.lastSeenDate || "",
      contactName: item.contactName,
      contactPhone: item.contactPhone,
      photos: item.photos,
    });
    setEditingId(item.id);
    setSelectedItem(null);
    setShowForm(true);
  };

  const handleMarkFound = (item: LostAnimal) => {
    updateMutation.mutate({ id: item.id, body: { type: "found" } });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate({ id: editingId, body: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleFiles = async (files: FileList) => {
    for (const file of Array.from(files)) {
      const result = await uploadMutation.mutateAsync(file);
      setFormData((prev) => ({
        ...prev,
        photos: [...prev.photos, result.url],
      }));
    }
    if (fileRef.current) fileRef.current.value = "";
  };

  const breeds = formData.animalType === "Кіт" ? catBreeds : dogBreeds;
  const filteredBreeds = breedSearch
    ? breeds.filter((b) => b.toLowerCase().includes(breedSearch.toLowerCase()))
    : breeds;

  const submitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="max-w-6xl mx-auto px-6 py-6 pb-24 md:pb-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Загублені тварини</h1>
          <p className="text-sm text-gray-medium mt-1">
            Допоможіть знайти господарів
          </p>
        </div>
        <Button
          variant="destructive"
          size="md"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          <IconSearch size={14} />
          Загубив тварину
        </Button>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="rounded-2xl h-48" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-lg font-semibold">Оголошень поки немає</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="bg-white rounded-2xl border border-gray-border overflow-hidden text-left hover:border-primary hover:shadow-md transition-all"
            >
              {item.photos[0] ? (
                <div className="relative w-full h-40 bg-gray-light">
                  <ImageFallback
                    src={item.photos[0]}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <span
                    className={cn(
                      "absolute top-2.5 left-2.5 text-[11px] px-2.5 py-0.5 rounded-full font-semibold",
                      item.type === "lost"
                        ? "bg-red-500 text-white"
                        : "bg-green-accent text-white",
                    )}
                  >
                    {item.type === "lost" ? "Загублено" : "Знайдено"}
                  </span>
                </div>
              ) : (
                <div className="relative w-full h-24 bg-gray-light flex items-center justify-center">
                  <span className="text-3xl">
                    {item.type === "lost" ? "🔴" : "🟢"}
                  </span>
                </div>
              )}
              <div className="p-3.5">
                <h3 className="font-semibold text-sm mb-1 line-clamp-1">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-medium line-clamp-2 mb-2">
                  {item.description}
                </p>
                <div className="flex items-center gap-3 text-[11px] text-gray-400">
                  {item.location && (
                    <span className="flex items-center gap-1">
                      <IconMapPin size={11} />
                      {item.location}
                    </span>
                  )}
                  {item.animalType && (
                    <span className="flex items-center gap-1">
                      <IconPaw size={11} />
                      {item.animalType}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      <Dialog
        open={showForm}
        onOpenChange={(open) => {
          if (!open) {
            setShowForm(false);
            resetForm();
          } else setShowForm(true);
        }}
      >
        <DialogContent hideClose className="max-w-md p-0 overflow-hidden">
          <form onSubmit={handleSubmit}>
            <div className="bg-red-500 px-5 py-4 flex items-center justify-between sticky top-0 z-10">
              <div className="flex items-center gap-2 text-white">
                {editingId ? <IconEdit size={18} /> : <IconSearch size={18} />}
                <h3 className="font-semibold">
                  {editingId ? "Редагувати оголошення" : "Загубив тварину"}
                </h3>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="text-white/70 hover:text-white hover:bg-white/10"
              >
                <IconX size={20} />
              </Button>
            </div>

            <div className="p-5 space-y-3">
              <div>
                <p className="text-xs text-gray-medium mb-1.5">Фотографії</p>
                <div
                  onClick={() => fileRef.current?.click()}
                  className="border-2 border-dashed border-gray-border rounded-xl p-4 text-center cursor-pointer hover:border-red-300"
                >
                  <IconPhoto size={24} className="mx-auto text-gray-400 mb-1" />
                  <p className="text-xs font-medium">Натисніть або перетягніть</p>
                  {uploadMutation.isPending && (
                    <p className="text-[11px] text-red-400 mt-1">
                      Завантаження...
                    </p>
                  )}
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => e.target.files && handleFiles(e.target.files)}
                  className="hidden"
                />
                {formData.photos.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {formData.photos.map((url, i) => (
                      <div
                        key={i}
                        className="relative size-14 rounded-lg overflow-hidden group"
                      >
                        <Image
                          src={url}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              photos: formData.photos.filter((_, j) => j !== i),
                            })
                          }
                          className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 text-lg"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <p className="text-xs text-gray-medium mb-1.5">
                  Хто загубився? *
                </p>
                <Input
                  type="text"
                  placeholder="Наприклад: Рудий кіт Мурчик"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>

              <div>
                <p className="text-xs text-gray-medium mb-1.5">Вид</p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: "Собака", icon: "🐕" },
                    { value: "Кіт", icon: "🐈" },
                    { value: "Інше", icon: "🐾" },
                  ].map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          animalType: t.value,
                          breed: "",
                        })
                      }
                      className={cn(
                        "py-2 rounded-xl text-sm font-medium transition-all border",
                        formData.animalType === t.value
                          ? "bg-red-50 border-red-300 text-red-700"
                          : "bg-white border-gray-border hover:border-red-200",
                      )}
                    >
                      {t.icon} {t.value}
                    </button>
                  ))}
                </div>
              </div>

              {formData.animalType && formData.animalType !== "Інше" && (
                <div>
                  <p className="text-xs text-gray-medium mb-1.5">Порода</p>
                  <Popover open={breedOpen} onOpenChange={setBreedOpen}>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border text-sm text-left border-gray-border bg-gray-light"
                      >
                        <span>{formData.breed || "Оберіть породу"}</span>
                        <IconChevronDown size={14} />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent
                      align="start"
                      className="p-0 w-[var(--radix-popover-trigger-width)]"
                    >
                      <div className="p-2 border-b border-gray-border">
                        <Input
                          type="text"
                          size="sm"
                          placeholder="Пошук..."
                          value={breedSearch}
                          onChange={(e) => setBreedSearch(e.target.value)}
                          autoFocus
                        />
                      </div>
                      <div className="max-h-36 overflow-auto py-1">
                        {filteredBreeds.map((b) => (
                          <button
                            key={b}
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, breed: b });
                              setBreedSearch("");
                              setBreedOpen(false);
                            }}
                            className="w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-light"
                          >
                            {b}
                            {formData.breed === b && (
                              <IconCheck size={14} className="text-red-500" />
                            )}
                          </button>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              )}

              <div>
                <p className="text-xs text-gray-medium mb-1.5">Стать</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: "male", label: "Хлопчик" },
                    { value: "female", label: "Дівчинка" },
                  ].map((s) => (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, sex: s.value })}
                      className={cn(
                        "py-2 rounded-xl text-sm font-medium transition-all border",
                        formData.sex === s.value
                          ? "bg-red-50 border-red-300 text-red-700"
                          : "bg-white border-gray-border hover:border-red-200",
                      )}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-medium mb-1.5">Колір</p>
                <Popover open={colorOpen} onOpenChange={setColorOpen}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border text-sm text-left border-gray-border bg-gray-light"
                    >
                      <span>{formData.color || "Оберіть колір"}</span>
                      <IconChevronDown size={14} />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="p-1">
                    {colorOptions.map((c) => (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, color: c.value });
                          setColorOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-light"
                      >
                        <span
                          className="size-4 rounded-full border"
                          style={{ backgroundColor: c.color }}
                        />
                        {c.value}
                      </button>
                    ))}
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <p className="text-xs text-gray-medium mb-1.5">Розмір</p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: "small", label: "Малий" },
                    { value: "medium", label: "Середній" },
                    { value: "large", label: "Великий" },
                  ].map((s) => (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, size: s.value })
                      }
                      className={cn(
                        "py-2 rounded-xl text-sm font-medium transition-all border",
                        formData.size === s.value
                          ? "bg-red-50 border-red-300 text-red-700"
                          : "bg-white border-gray-border hover:border-red-200",
                      )}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-medium mb-1.5">
                  Де востаннє бачили? *
                </p>
                <InputWithIcon icon={<IconMapPin size={16} />}>
                  <Input
                    type="text"
                    placeholder="Адреса або район"
                    required
                    value={formData.lastSeenLocation || formData.location}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        lastSeenLocation: e.target.value,
                        location: e.target.value,
                      })
                    }
                  />
                </InputWithIcon>
              </div>

              <div>
                <p className="text-xs text-gray-medium mb-1.5">Коли?</p>
                <Input
                  type="date"
                  value={formData.lastSeenDate}
                  onChange={(e) =>
                    setFormData({ ...formData, lastSeenDate: e.target.value })
                  }
                />
              </div>

              <div>
                <p className="text-xs text-gray-medium mb-1.5">
                  Опис та прикмети *
                </p>
                <Textarea
                  placeholder="Зовнішність, нашийник, особливі прикмети..."
                  required
                  rows={2}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              <div className="pt-1 border-t border-gray-border">
                <p className="text-xs text-gray-medium mb-1.5 mt-2">
                  Ваші контакти *
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <InputWithIcon icon={<IconUser size={16} />}>
                    <Input
                      type="text"
                      placeholder="Ім'я"
                      required
                      value={formData.contactName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contactName: e.target.value,
                        })
                      }
                    />
                  </InputWithIcon>
                  <InputWithIcon icon={<IconPhone size={16} />}>
                    <Input
                      type="tel"
                      placeholder="Телефон"
                      required
                      value={formData.contactPhone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contactPhone: e.target.value,
                        })
                      }
                    />
                  </InputWithIcon>
                </div>
              </div>

              <Button
                type="submit"
                variant="destructive"
                disabled={submitting}
                className="w-full py-3 h-auto"
              >
                {submitting
                  ? "Збереження..."
                  : editingId
                    ? "Зберегти зміни"
                    : "Опублікувати оголошення"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!selectedItem}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedItem(null);
            setDetailPhoto(0);
          }
        }}
      >
        <DialogContent hideClose className="max-w-3xl p-0 overflow-hidden">
          {selectedItem && (
            <div className="md:flex">
              {selectedItem.photos.length > 0 && (
                <div className="md:w-1/2 p-5">
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-light">
                    <ImageFallback
                      src={selectedItem.photos[detailPhoto]!}
                      alt={selectedItem.title}
                      fill
                      className="object-cover"
                      sizes="400px"
                    />
                    {selectedItem.photos.length > 1 && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() =>
                            setDetailPhoto(
                              (p) =>
                                (p - 1 + selectedItem.photos.length) %
                                selectedItem.photos.length,
                            )
                          }
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80"
                        >
                          <IconChevronLeft size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() =>
                            setDetailPhoto(
                              (p) => (p + 1) % selectedItem.photos.length,
                            )
                          }
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80"
                        >
                          <IconChevronRight size={16} />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              )}

              <div
                className={cn(
                  "p-5",
                  selectedItem.photos.length > 0 ? "md:w-1/2" : "w-full",
                )}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h2 className="text-lg font-bold">{selectedItem.title}</h2>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => {
                      setSelectedItem(null);
                      setDetailPhoto(0);
                    }}
                  >
                    <IconX size={20} />
                  </Button>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-3">
                  {selectedItem.description}
                </p>

                <div className="flex gap-2 mb-4">
                  <Button
                    
                    variant="outline"
                    size="sm"
                    onClick={() => openEditForm(selectedItem)}
                  >
                    <IconEdit size={15} />
                    Редагувати
                  </Button>
                  {selectedItem.type === "lost" && (
                    <Button
                      
                      variant="success"
                      size="sm"
                      onClick={() => handleMarkFound(selectedItem)}
                    >
                      <IconCheck size={15} />
                      Знайдено
                    </Button>
                  )}
                </div>

                <div className="divide-y divide-gray-border mb-4">
                  {selectedItem.animalType && (
                    <div className="flex items-center gap-2.5 py-2">
                      <IconPaw size={15} className="text-gray-400" />
                      <span className="text-sm font-medium">Вид</span>
                      <span className="text-sm text-gray-medium ml-auto">
                        {selectedItem.animalType}
                      </span>
                    </div>
                  )}
                  {selectedItem.breed && (
                    <div className="flex items-center gap-2.5 py-2">
                      <IconTag size={15} className="text-gray-400" />
                      <span className="text-sm font-medium">Порода</span>
                      <span className="text-sm text-gray-medium ml-auto">
                        {selectedItem.breed}
                      </span>
                    </div>
                  )}
                  {selectedItem.sex && (
                    <div className="flex items-center gap-2.5 py-2">
                      <IconUser size={15} className="text-gray-400" />
                      <span className="text-sm font-medium">Стать</span>
                      <span className="text-sm text-gray-medium ml-auto">
                        {selectedItem.sex === "male" ? "Хлопчик" : "Дівчинка"}
                      </span>
                    </div>
                  )}
                  {selectedItem.color && (
                    <div className="flex items-center gap-2.5 py-2">
                      <IconPalette size={15} className="text-gray-400" />
                      <span className="text-sm font-medium">Колір</span>
                      <span className="text-sm text-gray-medium ml-auto">
                        {selectedItem.color}
                      </span>
                    </div>
                  )}
                  {selectedItem.size && (
                    <div className="flex items-center gap-2.5 py-2">
                      <IconPackage size={15} className="text-gray-400" />
                      <span className="text-sm font-medium">Розмір</span>
                      <span className="text-sm text-gray-medium ml-auto">
                        {selectedItem.size === "small"
                          ? "Малий"
                          : selectedItem.size === "medium"
                            ? "Середній"
                            : "Великий"}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2.5 py-2">
                    <IconCalendar size={15} className="text-gray-400" />
                    <span className="text-sm font-medium">Опубліковано</span>
                    <span className="text-sm text-gray-medium ml-auto">
                      {new Date(selectedItem.createdAt).toLocaleDateString(
                        "uk-UA",
                      )}
                    </span>
                  </div>
                </div>

                {(selectedItem.lastSeenLocation ||
                  selectedItem.lastSeenDate) && (
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-medium uppercase tracking-wider mb-2">
                      Востаннє бачили
                    </p>
                    <div className="bg-red-50 rounded-xl p-3 space-y-1.5">
                      {selectedItem.lastSeenLocation && (
                        <div className="flex items-center gap-2 text-sm">
                          <IconEye size={14} className="text-red-400" />
                          <span>{selectedItem.lastSeenLocation}</span>
                        </div>
                      )}
                      {selectedItem.lastSeenDate && (
                        <div className="flex items-center gap-2 text-sm">
                          <IconCalendar size={14} className="text-red-400" />
                          <span>
                            {new Date(
                              selectedItem.lastSeenDate,
                            ).toLocaleDateString("uk-UA")}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-xs font-semibold text-gray-medium uppercase tracking-wider mb-2">
                    Контакти
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5 text-sm">
                      <IconUser size={15} className="text-gray-400" />
                      <span className="font-medium">
                        {selectedItem.contactName}
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5 text-sm">
                      <IconPhone size={15} className="text-gray-400" />
                      <a
                        href={`tel:${selectedItem.contactPhone}`}
                        className="hover:underline"
                      >
                        {selectedItem.contactPhone}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
