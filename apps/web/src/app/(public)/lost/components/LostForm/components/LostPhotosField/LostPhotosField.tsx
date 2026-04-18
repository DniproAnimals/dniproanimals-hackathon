"use client";
import { useUploadImageMutation } from "@/shared/query-hooks";
import { IconPhoto } from "@dniproanimals/icons";
import { FormField, FormItem, FormLabel, FormMessage } from "@dniproanimals/ui";
import Image from "next/image";
import { useRef } from "react";
import { useLostFormContext } from "../../hooks/useLostForm";

export function LostPhotosField() {
  const { control } = useLostFormContext();
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
              className="border-2 border-dashed border-gray-border rounded-xl p-4 text-center cursor-pointer hover:border-red-300"
            >
              <IconPhoto size={24} className="mx-auto text-gray-400 mb-1" />
              <p className="text-xs font-medium">Натисніть або перетягніть</p>
              {uploadMutation.isPending && (
                <p className="text-[11px] text-red-400 mt-1">Завантаження...</p>
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
            {photos.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {photos.map((url, i) => (
                  <div
                    key={url}
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
                        field.onChange(photos.filter((_, j) => j !== i))
                      }
                      className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 text-lg"
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
