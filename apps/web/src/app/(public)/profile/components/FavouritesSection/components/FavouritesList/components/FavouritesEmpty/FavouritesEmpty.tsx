import { IconHeartFilled } from "@dniproanimals/icons";
import { EmptyState } from "@dniproanimals/ui";
import Link from "next/link";

export function FavouritesEmpty() {
  return (
    <EmptyState
      icon={<IconHeartFilled />}
      description="Ви ще не додали тварин до обраного"
      action={
        <Link
          href="/"
          className="text-sm font-medium text-foreground hover:underline"
        >
          Переглянути каталог →
        </Link>
      }
    />
  );
}
