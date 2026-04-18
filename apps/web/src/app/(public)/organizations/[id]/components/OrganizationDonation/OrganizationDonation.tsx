import type { Organization } from "@dniproanimals/contracts";
import { IconHeartHandshake } from "@dniproanimals/icons";
import { Button, Card } from "@dniproanimals/ui";

interface OrganizationDonationProps {
  organization: Organization;
}

const PRESET_AMOUNTS = [100, 250, 500] as const;

export function OrganizationDonation({
  organization,
}: OrganizationDonationProps) {
  if (!organization.monobankJarId) return null;

  return (
    <Card className="mb-10 p-6 rounded-3xl bg-linear-to-br from-green-light to-[#e8ebd4] border-primary/40 relative overflow-hidden">
      <div className="absolute top-0 right-0 size-40 bg-primary rounded-full opacity-10 -translate-y-1/2 translate-x-1/2 blur-[60px]" />
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="size-10 rounded-2xl bg-green-secondary flex items-center justify-center">
            <IconHeartHandshake size={22} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">
              Допомогти організації
            </h2>
            <p className="text-xs text-green-secondary">
              Кожна гривня рятує життя тварин
            </p>
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Ви можете підтримати <b>{organization.name}</b> фінансово через
          Monobank банку. Кошти йдуть на корм, ліки та утримання тварин.
        </p>
        <div className="flex flex-wrap gap-3">
          {PRESET_AMOUNTS.map((sum) => (
            <Button
              key={sum}
              variant="outline"
              size="lg"
              asChild
              className="border-2 border-primary text-green-secondary font-bold hover:bg-primary hover:text-primary-foreground"
            >
              <a
                href={`https://send.monobank.ua/jar/${organization.monobankJarId}?amount=${sum}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {sum} ₴
              </a>
            </Button>
          ))}
          <Button variant="secondary" size="lg" asChild className="font-bold">
            <a
              href={`https://send.monobank.ua/jar/${organization.monobankJarId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Інша сума
            </a>
          </Button>
        </div>
      </div>
    </Card>
  );
}
