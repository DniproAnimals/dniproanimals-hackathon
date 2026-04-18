import { Badge } from "@dniproanimals/ui";

interface OtherMethodCardProps {
  name: string;
}

export function OtherMethodCard({ name }: OtherMethodCardProps) {
  return (
    <div className="relative rounded-2xl p-4 border border-gray-border opacity-60">
      <p className="font-bold text-sm">{name}</p>
      <Badge variant="soft" size="sm" className="mt-1 uppercase">
        Soon
      </Badge>
    </div>
  );
}
