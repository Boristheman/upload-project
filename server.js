const express = require("express");
const multer = require("multer");
const path = require("path");

console.log("🔥 SERVER FILE LOADED");

const app = express();

// storage config (save as .png)
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
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// debug logging
app.use((req, res, next) => {
  console.log("➡️ Request:", req.method, req.url);
  next();
});

// serve HTML page
app.get("/upload-page", (req, res) => {
  console.log("✅ Upload page route hit");
  res.sendFile(path.join(__dirname, "index.html"));
});

// handle upload
app.post("/upload", upload.single("file"), (req, res) => {
  console.log("📦 File received:", req.file);
  res.send("Upload successful");
});

// (optional) view uploaded files
app.use("/uploads", express.static("uploads"));

// ROOT route (Render requires something here)
app.get("/", (req, res) => {
  res.send("Server is running");
});

// 🔥 IMPORTANT: dynamic port for Render
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 Server running on port " + PORT);
});