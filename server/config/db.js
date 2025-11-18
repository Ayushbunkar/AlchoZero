import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const fallback = 'mongodb://127.0.0.1:27017/alchozero';
    const uri = process.env.MONGO_URI || fallback;

    if (!process.env.MONGO_URI) {
      console.warn(
        'Warning: MONGO_URI not set in environment. Falling back to local MongoDB at',
        fallback
      );
    }

    const conn = await mongoose.connect(uri, {
      // use recommended options where applicable
      // mongoose v6+ uses sane defaults; keep options minimal
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection error:", error?.message || error);
    process.exit(1);
  }
};

export default connectDB;


