import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import bookRoute from "./route/book.route.js";
import userRoute from "./route/user.route.js";

dotenv.config(); // load env FIRST

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4001;
const URI = process.env.MongoDBURI; // must match .env key exactly

if (!URI) {
  console.error("❌ MongoDB URI missing. Set MongoDBURI in .env");
  process.exit(1);
}

// Optional: cleaner Mongoose logs
mongoose.set("strictQuery", true);

(async () => {
  try {
    // Log without exposing creds
    console.log(
      "Connecting to:",
      URI.replace(/(mongodb\+srv:\/\/)([^:]+):([^@]+)@/, "$1<user>:<redacted>@")
    );

    await mongoose.connect(URI, {
      // modern driver – no need for useNewUrlParser/useUnifiedTopology
      serverSelectionTimeoutMS: 8000,
      appName: "onlinebook-backend",
    });

    console.log("✅ Connected to mongoDB");

    // Routes after DB is ready (optional but safer)
    app.use("/book", bookRoute);
    app.use("/user", userRoute);

    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
})();
