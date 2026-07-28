import "server-only";

import {
  CONTRACT_DATE_PLACEHOLDER,
  CONTRACT_PARTIES,
  CONTRACT_SECTIONS,
  CONTRACT_SIGNATURES,
  CONTRACT_SUBTITLE,
  CONTRACT_TITLE,
} from "../constants/contract-content";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderParagraphs(paragraphs: string[]): string {
  return paragraphs
    .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
    .join("");
}

function renderContractArticle(): string {
  const sections = CONTRACT_SECTIONS.map(
    (section) => `
      <section>
        <h2>${escapeHtml(section.title)}</h2>
        <div>
          ${renderParagraphs(section.paragraphs)}
        </div>
      </section>`,
  ).join("");

  const signatures = CONTRACT_SIGNATURES.map(
    ({ role, line }) => `
      <div>
        <p>${escapeHtml(role)}</p>
        <p>${escapeHtml(line)}</p>
        <p>(підпис / ПІБ)</p>
      </div>`,
  ).join("");

  return `
    <article>
      <header>
        <p>Зразок документа</p>
        <h1>${escapeHtml(CONTRACT_TITLE)}</h1>
        <p>${escapeHtml(CONTRACT_SUBTITLE)}</p>
        <p>${escapeHtml(CONTRACT_DATE_PLACEHOLDER)}</p>
      </header>

      <section>
        <p><strong>Притулок:</strong> ${escapeHtml(CONTRACT_PARTIES.shelter)}</p>
        <p><strong>Нова сім&apos;я:</strong> ${escapeHtml(CONTRACT_PARTIES.adopter)}</p>
        <p>Разом іменовані «Сторони», уклали цей договір про таке:</p>
      </section>

      ${sections}

      <footer>
        ${signatures}
      </footer>
    </article>`;
}

export async function getContractHtml(
  contractId: string,
): Promise<string | null> {
  if (contractId !== "adoption") {
    return null;
  }

  // Keep this as a plain HTML template for Next's route bundler.
  // The rendered content still comes from the shared contract data source,
  // so switching to database-backed HTML later only changes the data layer.
  return renderContractArticle();
}

export function buildContractPdfHtml(contractHtml: string): string {
  return `<!doctype html>
<html lang="uk">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Договір усиновлення</title>
    <style>
      @page {
        size: A4;
        margin: 16mm 14mm;
      }

      * {
        box-sizing: border-box;
      }

      html,
      body {
        margin: 0;
        padding: 0;
        background: #f4f2ec;
        color: #0c1014;
        font-family: Arial, "Noto Sans", "Liberation Sans", "DejaVu Sans", sans-serif;
        -webkit-font-smoothing: antialiased;
        text-rendering: geometricPrecision;
      }

      body {
        padding: 0;
      }

      .pdf-page {
        padding: 0;
      }

      article {
        background: #ffffff;
        border: 1px solid #d8d1bf;
        border-radius: 16px;
        padding: 36px;
        box-shadow: 0 12px 24px rgba(12, 16, 20, 0.08);
        break-inside: auto;
      }

      header {
        margin-bottom: 32px;
        padding-bottom: 24px;
        border-bottom: 1px solid #d8d1bf;
        text-align: center;
      }

      header p:first-child {
        margin: 0 0 8px;
        color: #5b7765;
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.12em;
        text-transform: uppercase;
      }

      header h1 {
        margin: 0;
        font-size: 28px;
        line-height: 1.2;
      }

      header p:nth-of-type(2) {
        max-width: 720px;
        margin: 16px auto 0;
        color: #5f6b68;
        font-size: 14px;
        line-height: 1.75;
      }

      header p:nth-of-type(3) {
        margin: 16px 0 0;
        font-size: 14px;
        font-weight: 600;
      }

      section {
        margin-bottom: 22px;
        break-inside: avoid-page;
        page-break-inside: avoid;
      }

      section h2 {
        margin: 0 0 10px;
        font-size: 18px;
        line-height: 1.35;
      }

      section div {
        color: #1f2933;
        font-size: 14px;
        line-height: 1.75;
      }

      section div p {
        margin: 0 0 8px;
      }

      section div p:last-child {
        margin-bottom: 0;
      }

      footer {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 32px;
        margin-top: 40px;
        padding-top: 24px;
        border-top: 1px solid #d8d1bf;
        break-inside: avoid-page;
        page-break-inside: avoid;
      }

      footer p {
        margin: 0;
      }

      footer p:first-child {
        margin-bottom: 24px;
        font-size: 14px;
        font-weight: 700;
      }

      footer p:nth-of-type(2) {
        color: #5f6b68;
        font-size: 14px;
        line-height: 1.7;
      }

      footer p:nth-of-type(3) {
        margin-top: 8px;
        color: #5f6b68;
        font-size: 12px;
      }
    </style>
  </head>
  <body>
    <main class="pdf-page">${contractHtml}</main>
  </body>
</html>`;
}
