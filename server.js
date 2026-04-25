const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

console.log("🔥 SERVER FILE LOADED");

const app = express();

// =======================
// 📦 Storage config
// =======================
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    if (file.mimetype !== "image/png") {
      return cb(new Error("Only PNG files allowed"));
    }
    cb(null, Date.now() + ".png");
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// =======================
// 🧪 Debug logging
// =======================
app.use((req, res, next) => {
  console.log("➡️ Request:", req.method, req.url);
  next();
});

// =======================
// 🌍 Routes
// =======================

// root (required)
app.get("/", (req, res) => {
  res.send("Server is running");
});

// upload page
app.get("/upload-page", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// handle upload
app.post("/upload", upload.single("file"), (req, res) => {
  console.log("📦 File received:", req.file);

  const fileUrl = `/uploads/${req.file.filename}`;
  res.send(fileUrl);
});

// serve uploaded files
app.use("/uploads", express.static("uploads"));

// list uploaded files (for Dell polling)
app.get("/files", (req, res) => {
  fs.readdir("uploads", (err, files) => {
    if (err) {
      console.log("❌ Error reading files:", err);
      return res.json([]);
    }
    res.json(files);
  });
});

// =======================
// 🚀 Start server
// =======================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 Server running on port " + PORT);
});