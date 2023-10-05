import express from "express";
import { upload } from "./utilities/multer-upload";
import { checkConvergence } from "./sbishop";
const app = express();

import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3200;
app.listen(PORT, () => {
  console.log(`Service is Live on port: ${PORT}🚀🚀🚀}`);
});

app.post("/api/v1/solve", upload.single("file"), (req, res, next) => {});

app.get("/api/v1/download-template", (req, res, next) => {});
