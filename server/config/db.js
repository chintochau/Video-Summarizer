import mongoose from "mongoose";

export const connectDB = async () => {
  let databaseName = process.env.NODE_ENV === "production" ? "production" : "test";

  try {
    await mongoose.connect(process.env["MONGODB_URI"], {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: databaseName,
    });
    console.log("MongoDB Connected...");
  } catch (err) {
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
};
