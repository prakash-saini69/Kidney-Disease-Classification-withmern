const mongoose = require("mongoose");

async function connectDB(mongoUri) {
  try {
    if (!mongoUri) {
      throw new Error("MONGODB_URI is not set");
    }

    const connection = await mongoose.connect(mongoUri);
    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
}

module.exports = { connectDB };
