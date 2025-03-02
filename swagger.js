const express = require("express");
const swaggerUi = require("swagger-ui-express");
const fs = require("fs");
const yaml = require("yaml");
const multer = require("multer");
const path = require("path");

const app = express();
const swaggerFile = fs.readFileSync("./docs/openapi.yaml", "utf8");
const swaggerDocument = yaml.parse(swaggerFile);

const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
  console.log(`Created directory: ${uploadDir}`);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("Saving file to:", uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueFilename = Date.now() + path.extname(file.originalname);
    console.log("Generated filename:", uniqueFilename);
    cb(null, uniqueFilename);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      console.log("Invalid file type:", file.mimetype);
      return cb(new Error("Only images are allowed!"), false);
    }
    cb(null, true);
  }
});

app.use(express.json());

app.post("/contacts", upload.single("image"), (req, res) => {
  try {
    console.log("Received POST /contacts request");
    console.log("Request body:", req.body);
    console.log("Uploaded file:", req.file);

    if (!req.file) {
      console.log("No file uploaded");
      return res.status(400).json({ message: "File is required!" });
    }

    res.status(201).json({
      message: "Contact created successfully!",
      data: {
        ...req.body,
        photo: `/uploads/${req.file.filename}`,
      },
    });
  } catch (error) {
    console.error("Error in /contacts:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

app.patch("/contacts/:id", upload.single("image"), (req, res) => {
  try {
    console.log(`Received PATCH /contacts/${req.params.id} request`);
    console.log("Request body:", req.body);
    console.log("Uploaded file:", req.file);

    if (!req.file) {
      console.log("No file uploaded");
      return res.status(400).json({ message: "File is required!" });
    }

    res.status(200).json({
      message: "Contact updated successfully!",
      data: {
        ...req.body,
        photo: `/uploads/${req.file.filename}`,
      },
    });
  } catch (error) {
    console.error("Error in /contacts/:id:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(3001, () => console.log("API Docs available at http://localhost:3001/api-docs"));
