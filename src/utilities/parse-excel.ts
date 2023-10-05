import { Request } from "express";
import fs from "fs";
import xlsx from "xlsx";

export async function convertToJSON(req: Request) {
  if (!req.file || !req.file.path) {
    throw new Error("File path not found");
  }

  const { path } = req.file;

  if (!path) throw new Error("file not found");

  const data = await parseExcel(path);

  fs.unlinkSync(path);

  return data;
}

export async function parseExcel(path: string) {
  const wb = xlsx.readFile(path);

  const sheet = wb.Sheets[wb.SheetNames[0]];

  return xlsx.utils.sheet_to_json(sheet, { defval: "" });
}

export async function generateReport(data: unknown[], sheetName: string | undefined) {
  const workbook = xlsx.utils.book_new();

  const worksheet = xlsx.utils.json_to_sheet(data);
  xlsx.utils.book_append_sheet(workbook, worksheet, sheetName);
  return xlsx.write(workbook, {
    bookType: "xlsx",
    type: "buffer",
  });
}
