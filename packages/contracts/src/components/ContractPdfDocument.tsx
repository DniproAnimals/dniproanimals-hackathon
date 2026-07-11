import type { ContractTemplateResponse } from "../modules/contract-templates";

type Props = {
  contract: ContractTemplateResponse;
};

export function ContractPdfDocument({ contract }: Props) {
  return (
    <>
      <header>
        <div className="label">Зразок документа</div>

        <h1>{contract.title}</h1>

        {contract.subtitle && <p className="subtitle">{contract.subtitle}</p>}

        <p className="date">{contract.content.datePlaceholder}</p>
      </header>

      <section>
        <p>
          <strong>Притулок:</strong> {contract.content.parties.shelter}
        </p>

        <p>
          <strong>Нова сім'я:</strong> {contract.content.parties.adopter}
        </p>

        <p>Разом іменовані «Сторони», уклали цей договір про таке:</p>
      </section>

      {contract.content.sections.map((section) => (
        <section key={section.title}>
          <h2>{section.title}</h2>

          {section.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </section>
      ))}

      <footer>
        {contract.content.signatures.map((signature) => (
          <div key={signature.role} style={{ marginTop: "40px" }}>
            <strong>{signature.role}</strong>

            <p>{signature.line}</p>

            <small>(підпис / ПІБ)</small>
          </div>
        ))}
      </footer>
    </>
  );
}
