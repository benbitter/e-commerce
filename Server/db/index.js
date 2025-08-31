import mongoose from "mongoose";

const connectDB = async () => {

        // mongodb+srv://princeraj1504:Prince%401504@cluster0.5n0ewam.mongodb.net/Task2
        await mongoose.connect("mongodb://localhost:27017/Task2")

        console.log("MongoDB connected")
};

export { connectDB };
