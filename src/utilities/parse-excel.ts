import fs from "node:fs";
import xlsx from "xlsx";

export async function convertToJSON(path: string) {
  const data = await parseExcel(path);

  fs.unlinkSync(path);

  return data;
}

export async function parseExcel(path: string) {
  const wb = xlsx.readFile(path);

  const sheet = wb.Sheets[wb.SheetNames[0]];

  return xlsx.utils.sheet_to_json(sheet, { defval: "" });
}
