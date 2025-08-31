import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema({

    sellerEmail : {
        type : String,
        require : true
    },
    product :{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Product",
        require : true
    }
},{timestamps:true});

const Seller = mongoose.model("Seller", sellerSchema);

export default Seller;