import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new mongoose.Schema({
    username: {
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

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

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
