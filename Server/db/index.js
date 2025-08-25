import mongoose from "mongoose";

const connectDB = async () => {

        await mongoose.connect("mongodb+srv://princeraj1504:Prince@1504@cluster0.5n0ewam.mongodb.net/Task2")

        console.log("MongoDB connected")
};

export { connectDB };
