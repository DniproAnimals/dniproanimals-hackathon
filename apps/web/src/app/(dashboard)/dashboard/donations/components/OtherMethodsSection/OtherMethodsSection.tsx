import { Card } from "@dniproanimals/ui";
import { OtherMethodCard } from "./components/OtherMethodCard";

const OTHER_METHODS = ["PayPal", "Patreon", "Buy Me a Coffee"] as const;

export function OtherMethodsSection() {
  return (
    <Card className="p-6 mb-6">
      <h3 className="font-bold text-foreground mb-4">Інші способи допомоги</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {OTHER_METHODS.map((name) => (
          <OtherMethodCard key={name} name={name} />
        ))}
      </div>
    </Card>
  );
}
