const mongoose = require("mongoose");

const PredictionSchema = new mongoose.Schema(
  {
    requestId: { type: String, required: true, index: true },
    fileName: { type: String, required: true },
    fileMimeType: { type: String, required: true },
    fileSizeBytes: { type: Number, required: true },
    predictionLabel: { type: String, required: true },
    confidence: { type: Number, required: true },
    explanation: { type: String, required: true },
    rawOutput: { type: mongoose.Schema.Types.Mixed, default: {} }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Prediction", PredictionSchema);
