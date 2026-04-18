"use client";
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTelegram,
  IconChevronDown,
  IconMailFilled,
  IconPhoneFilled,
  IconPlus,
  IconWorldWww,
  IconX,
} from "@dniproanimals/icons";
import {
  cn,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Input,
  InputWithIcon,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@dniproanimals/ui";
import { useMemo, useState } from "react";
import { useOrganizationFormContext } from "../../hooks/useOrganizationForm";
import { CONTACT_TYPES, type ContactType } from "../../schema";

const CONTACT_META: Record<
  ContactType,
  { label: string; icon: typeof IconBrandInstagram }
> = {
  instagram: { label: "Instagram", icon: IconBrandInstagram },
  telegram: { label: "Telegram", icon: IconBrandTelegram },
  facebook: { label: "Facebook", icon: IconBrandFacebook },
  website: { label: "Вебсайт", icon: IconWorldWww },
};

export function OrganizationContactsFields() {
  const { control, getValues, setValue } = useOrganizationFormContext();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [visibleContacts, setVisibleContacts] = useState<ContactType[]>(() =>
    CONTACT_TYPES.filter((t) => !!getValues(t)),
  );

  const hidden = useMemo(
    () => CONTACT_TYPES.filter((t) => !visibleContacts.includes(t)),
    [visibleContacts],
  );

  return (
    <div>
      <p className="text-sm font-semibold text-gray-medium uppercase tracking-wider mb-3">
        Контакти
      </p>
      <div className="space-y-2.5">
        <FormField
          control={control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <InputWithIcon icon={<IconPhoneFilled />}>
                  <Input type="tel" placeholder="Телефон" {...field} />
                </InputWithIcon>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <InputWithIcon icon={<IconMailFilled />}>
                  <Input type="email" placeholder="Email" {...field} />
                </InputWithIcon>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {visibleContacts.map((type) => {
          const meta = CONTACT_META[type];
          const Icon = meta.icon;
          return (
            <FormField
              key={type}
              control={control}
              name={type}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputWithIcon icon={<Icon />}>
                      <div className="relative">
                        <Input
                          type={type === "website" ? "url" : "text"}
                          placeholder={meta.label}
                          {...field}
                          className="pr-9"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setVisibleContacts((prev) =>
                              prev.filter((c) => c !== type),
                            );
                            setValue(type, "");
                          }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-medium hover:text-foreground"
                        >
                          <IconX size={14} />
                        </button>
                      </div>
                    </InputWithIcon>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          );
        })}

        {hidden.length > 0 && (
          <Popover open={pickerOpen} onOpenChange={setPickerOpen}>
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
                    pickerOpen && "rotate-180",
                  )}
                />
              </button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-52 p-1">
              {hidden.map((type) => {
                const meta = CONTACT_META[type];
                const Icon = meta.icon;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      setVisibleContacts((prev) => [...prev, type]);
                      setPickerOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-left hover:bg-gray-light rounded-lg transition-colors"
                  >
                    <Icon size={16} className="text-gray-medium" />
                    {meta.label}
                  </button>
                );
              })}
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  );
}
