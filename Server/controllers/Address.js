import Address from "../models/Address.js"

const create=async(req,res)=>{
    try {
        const created=new Address(req.body)
        await created.save()
        res.status(201).json(created)
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:'Error adding address, please trying again later'})
    }
}

const getAddresses = async (req, res) => {
    try {
        const user = req.user;
        const results = await Address.find({ user: user._id })
        res.status(200).json(results)
    } catch (error) {
        console.log(error);
        res.status(500).json({message:'Error fetching addresses, please try again later'})
    }
}

const getByUserId = async (req, res) => {
    try {
        const {id}=req.params
        const results=await Address.find({user:id})
        res.status(200).json(results)
    
    } catch (error) {
        console.log(error);
        res.status(500).json({message:'Error fetching addresses, please try again later'})
    }
};

const updateById=async(req,res)=>{
    try {
        const {id}=req.params
        const updated=await Address.findByIdAndUpdate(id,req.body,{new:true})
        console.log(updated);
        res.status(200).json(updated)
    } catch (error) {
        console.log(error);
        res.status(500).json({message:'Error updating address, please try again later'})
    }
}

const deleteById=async(req,res)=>{
    try {
        const {id}=req.params
        const deleted=await Address.findByIdAndDelete(id)
        res.status(200).json(deleted)
    } catch (error) {
        console.log(error);
        res.status(500).json({message:'Error deleting address, please try again later'})
    }
}

export {
    create,
    getByUserId,
    updateById,
    deleteById,
    getAddresses
}