import fs from "fs";
import path from "path";
import puppeteer from "puppeteer";
import Handlebars from "handlebars";
import csvParse from "csv-parse/sync";

interface Certificado {
  id: string;
  nombre: string;
  tipoNif: string;
  nif: string;
  day: string;
  month: string;
  year: string;
  tituloPoster?: string; // opcional, para certificados de posters
  cargo?: string; // opcional, para certificados de organización
  [key: string]: string; // permite campos extra si el CSV tiene más
}

function imageToBase64(filePath: string): string {
  const ext = path.extname(filePath).slice(1);
  const data = fs.readFileSync(filePath);
  return `data:image/${ext};base64,${data.toString("base64")}`;
}

async function renderTemplate(
  templatePath: string,
  data: Record<string, unknown>
): Promise<string> {
  const tpl = fs.readFileSync(templatePath, "utf-8");
  const fn = Handlebars.compile(tpl);
  return fn(data);
}

async function generatePdf(
  templatePath: string,
  data: Record<string, unknown>,
  outputPath: string
) {
  const html = await renderTemplate(templatePath, data);
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

async function processTemplate(templateName: string, csvPath: string) {
  const templatePath = path.resolve(
    __dirname,
    `./templates/${templateName}.html`
  );

  if (!fs.existsSync(templatePath)) {
    console.error(`Template file not found: ${templatePath}`);
    return;
  }

  if (!fs.existsSync(csvPath)) {
    console.error(`CSV file not found: ${csvPath}`);
    return;
  }

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
  const secre = imageToBase64(path.resolve(__dirname, "../private/Secre.png"));
  const presi = imageToBase64(path.resolve(__dirname, "../private/Presi.png"));

  const now = new Date();
  const day = now.getDate().toString();
  const month = now.toLocaleString("es-ES", { month: "long" });
  const year = now.getFullYear().toString();

  const outputDir = path.resolve(__dirname, "../output", templateName);
  if (fs.existsSync(outputDir)) {
    for (const file of fs.readdirSync(outputDir)) {
      fs.unlinkSync(path.join(outputDir, file));
    }
  } else {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  for (const row of records) {
    const data: Record<string, unknown> = {
      ...row,
      day,
      month,
      year,
      roseton,
      mosaico,
      secre,
      presi,
    };
    const outputPath = path.join(outputDir, `${row.id}.pdf`);
    await generatePdf(templatePath, data, outputPath);
    console.log(`Certificado generado: ${outputPath}`);
  }
}

async function main() {
  const templateName = process.argv[2];
  const csvFile = process.argv[3];

  // If both template and CSV are provided, process them directly
  if (templateName && csvFile) {
    const csvPath = path.resolve(__dirname, "..", csvFile);
    await processTemplate(templateName, csvPath);
    return;
  }

  // If no arguments provided, process all CSV files in input folder
  if (!templateName && !csvFile) {
    const inputDir = path.resolve(__dirname, "../input");

    if (!fs.existsSync(inputDir)) {
      console.error(`Input directory not found: ${inputDir}`);
      return;
    }

    const csvFiles = fs
      .readdirSync(inputDir)
      .filter((file) => file.endsWith(".csv"));

    if (csvFiles.length === 0) {
      console.error("No CSV files found in input directory");
      return;
    }

    for (const csvFile of csvFiles) {
      const templateName = path.basename(csvFile, ".csv");
      const csvPath = path.join(inputDir, csvFile);
      console.log(`Processing template: ${templateName} with CSV: ${csvFile}`);
      await processTemplate(templateName, csvPath);
    }
    return;
  }

  // If only one argument is provided, show error
  console.error(
    "Error: Please provide both template name and CSV file, or no arguments to process all CSV files in input folder"
  );
  console.error("Usage:");
  console.error(
    "  pnpm start <templateName> <csvFile>    - Process specific template with CSV file"
  );
  console.error(
    "  pnpm start                             - Process all CSV files in input folder"
  );
}

if (require.main === module) {
  main();
}
