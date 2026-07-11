import type { ContractTemplateResponse } from "../modules/contract-templates";

type Props = {
  contract: ContractTemplateResponse;
};

export function ContractDocumentView({ contract }: Props) {
  return (
    <article className="rounded-xl border border-border bg-card p-6 md:p-10 text-card-foreground shadow-sm">
      <header className="mb-8 border-b border-border pb-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          Зразок документа
        </p>

        <h1 className="text-2xl md:text-3xl font-bold leading-tight">
          {contract.title}
        </h1>

        {contract.subtitle && (
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            {contract.subtitle}
          </p>
        )}

        <p className="mt-4 text-sm font-medium">
          {contract.content.datePlaceholder}
        </p>
      </header>

      <section className="mb-8 space-y-3 text-sm leading-relaxed">
        <p>
          <span className="font-semibold">Притулок:</span>{" "}
          {contract.content.parties.shelter}
        </p>

        <p>
          <span className="font-semibold">Нова сім&apos;я:</span>{" "}
          {contract.content.parties.adopter}
        </p>

        <p className="text-muted-foreground">
          Разом іменовані «Сторони», уклали цей договір про таке:
        </p>
      </section>

      {contract.content.sections.map((section) => (
        <section key={section.title} className="mb-6">
          <h2 className="text-base font-bold mb-3">{section.title}</h2>

          <div className="space-y-2 text-sm leading-relaxed text-foreground/90">
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>
      ))}

      <footer className="mt-10 pt-6 border-t border-border grid gap-8 sm:grid-cols-2">
        {contract.content.signatures.map(({ role, line }) => (
          <div key={role}>
            <p className="text-sm font-semibold mb-6">{role}</p>

            <p className="text-sm text-muted-foreground">{line}</p>

            <p className="text-xs text-muted-foreground mt-2">(підпис / ПІБ)</p>
          </div>
        ))}
      </footer>
    </article>
  );
}
