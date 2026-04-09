const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const apiRoutes = require("./routes/apiRoutes");
const { connectDB } = require("./config/db");
const { errorHandler } = require("./middleware/errorHandler");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
  origin: "*"
}));
app.use(express.json());

app.use("/api", apiRoutes);
app.use(errorHandler);

async function bootstrap() {
  await connectDB(process.env.MONGODB_URI);
  app.listen(port, () => {
    console.log(`Backend server running on port ${port}`);
  });
}

bootstrap();
