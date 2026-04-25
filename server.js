const express = require("express");
const multer = require("multer");
const path = require("path");

console.log("🔥 SERVER FILE LOADED");

const app = express();

// configure storage (save as .png)
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    if (file.mimetype !== "image/png") {
      return cb(new Error("Only PNG files allowed"));
    }
    cb(null, Date.now() + ".png");
  }
});

const upload = multer({ storage });

// log every request (debug)
app.use((req, res, next) => {
  console.log("➡️ Request:", req.method, req.url);
  next();
});

// root route
app.get("/", (req, res) => {
  console.log("✅ Root route hit");
  res.send("Server is running");
});

// serve upload page
app.get("/upload-page", (req, res) => {
  console.log("✅ Upload page route hit");
  res.sendFile(path.join(__dirname, "index.html"));
});

// handle upload
app.post("/upload", upload.single("file"), (req, res) => {
  console.log("📦 File received:", req.file);
  res.send("Upload successful");
});

// start server
app.listen(3000, () => {
  console.log("🚀 Server running on port 3000");
});