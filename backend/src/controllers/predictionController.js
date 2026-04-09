const { v4: uuidv4 } = require("uuid");
const Prediction = require("../models/Prediction");
const { requestPredictionFromMLService } = require("../services/mlServiceClient");

function buildExplanation(label, confidence) {
  const pct = (confidence * 100).toFixed(2);
  return `Model predicts ${label} with ${pct}% confidence. This result should support, not replace, clinical evaluation.`;
}

async function createPrediction(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "Image file is required"
      });
    }

    const requestId = uuidv4();
    const mlServiceUrl = process.env.ML_SERVICE_URL;
    const mlResult = await requestPredictionFromMLService(req.file, requestId, mlServiceUrl);

    if (!mlResult?.success) {
      return res.status(502).json({
        success: false,
        error: "ML service returned unsuccessful response"
      });
    }

    const explanation = buildExplanation(mlResult.prediction, mlResult.confidence);

    const savedPrediction = await Prediction.create({
      requestId,
      fileName: req.file.originalname,
      fileMimeType: req.file.mimetype,
      fileSizeBytes: req.file.size,
      predictionLabel: mlResult.prediction,
      confidence: mlResult.confidence,
      explanation,
      rawOutput: mlResult.raw_output
    });

    return res.status(201).json({
      success: true,
      request_id: requestId,
      prediction: savedPrediction.predictionLabel,
      confidence: savedPrediction.confidence,
      explanation: savedPrediction.explanation,
      raw_output: savedPrediction.rawOutput,
      created_at: savedPrediction.createdAt
    });
  } catch (error) {
    return next(error);
  }
}

async function getPredictionHistory(_req, res, next) {
  try {
    const predictions = await Prediction.find({})
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    return res.json({
      success: true,
      data: predictions.map((item) => ({
        request_id: item.requestId,
        timestamp: item.createdAt,
        file: {
          name: item.fileName,
          type: item.fileMimeType,
          size_bytes: item.fileSizeBytes
        },
        prediction: item.predictionLabel,
        confidence: item.confidence,
        explanation: item.explanation
      }))
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = { createPrediction, getPredictionHistory };
