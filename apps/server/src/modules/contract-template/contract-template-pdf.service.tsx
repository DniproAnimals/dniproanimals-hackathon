import puppeteer from "puppeteer";

import { renderToStaticMarkup } from "react-dom/server";

import { ContractPdfDocument } from "@dniproanimals/contracts";

import { NotFoundError } from "../../shared/errors";
import { contractPdfStyles } from "./contract-pdf.styles";
import { contractTemplateService } from "./contract-template.service";

export const contractTemplatePdfService = {
  async generate(type: string): Promise<Buffer> {
    try {
      console.log("1. Получаем договор...");

      const contract = await contractTemplateService.getActive(type);

      if (!contract) {
        throw new NotFoundError("Contract template");
      }

      console.log("2. Рендерим React...");

      const body = renderToStaticMarkup(
        <ContractPdfDocument
          contract={{
            ...contract,
            updatedAt: contract.updatedAt.toISOString(),
          }}
        />,
      );

      const html = `
<!DOCTYPE html>
<html lang="uk">
<head>
<meta charset="UTF-8" />
<style>
${contractPdfStyles}
</style>
</head>
<body>
${body}
</body>
</html>
`;

      console.log("3. Запускаем Chrome...");

      const browser = await puppeteer.launch({
        executablePath:
          "C:\\Users\\maksi\\.cache\\puppeteer\\chrome\\win64-150.0.7871.24\\chrome-win64\\chrome.exe",
        headless: true,
      });

      console.log("4. Chrome запущен");

      try {
        const page = await browser.newPage();

        console.log("5. Создаем страницу");

        await page.setContent(html, {
          waitUntil: "domcontentloaded",
        });

        console.log("6. Генерируем PDF");

        const pdf = await page.pdf({
          format: "A4",
          printBackground: true,
          margin: {
            top: "20mm",
            right: "15mm",
            bottom: "20mm",
            left: "15mm",
          },
        });

        console.log("7. PDF готов");

        return Buffer.from(pdf);
      } finally {
        await browser.close();
      }
    } catch (e) {
      console.error("========== PDF ERROR ==========");
      console.error(e);
      console.error("===============================");
      throw e;
    }
  },
};
