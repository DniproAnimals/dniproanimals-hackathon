"use client";
import { ImageFallback } from "@/shared/components/ImageFallback";
import { useUploadImageMutation } from "@/shared/query-hooks";
import { IconPhoto, IconX } from "@dniproanimals/icons";
import { FormField, FormItem, FormLabel, FormMessage } from "@dniproanimals/ui";
import { useRef } from "react";
import { useOrganizationFormContext } from "../../hooks/useOrganizationForm";

export function OrganizationPhotoField() {
  const { control } = useOrganizationFormContext();
  const fileRef = useRef<HTMLInputElement>(null);
  const uploadMutation = useUploadImageMutation();

  return (
    <FormField
      control={control}
      name="photo"
      render={({ field }) => {
        const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
          const file = e.target.files?.[0];
          if (!file) return;
          const { url } = await uploadMutation.mutateAsync(file);
          field.onChange(url);
          if (fileRef.current) fileRef.current.value = "";
        };
        return (
          <FormItem>
            <FormLabel>Фото організації</FormLabel>
            {field.value ? (
              <div className="relative w-full h-40 rounded-2xl overflow-hidden group">
                <ImageFallback
                  src={field.value}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="100vw"
                />
                <button
                  type="button"
                  onClick={() => field.onChange("")}
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
              onChange={handleUpload}
              className="hidden"
            />
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
