"use client";
import ImageFallback from "@/shared/components/ImageFallback";
import {
  useCreateOrganizationMutation,
  useMeQuery,
  useUploadImageMutation,
} from "@/shared/query-hooks";
import { endpoints } from "@dniproanimals/endpoints";
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTelegram,
  IconChevronDown,
  IconChevronLeft,
  IconHomeFilled,
  IconMailFilled,
  IconMapPinFilled,
  IconPhoneFilled,
  IconPhoto,
  IconPlus,
  IconUserFilled,
  IconWorldWww,
  IconX,
} from "@dniproanimals/icons";
import {
  Button,
  cn,
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
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

const contactTypes = [
  { key: "instagram", label: "Instagram", icon: IconBrandInstagram },
  { key: "telegram", label: "Telegram", icon: IconBrandTelegram },
  { key: "facebook", label: "Facebook", icon: IconBrandFacebook },
  { key: "website", label: "Вебсайт", icon: IconWorldWww },
];

export default function OnboardingPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: user, isLoading: loading } = useMeQuery();
  const fileRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<"choose" | "org">("choose");
  const [visibleContacts, setVisibleContacts] = useState<string[]>([]);
  const [showContactPicker, setShowContactPicker] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    photo: "",
    location: "",
    phone: "",
    email: "",
    instagram: "",
    telegram: "",
    facebook: "",
    website: "",
  });

  const uploadMutation = useUploadImageMutation({
    onSuccess: ({ url }) => setForm((prev) => ({ ...prev, photo: url })),
  });
  const createOrgMutation = useCreateOrganizationMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [endpoints.auth.me()] });
      queryClient.invalidateQueries({
        queryKey: [endpoints.organizations.list()],
      });
      router.push("/dashboard");
    },
  });

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadMutation.mutateAsync(file);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleCreateOrg = (e: React.FormEvent) => {
    e.preventDefault();
    createOrgMutation.mutate(form);
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Skeleton className="size-10 rounded-full" />
      </div>
    );
  }

  if (!user) {
    router.replace("/auth");
    return null;
  }

  if (step === "choose") {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center mb-8">
            <Image
              src="/logo.jpg"
              alt="DniproAnimals"
              width={48}
              height={48}
              className="rounded-full object-cover mb-3"
            />
            <h1 className="text-xl font-bold text-foreground mb-1">
              Вітаємо, {user.name}!
            </h1>
            <p className="text-sm text-gray-medium text-center">
              Як ви плануєте використовувати платформу?
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => router.push("/")}
              className="w-full bg-white rounded-2xl border border-gray-border p-5 text-left hover:border-primary transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-xl bg-gray-light flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                  <IconUserFilled size={24} className="text-gray-medium" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    Особисте використання
                  </p>
                  <p className="text-xs text-gray-medium mt-0.5">
                    Шукати тварин, додавати в обране, допомагати
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => setStep("org")}
              className="w-full bg-white rounded-2xl border border-gray-border p-5 text-left hover:border-primary transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-xl bg-gray-light flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                  <IconHomeFilled size={24} className="text-gray-medium" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    Створити організацію
                  </p>
                  <p className="text-xs text-gray-medium mt-0.5">
                    Зареєструвати притулок або волонтерську організацію
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-6 pb-24 md:pb-6">
      <div className="flex items-center justify-between mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setStep("choose")}
          className="gap-1.5"
        >
          <IconChevronLeft size={18} />
          Назад
        </Button>
        <Image
          src="/logo.jpg"
          alt="DniproAnimals"
          width={36}
          height={36}
          className="rounded-full object-cover"
        />
        <div className="w-16" />
      </div>

      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-1">Створити організацію</h1>
        <p className="text-sm text-gray-medium">
          Зареєструйте свій притулок на платформі DniproAnimals
        </p>
      </div>

      <form onSubmit={handleCreateOrg} className="space-y-5">
        <div>
          <p className="text-xs text-gray-medium mb-2">Фото організації</p>
          {form.photo ? (
            <div className="relative w-full h-40 rounded-2xl overflow-hidden group">
              <ImageFallback
                src={form.photo}
                alt=""
                fill
                className="object-cover"
                sizes="100vw"
              />
              <button
                type="button"
                onClick={() => setForm({ ...form, photo: "" })}
                className="absolute top-2 right-2 size-7 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <IconX size={14} />
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileRef.current?.click()}
              className="w-full h-40 border-2 border-dashed border-gray-border rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
            >
              <IconPhoto size={32} className="text-gray-medium mb-2" />
              <p className="text-sm text-gray-medium font-medium">
                {uploadMutation.isPending
                  ? "Завантаження..."
                  : "Натисніть, щоб додати фото"}
              </p>
              <p className="text-xs text-gray-medium mt-0.5">
                JPG, PNG до 5 МБ
              </p>
            </div>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handlePhotoUpload}
            className="hidden"
          />
        </div>

        <div>
          <p className="text-xs text-gray-medium mb-1.5">Назва організації *</p>
          <Input
            type="text"
            placeholder="Наприклад: Притулок «Друг»"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div>
          <p className="text-xs text-gray-medium mb-1.5">Опис</p>
          <Textarea
            placeholder="Розкажіть про діяльність, місію та особливості..."
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <div>
          <p className="text-xs text-gray-medium mb-1.5">Місцезнаходження *</p>
          <InputWithIcon icon={<IconMapPinFilled />}>
            <Input
              type="text"
              placeholder="Місто / адреса"
              required
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
          </InputWithIcon>
        </div>

        <div>
          <p className="text-sm font-semibold text-gray-medium uppercase tracking-wider mb-3">
            Контакти
          </p>
          <div className="space-y-2.5">
            <InputWithIcon icon={<IconPhoneFilled />}>
              <Input
                type="tel"
                placeholder="Телефон *"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </InputWithIcon>
            <InputWithIcon icon={<IconMailFilled />}>
              <Input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </InputWithIcon>

            {visibleContacts.map((type) => {
              const ct = contactTypes.find((c) => c.key === type);
              if (!ct) return null;
              const Icon = ct.icon;
              return (
                <div key={type} className="animate-modal-in">
                  <InputWithIcon icon={<Icon />}>
                    <div className="relative">
                      <Input
                        type={type === "website" ? "url" : "text"}
                        placeholder={ct.label}
                        value={form[type as keyof typeof form]}
                        onChange={(e) =>
                          setForm({ ...form, [type]: e.target.value })
                        }
                        className="pr-9"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setVisibleContacts(
                            visibleContacts.filter((c) => c !== type),
                          )
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-medium hover:text-foreground"
                      >
                        <IconX size={14} />
                      </button>
                    </div>
                  </InputWithIcon>
                </div>
              );
            })}

            {visibleContacts.length < contactTypes.length && (
              <Popover
                open={showContactPicker}
                onOpenChange={setShowContactPicker}
              >
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="flex items-center gap-1.5 text-[13px] text-gray-medium hover:text-foreground transition-colors py-1"
                  >
                    <IconPlus size={14} />
                    Додати спосіб зв&apos;язку
                    <IconChevronDown
                      size={12}
                      className={cn(
                        "transition-transform",
                        showContactPicker && "rotate-180",
                      )}
                    />
                  </button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-52 p-1">
                  {contactTypes
                    .filter((ct) => !visibleContacts.includes(ct.key))
                    .map((ct) => {
                      const Icon = ct.icon;
                      return (
                        <button
                          key={ct.key}
                          type="button"
                          onClick={() => {
                            setVisibleContacts([...visibleContacts, ct.key]);
                            setShowContactPicker(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-left hover:bg-gray-light rounded-lg transition-colors"
                        >
                          <Icon size={16} className="text-gray-medium" />
                          {ct.label}
                        </button>
                      );
                    })}
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={createOrgMutation.isPending}
          className="w-full"
        >
          {createOrgMutation.isPending
            ? "Створення..."
            : "Створити організацію"}
        </Button>

        <p className="text-xs text-gray-medium text-center">
          Після створення організація потрапить на модерацію
        </p>
      </form>
    </div>
  );
}
