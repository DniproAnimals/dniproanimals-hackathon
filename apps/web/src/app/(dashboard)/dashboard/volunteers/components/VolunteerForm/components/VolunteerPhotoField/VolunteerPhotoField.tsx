"use client";
import ImageFallback from "@/shared/components/ImageFallback";
import { useUploadImageMutation } from "@/shared/query-hooks";
import { IconPhoto } from "@dniproanimals/icons";
import { FormField, FormItem, FormMessage } from "@dniproanimals/ui";
import { useRef } from "react";
import { useVolunteerFormContext } from "../../hooks/useVolunteerForm";

export function VolunteerPhotoField() {
  const { control } = useVolunteerFormContext();
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
            <div className="flex items-center gap-4">
              <div className="size-16 rounded-xl overflow-hidden shrink-0 bg-muted relative">
                {field.value ? (
                  <ImageFallback
                    src={field.value}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-medium">
                    <IconPhoto size={24} />
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="text-sm font-medium text-green-secondary hover:underline"
              >
                {uploadMutation.isPending
                  ? "Завантаження..."
                  : field.value
                    ? "Змінити фото"
                    : "Додати фото"}
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleUpload}
                className="hidden"
              />
            </div>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
