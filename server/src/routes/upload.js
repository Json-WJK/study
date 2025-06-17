const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { url } = require("inspector");
require("dotenv").config();

const router = express.Router();
const UPLOAD_DIR = path.join(__dirname, "../../uploads");
const HASH_DIR = path.join(__dirname, "../../hashes");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);
if (!fs.existsSync(HASH_DIR)) fs.mkdirSync(HASH_DIR);

// 1️⃣ 自定义存储引擎，保留原始文件名，避免乱码
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    // 修复中文名乱码（latin1 → utf8）
    const originalName = Buffer.from(file.originalname, "latin1").toString(
      "utf8"
    );
    cb(null, originalName);
  },
});

const upload = multer({ storage });

router.get("/check-hash", (req, res) => {
  const hash = req.query.hash;
  if (!hash) return res.status(400).json({ error: "Missing hash" });

  const exists = fs.existsSync(path.join(HASH_DIR, hash));
  const file = req.file;
  res.json({
    exists,
    url:
      file && file.originalname
        ? process.env.SERVER_URL + `/uploads/${file.originalname}`
        : null,
  });
});

router.post("/upload", upload.single("file"), (req, res) => {
  const hash = req.body.hash;
  const file = req.file;

  if (!hash || !file) {
    return res.status(400).json({ error: "Missing file or hash" });
  }

  try {
    fs.writeFileSync(path.join(HASH_DIR, hash), "uploaded");
    res.json({
      success: true,
      filename: file.filename,
      hash: hash,
      url: process.env.SERVER_URL + `/uploads/${file.filename}`,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// 上传 chunk
router.post("/upload-chunk", upload.single("chunk"), (req, res) => {
  const file = req.file;
  const chunkDir = path.join(UPLOAD_DIR, file.filename.split("-")[0]); // 使用文件名的第一个部分作为目录名
  if (!fs.existsSync(chunkDir)) {
    fs.mkdirSync(chunkDir, { recursive: true });
  }
  const chunkPath = path.join(chunkDir, file.originalname);
  fs.rename(file.path, chunkPath, (err) => {
    if (err) return res.status(500).send("上传失败");
    res.send("ok");
  });
});

// 检查已上传
router.get("/check-chunk", (req, res) => {
  const { hash } = req.query;
  const chunkDir = path.join(UPLOAD_DIR, hash);
  const uploadedChunks = fs.existsSync(chunkDir)
    ? fs.readdirSync(chunkDir)
    : [];
  res.json(uploadedChunks.map((name) => parseInt(name)));
});

module.exports = router;
