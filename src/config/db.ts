import mongoose, { MongooseError } from "mongoose";

export const connectDB = async () => {

  let connected = false;
  do {

    try {

      await mongoose.connect(process.env.MONGODB_URL!);
      console.log("✅ MongoDB Connected");
      connected = true;

    } catch (err: MongooseError | any) {
      console.error("❌ Database connection failed:", err.message);
      connected = false;
    }

  } while (!connected);
};
