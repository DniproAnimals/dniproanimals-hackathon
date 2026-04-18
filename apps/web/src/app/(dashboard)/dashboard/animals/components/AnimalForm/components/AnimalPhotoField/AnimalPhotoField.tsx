"use client";
import { useUploadImageMutation } from "@/shared/query-hooks";
import { IconPhoto } from "@dniproanimals/icons";
import { FormField, FormItem, FormLabel, FormMessage } from "@dniproanimals/ui";
import Image from "next/image";
import { useRef } from "react";
import { useAnimalFormContext } from "../../hooks/useAnimalForm";

export function AnimalPhotoField() {
  const { control } = useAnimalFormContext();
  const fileRef = useRef<HTMLInputElement>(null);
  const uploadMutation = useUploadImageMutation();

  return (
    <FormField
      control={control}
      name="photos"
      render={({ field }) => {
        const photos = field.value;
        const handleFiles = async (files: FileList) => {
          const uploads = await Promise.all(
            Array.from(files).map((f) => uploadMutation.mutateAsync(f)),
          );
          field.onChange([...photos, ...uploads.map((u) => u.url)]);
          if (fileRef.current) fileRef.current.value = "";
        };
        return (
          <FormItem>
            <FormLabel>Фотографії</FormLabel>
            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-gray-border rounded-2xl p-6 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
            >
              <IconPhoto size={28} className="mx-auto text-gray-medium mb-2" />
              <p className="text-sm font-medium">Натисніть або перетягніть</p>
              {uploadMutation.isPending && (
                <p className="text-xs text-primary mt-1">Завантаження...</p>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              multiple
              onChange={(e) => e.target.files && handleFiles(e.target.files)}
              className="hidden"
            />
            {photos.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {photos.map((url, i) => (
                  <div
                    key={url}
                    className="relative size-16 rounded-lg overflow-hidden group"
                  >
                    <Image
                      src={url}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        field.onChange(photos.filter((_, j) => j !== i))
                      }
                      className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
