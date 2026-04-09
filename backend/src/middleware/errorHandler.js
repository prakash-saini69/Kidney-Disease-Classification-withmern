function errorHandler(err, _req, res, _next) {
  console.error("API Error:", err.message);

  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      success: false,
      error: "File too large. Max size is 10MB."
    });
  }

  return res.status(500).json({
    success: false,
    error: "Internal server error"
  });
}

module.exports = { errorHandler };
