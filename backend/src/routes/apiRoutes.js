const express = require("express");
const multer = require("multer");
const { createPrediction, getPredictionHistory } = require("../controllers/predictionController");

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
});

router.get("/health", (_req, res) => {
  res.json({ success: true, service: "backend", status: "ok" });
});

router.post("/predict", upload.single("file"), createPrediction);
router.get("/history", getPredictionHistory);

module.exports = router;
