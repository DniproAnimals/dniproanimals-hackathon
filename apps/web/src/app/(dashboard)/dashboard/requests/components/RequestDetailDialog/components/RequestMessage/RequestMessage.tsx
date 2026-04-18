import { IconMessageFilled } from "@dniproanimals/icons";

interface RequestMessageProps {
  message: string | null;
}

export function RequestMessage({ message }: RequestMessageProps) {
  if (!message) return null;
  return (
    <div className="mb-5">
      <p className="text-xs font-semibold text-gray-medium uppercase tracking-wider mb-2">
        Повідомлення
      </p>
      <div className="bg-gray-light rounded-xl p-4 flex gap-2.5">
        <IconMessageFilled size={16} className="text-gray-medium" />
        <p className="text-sm text-foreground leading-relaxed">{message}</p>
      </div>
    </div>
  );
}
