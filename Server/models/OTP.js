import mongoose from "mongoose"

const otpSchema=new mongoose.Schema({
    email: {
        type: String,
    },
    password: {
        type: String
    },
    otp:{
        type:String,
        required:true
    },
    expiresAt:{
        type:Date,
        required:true
    },
})



const Otp = mongoose.model("OTP",otpSchema)
export {Otp}