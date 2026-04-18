import { Button } from "@dniproanimals/ui";
import Link from "next/link";

interface InvalidInviteProps {
  message?: string;
}

export function InvalidInvite({ message }: InvalidInviteProps) {
  return (
    <div className="text-center">
      <p className="text-destructive mb-4">
        {message || "Запрошення недійсне"}
      </p>
      <Button asChild variant="ghost" size="sm">
        <Link href="/">На головну</Link>
      </Button>
    </div>
  );
}
