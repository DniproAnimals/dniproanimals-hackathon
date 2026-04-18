"use client";
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTelegram,
  IconCirclePlus,
  IconMail,
  IconX,
} from "@dniproanimals/icons";
import {
  Button,
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
import { useState } from "react";
import { useAdoptionFormContext } from "../../hooks/useAdoptionForm";

type ContactKey = "email" | "instagram" | "telegram" | "facebook";

const ICON_MAP: Record<ContactKey, React.ReactNode> = {
  email: <IconMail size={16} />,
  instagram: <IconBrandInstagram size={16} />,
  telegram: <IconBrandTelegram size={16} />,
  facebook: <IconBrandFacebook size={16} />,
};

const TYPE_MAP: Record<ContactKey, string> = {
  email: "email",
  instagram: "text",
  telegram: "text",
  facebook: "text",
};

const PLACEHOLDER: Record<ContactKey, string> = {
  email: "Email",
  instagram: "Instagram",
  telegram: "Telegram",
  facebook: "Facebook",
};

const ALL: ContactKey[] = ["email", "instagram", "telegram", "facebook"];

export function AdoptionContactFieldsGroup() {
  const { control } = useAdoptionFormContext();
  const [visible, setVisible] = useState<ContactKey[]>(["email"]);
  const [addOpen, setAddOpen] = useState(false);

  return (
    <>
      {visible.map((key) => (
        <FormField
          key={key}
          control={control}
          name={key}
          render={({ field }) => (
            <FormItem className="relative animate-modal-in">
              <FormControl>
                <InputWithIcon icon={ICON_MAP[key]}>
                  <Input
                    type={TYPE_MAP[key]}
                    placeholder={PLACEHOLDER[key]}
                    className="pr-9"
                    {...field}
                  />
                </InputWithIcon>
              </FormControl>
              {key !== "email" && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setVisible(visible.filter((c) => c !== key))}
                  className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 hover:text-foreground"
                >
                  <IconX size={14} />
                </Button>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
      ))}

      {visible.length < ALL.length && (
        <Popover open={addOpen} onOpenChange={setAddOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1.5 text-[13px] text-gray-medium hover:text-foreground font-normal -ml-3"
            >
              <IconCirclePlus size={14} />
              Додати спосіб зв&apos;язку
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-48 p-1">
            {ALL.filter((t) => !visible.includes(t)).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  setVisible([...visible, t]);
                  setAddOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left hover:bg-gray-light rounded-lg transition-colors"
              >
                {t}
              </button>
            ))}
          </PopoverContent>
        </Popover>
      )}
    </>
  );
}
