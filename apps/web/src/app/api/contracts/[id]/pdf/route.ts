import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";
import {
  buildContractPdfHtml,
  getContractHtml,
} from "../../../../(public)/contract/utils/get-contract-html";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getSafeFilename(contractId: string): string {
  const safeId = contractId.trim().replace(/[^a-z0-9_-]+/gi, "-");
  return `dogovir-${safeId || "contract"}.pdf`;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<Response> {
  const { id } = await params;
  const contractHtml = await getContractHtml(id);

  if (!contractHtml) {
    return new Response("Contract not found", { status: 404 });
  }

  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(),
    headless: true,
  });

  try {
    const page = await browser.newPage();
    const html = buildContractPdfHtml(contractHtml);

    await page.setContent(html, { waitUntil: "load" });
    await page.emulateMediaType("screen");

    const pdf = await page.pdf({
      format: "a4",
      printBackground: true,
      margin: {
        top: "16mm",
        right: "14mm",
        bottom: "16mm",
        left: "14mm",
      },
    });

    return new Response(Buffer.from(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${getSafeFilename(id)}"`,
      },
    });
  } finally {
    await browser.close();
  }
}
