import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require:true
    },
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
        require:true
    },
    note:{
        type:String,
    }
})

const Wishlist = mongoose.model("Wishlist",wishlistSchema)
export default Wishlist