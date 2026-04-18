import { IconCheck } from "@dniproanimals/icons";
import { Button } from "@dniproanimals/ui";

interface JarSaveActionProps {
  submitting: boolean;
  saved: boolean;
}

export function JarSaveAction({ submitting, saved }: JarSaveActionProps) {
  return (
    <div className="flex items-center gap-3">
      <Button type="submit" variant="primary" size="lg" disabled={submitting}>
        {submitting ? "Збереження..." : "Зберегти"}
      </Button>
      {saved && (
        <span className="flex items-center gap-1 text-sm text-green-600">
          <IconCheck size={16} />
          Збережено!
        </span>
      )}
    </div>
  );
}
