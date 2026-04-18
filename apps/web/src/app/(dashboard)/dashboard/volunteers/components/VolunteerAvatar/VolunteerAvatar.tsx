import ImageFallback from "@/shared/components/ImageFallback";
import type { Volunteer } from "@dniproanimals/contracts";
import { cn } from "@dniproanimals/ui";

const SIZE_CLS = {
  sm: "size-14 text-base",
  lg: "size-20 text-xl border-4 border-white shadow-sm",
} as const;

export function VolunteerAvatar({
  volunteer,
  size = "sm",
}: {
  volunteer: Pick<Volunteer, "name" | "surname" | "photo" | "userId">;
  size?: "sm" | "lg";
}) {
  const sizeCls = SIZE_CLS[size];
  const initials = `${volunteer.name.charAt(0)}${
    volunteer.surname ? volunteer.surname.charAt(0) : ""
  }`;

  return (
    <div
      className={cn(
        "rounded-2xl overflow-hidden shrink-0 bg-muted relative",
        sizeCls,
      )}
    >
      {volunteer.photo ? (
        <ImageFallback
          src={volunteer.photo}
          alt={volunteer.name}
          fill
          className="object-cover"
          sizes={size === "lg" ? "80px" : "56px"}
        />
      ) : (
        <div
          className={cn(
            "w-full h-full flex items-center justify-center font-bold",
            volunteer.userId
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700",
          )}
        >
          {initials}
        </div>
      )}
    </div>
  );
}
