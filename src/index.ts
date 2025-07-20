import fs from "fs";
import path from "path";
import puppeteer from "puppeteer";
import Handlebars from "handlebars";
import csvParse from "csv-parse/sync";

interface Certificado {
  nombre: string;
  tipoNif: string;
  nif: string;
  day: string;
  month: string;
  year: string;
  [key: string]: string; // permite campos extra si el CSV tiene más
}

function imageToBase64(filePath: string): string {
  const ext = path.extname(filePath).slice(1);
  const data = fs.readFileSync(filePath);
  return `data:image/${ext};base64,${data.toString("base64")}`;
}

async function renderTemplate(data: Record<string, unknown>): Promise<string> {
  const tpl = fs.readFileSync(
    path.resolve(__dirname, "./template.html"),
    "utf-8"
  );
  const fn = Handlebars.compile(tpl);
  return fn(data);
}

async function generatePdf(data: Record<string, unknown>, outputPath: string) {
  const html = await renderTemplate(data);
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });
  await page.emulateMediaType("screen");
  await page.pdf({
    path: outputPath,
    format: "A4",
    landscape: true,
    printBackground: true,
    margin: { top: "0cm", bottom: "0cm", left: "0cm", right: "0cm" },
  });
  await browser.close();
}

async function main() {
  const csvPath = path.resolve(__dirname, "../certificates.csv");
  const csvContent = fs.readFileSync(csvPath, "utf-8");
  const records: Certificado[] = csvParse.parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
  });

  const roseton = imageToBase64(
    path.resolve(__dirname, "./assets/roseton.png")
  );
  const mosaico = imageToBase64(
    path.resolve(__dirname, "./assets/mosaico.png")
  );

  const now = new Date();
  const day = now.getDate().toString();
  const month = now.toLocaleString("es-ES", { month: "long" });
  const year = now.getFullYear().toString();

  const outputDir = path.resolve(__dirname, "../output");
  if (fs.existsSync(outputDir)) {
    for (const file of fs.readdirSync(outputDir)) {
      fs.unlinkSync(path.join(outputDir, file));
    }
  } else {
    fs.mkdirSync(outputDir);
  }

  for (const row of records) {
    const data: Record<string, unknown> = {
      ...row,
      day,
      month,
      year,
      roseton,
      mosaico,
    };
    const outputPath = path.join(outputDir, `${row.nif}.pdf`);
    await generatePdf(data, outputPath);
    console.log(`Certificado generado: ${outputPath}`);
  }
}

if (require.main === module) {
  main();
}
