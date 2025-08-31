import mongoose from "mongoose";

const connectDB = async () => {

        await mongoose.connect("mongodb+srv://princeraj1504:princeraj1504@cluster0.0awpuyk.mongodb.net/Task2")

        console.log("MongoDB connected")
};

export { connectDB };
