import express from "express";
import { convertToJSON } from "./utilities/parse-excel";
import { checkConvergence } from "./sbishop";
import dotenv from "dotenv";
import cors from "cors";
import multer from "multer";
dotenv.config();

const upload = multer({ dest: "uploads/" });

const app = express();

app.use(cors());
app.use(express.json());

app.post("/api/v1/solve", upload.single("file"), async (req, res, next) => {
  //Get file from request and check if file is present
  const file = req.file;
  if (!file) {
    return res.status(400).json({
      status: "error",
      message: "No file uploaded",
    });
  }
  //Check if file is an xls or xlsx file
  if (
    file.mimetype !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" &&
    file.mimetype !== "application/vnd.ms-excel"
  ) {
    return res.status(400).json({
      status: "error",
      message: "Invalid file type",
    });
  }
  const data = await convertToJSON(file.path);
  console.log(data);
  //Check headers of file to ensure it is a valid template
  //Check if file has the required headers
  res.send("seen");
});

app.get("/api/v1/download-template", (req, res, next) => {
  //Set headers to trigger download
});

const PORT = process.env.PORT || 3200;
app.listen(PORT, () => {
  console.log(`Service is Live on port: ${PORT}🚀🚀🚀`);
});
