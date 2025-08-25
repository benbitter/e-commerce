const mongoose=require('mongoose')
const {Schema}=mongoose

const wishlistSchema=new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:"User",
        require:true
    },
    product:{
        type:Schema.Types.ObjectId,
        ref:"Product",
        require:true
    },
    note:{
        type:String,
    }
})

module.exports=mongoose.model("Wishlist",wishlistSchema)