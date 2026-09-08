"use client";

import {
  useBankDetailsQuery,
  useFoundationQuery,
  useUpdateBankDetailsMutation,
  useUpdateFoundationMutation,
} from "@/shared/query-hooks";
import type {
  BankDetails,
  UpdateBankDetailsBody,
  UpdateFoundationBody,
} from "@dniproanimals/contracts";
import {
  IconCreditCard,
  IconPencil,
  IconPlus,
  IconTrash,
} from "@dniproanimals/icons";
import { Button, Card, Input, Label } from "@dniproanimals/ui";
import { useEffect, useState, type ReactNode } from "react";

type EditableBankDetails = Omit<BankDetails, "id" | "updatedAt">;
type DonationLinks = Pick<
  UpdateFoundationBody,
  "monobankJarUrl" | "paypalEmail" | "patreonUrl" | "buyMeACoffeeUrl"
>;

type CardKey = "direct" | "foreign" | "correspondent";

const DEFAULT_DIRECT_COLOR = "#5b7765";
const DEFAULT_FOREIGN_COLOR = "#5b7765";
const DEFAULT_CORRESPONDENT_COLOR = "#7c4b22";

const createEmptyCorrespondentBank = () => ({
  account: "",
  swiftCode: "",
  bankName: "Новий банк",
  color: DEFAULT_CORRESPONDENT_COLOR,
});

export default function DonationsPage() {
  const { data: foundation, isLoading: isFoundationLoading } =
    useFoundationQuery();
  const { data: bankDetails, isLoading: isBankDetailsLoading } =
    useBankDetailsQuery();
  const updateFoundationMutation = useUpdateFoundationMutation();
  const updateBankDetailsMutation = useUpdateBankDetailsMutation();
  const [draft, setDraft] = useState<EditableBankDetails | null>(null);
  const [links, setLinks] = useState<DonationLinks | null>(null);
  const [editingCard, setEditingCard] = useState<CardKey | null>(null);

  useEffect(() => {
    if (foundation) {
      // The query is asynchronous; keep the editable draft aligned with the loaded record.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLinks({
        monobankJarUrl: foundation.monobankJarUrl,
        paypalEmail: foundation.paypalEmail,
        patreonUrl: foundation.patreonUrl,
        buyMeACoffeeUrl: foundation.buyMeACoffeeUrl,
      });
    }
  }, [foundation]);

  useEffect(() => {
    if (!bankDetails) return;
    // The query is asynchronous; keep the editable draft aligned with the loaded record.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDraft({
      directBankDetails: {
        ...bankDetails.directBankDetails,
        color: bankDetails.directBankDetails.color || DEFAULT_DIRECT_COLOR,
      },
      foreignCurrencyAccount: {
        ...bankDetails.foreignCurrencyAccount,
        color:
          bankDetails.foreignCurrencyAccount.color || DEFAULT_FOREIGN_COLOR,
      },
      correspondentBanks: bankDetails.correspondentBanks.map((bank) => ({
        ...bank,
        color: bank.color || DEFAULT_CORRESPONDENT_COLOR,
      })),
    });
  }, [bankDetails]);

  const updateDraft = <K extends keyof EditableBankDetails>(
    section: K,
    field: string,
    value: string,
    index?: number,
  ) => {
    setDraft((current) => {
      if (!current) return current;
      if (section === "correspondentBanks" && index !== undefined) {
        return {
          ...current,
          correspondentBanks: current.correspondentBanks.map(
            (bank, bankIndex) =>
              bankIndex === index ? { ...bank, [field]: value } : bank,
          ),
        };
      }
      return {
        ...current,
        [section]: { ...current[section], [field]: value },
      } as EditableBankDetails;
    });
  };

  const saveAll = () => {
    if (!draft || !foundation || !links) return;
    const foundationValues: UpdateFoundationBody = {
      name: foundation.name,
      description: foundation.description,
      address: foundation.address,
      phone: foundation.phone,
      email: foundation.email,
      instagram: foundation.instagram,
      telegram: foundation.telegram,
      facebook: foundation.facebook,
      tiktokUrl: foundation.tiktokUrl,
      monobankCardNumber: foundation.monobankCardNumber,
      privatBankCardNumber: foundation.privatBankCardNumber,
      ...links,
    };
    updateFoundationMutation.mutate(foundationValues);
    updateBankDetailsMutation.mutate(draft as UpdateBankDetailsBody);
  };

  const addCorrespondentBank = () => {
    setDraft((current) =>
      current
        ? {
            ...current,
            correspondentBanks: [
              ...current.correspondentBanks,
              createEmptyCorrespondentBank(),
            ],
          }
        : current,
    );
  };

  const removeCorrespondentBank = (index: number) => {
    setDraft((current) =>
      current
        ? {
            ...current,
            correspondentBanks: current.correspondentBanks.filter(
              (_, bankIndex) => bankIndex !== index,
            ),
          }
        : current,
    );
  };

  if (
    isFoundationLoading ||
    isBankDetailsLoading ||
    !draft ||
    !foundation ||
    !links
  ) {
    return <div>Завантаження...</div>;
  }

  const isSaving =
    updateFoundationMutation.isPending || updateBankDetailsMutation.isPending;

  const updateLink = (field: keyof DonationLinks, value: string) => {
    setLinks((current) => (current ? { ...current, [field]: value } : current));
  };

  return (
    <div className="max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Пожертви</h1>
        <p className="mt-1 text-sm text-gray-medium">
          Редагуйте реквізити в тому самому вигляді, у якому їх бачать на сайті.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <BankCard
          title={draft.directBankDetails.title}
          color={draft.directBankDetails.color || DEFAULT_DIRECT_COLOR}
          isEditing={editingCard === "direct"}
          onEdit={() =>
            setEditingCard(editingCard === "direct" ? null : "direct")
          }
          onTitleChange={(value) =>
            updateDraft("directBankDetails", "title", value)
          }
          onColorChange={(value) =>
            updateDraft("directBankDetails", "color", value)
          }
        >
          <EditableField
            label="Отримувач"
            value={draft.directBankDetails.recipientName}
            onChange={(value) =>
              updateDraft("directBankDetails", "recipientName", value)
            }
          />
          <EditableField
            label="Код отримувача"
            value={draft.directBankDetails.recipientCode}
            onChange={(value) =>
              updateDraft("directBankDetails", "recipientCode", value)
            }
          />
          <EditableField
            label={draft.directBankDetails.bankName}
            value={draft.directBankDetails.recipientAccount}
            onChange={(value) =>
              updateDraft("directBankDetails", "recipientAccount", value)
            }
          />
          <EditableField
            label="Призначення платежу"
            value={draft.directBankDetails.paymentPurpose}
            onChange={(value) =>
              updateDraft("directBankDetails", "paymentPurpose", value)
            }
          />
          <EditableField
            label="Назва банку"
            value={draft.directBankDetails.bankName}
            onChange={(value) =>
              updateDraft("directBankDetails", "bankName", value)
            }
          />
        </BankCard>

        <BankCard
          title={draft.foreignCurrencyAccount.title}
          color={draft.foreignCurrencyAccount.color || DEFAULT_FOREIGN_COLOR}
          isEditing={editingCard === "foreign"}
          onEdit={() =>
            setEditingCard(editingCard === "foreign" ? null : "foreign")
          }
          onTitleChange={(value) =>
            updateDraft("foreignCurrencyAccount", "title", value)
          }
          onColorChange={(value) =>
            updateDraft("foreignCurrencyAccount", "color", value)
          }
        >
          <EditableField
            label="Отримувач"
            value={draft.foreignCurrencyAccount.companyName}
            onChange={(value) =>
              updateDraft("foreignCurrencyAccount", "companyName", value)
            }
          />
          <EditableField
            label="IBAN"
            value={draft.foreignCurrencyAccount.iban}
            onChange={(value) =>
              updateDraft("foreignCurrencyAccount", "iban", value)
            }
          />
          <EditableField
            label="Банк"
            value={draft.foreignCurrencyAccount.bankName}
            onChange={(value) =>
              updateDraft("foreignCurrencyAccount", "bankName", value)
            }
          />
          <EditableField
            label="SWIFT"
            value={draft.foreignCurrencyAccount.bankSwiftCode}
            onChange={(value) =>
              updateDraft("foreignCurrencyAccount", "bankSwiftCode", value)
            }
          />
          <EditableField
            label="Адреса"
            value={draft.foreignCurrencyAccount.companyAddress}
            onChange={(value) =>
              updateDraft("foreignCurrencyAccount", "companyAddress", value)
            }
          />
        </BankCard>
      </div>

      <Card
        className="relative overflow-hidden rounded-3xl border-gray-100 p-8 shadow-sm"
        style={{ borderTop: `6px solid ${DEFAULT_CORRESPONDENT_COLOR}` }}
      >
        <div className="mb-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <IconCreditCard size={24} />
            <h2 className="text-xl font-bold">Банки-кореспонденти</h2>
          </div>
          <IconButton
            label="Додати банк-кореспондент"
            onClick={addCorrespondentBank}
          >
            <IconPlus size={18} />
          </IconButton>
        </div>
        <div className="flex flex-wrap gap-4">
          {draft.correspondentBanks.map((bank, index) => (
            <Card
              key={`${bank.bankName}-${index}`}
              className="min-w-[min(100%,20rem)] flex-1 rounded-2xl border-gray-100 p-4"
              style={{
                borderTop: `4px solid ${bank.color || DEFAULT_CORRESPONDENT_COLOR}`,
              }}
            >
              <div className="mb-3 flex items-center justify-between">
                <strong>{bank.bankName}</strong>
                <IconButton
                  label={`Редагувати колір банку ${bank.bankName}`}
                  onClick={() =>
                    setEditingCard(
                      editingCard === "correspondent" ? null : "correspondent",
                    )
                  }
                />
                <IconButton
                  label={`Видалити банк ${bank.bankName}`}
                  onClick={() => removeCorrespondentBank(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <IconTrash size={17} />
                </IconButton>
              </div>
              <EditableField
                label="Банк"
                value={bank.bankName}
                onChange={(value) =>
                  updateDraft("correspondentBanks", "bankName", value, index)
                }
              />
              <EditableField
                label="Рахунок"
                value={bank.account}
                onChange={(value) =>
                  updateDraft("correspondentBanks", "account", value, index)
                }
              />
              <EditableField
                label="SWIFT"
                value={bank.swiftCode}
                onChange={(value) =>
                  updateDraft("correspondentBanks", "swiftCode", value, index)
                }
              />
              {editingCard === "correspondent" && (
                <div className="mt-3 flex items-center gap-2">
                  <Label className="text-xs">Колір</Label>
                  <Input
                    type="color"
                    value={bank.color || DEFAULT_CORRESPONDENT_COLOR}
                    onChange={(event) =>
                      updateDraft(
                        "correspondentBanks",
                        "color",
                        event.target.value,
                        index,
                      )
                    }
                    className="h-8 w-12 p-1"
                    aria-label={`Колір банку ${bank.bankName}`}
                  />
                </div>
              )}
            </Card>
          ))}
        </div>
      </Card>

      <div className="flex justify-end">
        <Button
          type="button"
          variant="primary"
          size="lg"
          disabled={isSaving}
          onClick={saveAll}
        >
          {isSaving ? "Збереження..." : "Зберегти зміни"}
        </Button>
      </div>
    </div>
  );
}

function BankCard({
  title,
  color,
  isEditing,
  onEdit,
  onTitleChange,
  onColorChange,
  children,
}: {
  title: string;
  color: string;
  isEditing: boolean;
  onEdit: () => void;
  onTitleChange: (value: string) => void;
  onColorChange: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <Card
      className="relative rounded-3xl border-gray-100 p-8 shadow-sm"
      style={{ borderTop: `6px solid ${color}` }}
    >
      <div className="mb-6 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <IconCreditCard size={24} />
          {isEditing ? (
            <div className="flex min-w-0 items-center gap-2">
              <Input
                value={title}
                onChange={(event) => onTitleChange(event.target.value)}
                className="h-9"
                aria-label="Назва картки"
              />
              <Input
                type="color"
                value={color}
                onChange={(event) => onColorChange(event.target.value)}
                className="h-9 w-14 p-1"
                aria-label="Колір картки"
              />
            </div>
          ) : (
            <h2 className="truncate text-xl font-bold">{title}</h2>
          )}
        </div>
        <IconButton label="Редагувати назву та колір" onClick={onEdit} />
      </div>
      <div className="flex flex-col gap-3">{children}</div>
    </Card>
  );
}

function EditableField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="rounded-2xl bg-gray-50 p-3">
      <Label className="text-xs font-bold uppercase text-gray-500">
        {label}
      </Label>
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 border-0 bg-transparent p-0 font-mono font-bold shadow-none focus-visible:ring-0"
      />
    </div>
  );
}

function LinkField({
  label,
  value,
  icon,
  onChange,
}: {
  label: string;
  value: string;
  icon?: ReactNode;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <Label className="mb-2 flex items-center gap-2">
        {icon}
        {label}
      </Label>
      <Input value={value} onChange={(event) => onChange(event.target.value)} />
    </div>
  );
}

function IconButton({
  label,
  onClick,
  children = <IconPencil size={17} />,
  className,
}: {
  label: string;
  onClick: () => void;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className={className}
      aria-label={label}
      title={label}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}
