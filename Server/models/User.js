import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    avatar: {
        type: String
    },
    token: {
        type: String
    }
},{timestamps:true});



userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ id: this._id }, "secret", {
        expiresIn: "1h"
    });
    return token;
};

const User = mongoose.model("User", userSchema);

export default User;
