import express from "express";
import { convertToJSON } from "./utilities/parse-excel";
import { checkConvergence } from "./sbishop";
import dotenv from "dotenv";
import cors from "cors";
import multer from "multer";
import { Slice } from "./slice";
import fs from "node:fs";
dotenv.config();

const upload = multer({ dest: "uploads/" });

const app = express();

app.use(cors());
app.use(express.json());

app.post("/api/v1/solve", upload.single("file"), async (req, res, next) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({
      status: "error",
      message: "No file uploaded",
    });
  }

  if (
    file.mimetype !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" &&
    file.mimetype !== "application/vnd.ms-excel"
  ) {
    return res.status(400).json({
      status: "error",
      message: "Invalid file type",
    });
  }

  const data = (await convertToJSON(file.path)) as Slice[];

  //Validate input data - Not done yet
  const FOS = checkConvergence(data, 0, 0.0001, 10000); //Default intial guess is 0, default tolerance is 0.0001
  let determinaion = "";
  if (FOS < 1) determinaion = "Unstable";
  else determinaion = "Stable";
  res.send({ FactorOfSafety: FOS, Inference: determinaion });
});

app.get("/api/v1/download-template", (req, res, next) => {
  const path = "./src/template.xlsx";

  if (fs.existsSync(path)) {
    res.setHeader("Content-Disposition", 'attachment; filename="template.xlsx"');

    // Set the Content-Type header to specify the XLSX format
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    const fileStream = fs.createReadStream(path);
    fileStream.pipe(res);
  } else {
    res.status(500).json({
      status: "error",
      message: "Template file not found",
    });
  }
});

const PORT = process.env.PORT || 3200;
app.listen(PORT, () => {
  console.log(`Service is Live on port: ${PORT}🚀🚀🚀`);
});
