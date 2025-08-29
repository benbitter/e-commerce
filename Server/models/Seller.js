import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema({

    sellerEmail : {
        type : String,
        require : true
    },
    productid :{
        type : String,
        require : true
    }
},{timestamps:true});

const Seller = mongoose.model("Seller", sellerSchema);

export default Seller;