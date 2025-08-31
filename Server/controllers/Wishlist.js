import Wishlist from "../models/Wishlist.js"

const create=async(req,res)=>{
    try {
        const created=await new Wishlist(req.body).populate({path:"product"})
        await created.save()
        res.status(201).json(created)
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Error adding product to wishlist, please try again later"})
    }
}
const getByUserId=async(req,res)=>{
    try {
        const {id}=req.params

        const result=await Wishlist.find({user:id}).populate({path:"product"})
        res.status(200).json(result)
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Error fetching your wishlist, please try again later"})
    }
}
const updateById=async(req,res)=>{
    try {
        const {id}=req.params
        const updated=await Wishlist.findByIdAndUpdate(id,req.body,{new:true}).populate("product")
        res.status(200).json(updated)
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Error updating your wishlist, please try again later"})
    }
}
const deleteById=async(req,res)=>{
    try {
        const {id}=req.params
        const deleted=await Wishlist.findByIdAndDelete(id)
        return res.status(200).json(deleted)
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Error deleting that product from wishlist, please try again later"})
    }
}

export {
    create,
    getByUserId,
    updateById,
    deleteById
}