import express from "express";
import multer from "multer";
import cors from "cors";
import { exec } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// Folder upload
const upload = multer({ dest: "uploads/" });

// ========== UPLOAD VIDEO ==========
app.post("/upload", upload.single("video"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No video uploaded" });

  const inputPath = req.file.path;
  const outputPath = `uploads/short_${Date.now()}.mp4`;

  // Crop video menjadi 9:16 short otomatis
  const cmd = `ffmpeg -i ${inputPath} -vf "crop=in_w:in_h*0.8" -t 00:00:30 ${outputPath}`;

  exec(cmd, (err) => {
    if (err) return res.status(500).json({ error: "Failed to process video" });

    res.json({
      message: "Video processed",
      output: outputPath,
    });
  });
});

// ========== GET FILE ==========
app.get("/file/:name", (req, res) => {
  const file = path.join(__dirname, "..", "uploads", req.params.name);
  res.download(file);
});

// ========== RUN SERVER ==========
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});