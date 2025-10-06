import mongoose, { MongooseError } from "mongoose";

export const connectDB = async () => {
  try {
    
    await mongoose.connect(process.env.MONGODB_URL!);
    console.log("✅ MongoDB Connected");

  } catch (err: MongooseError | any) {
    console.error("❌ Database connection failed:", err.message);
  }
};
