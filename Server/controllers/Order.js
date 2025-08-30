import Order from "../models/Order.js";
import { sendMail } from "../utils/Emails.js";
import Cart from "../models/Cart.js";
import Address from "../models/Address.js";
import { generateInvoiceHTML } from "../utils/invoiceTemplate.js";

const create=async(req,res)=>{
    try {
        const {items, address, total} = req.body;
        const user = req.user;
        const created=new Order(req.body)
        await created.save()
        res.status(201).json(created)

        const Items = await Cart.find({ user: user._id }).populate("product");
        const userAddress = await Address.findById(address);
        console.log(Items);
        const userItem = Items.map(item => ({
            title: item.product.title,
            quantity: item.quantity,
            price: item.product.price
        }));
        console.log(userItem);
        // Send invoice email
        const invoiceHTML = generateInvoiceHTML(user, userItem, userAddress, total, created._id);
        await sendMail(user.email, "Your Order Invoice", invoiceHTML);

    } catch (error) {
        console.log(error);
        return res.status(500).json({message:'Error creating an order, please trying again later'})
    }
}

const getByUserId=async(req,res)=>{
    try {
        const {id}=req.params
        const results=await Order.find({user:id})
        res.status(200).json(results)
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:'Error fetching orders, please trying again later'})
    }
}

const getAll = async (req, res) => {
    try {
        let skip=0
        let limit=0

        if(req.query.page && req.query.limit){
            const pageSize=req.query.limit
            const page=req.query.page
            skip=pageSize*(page-1)
            limit=pageSize
        }

        const totalDocs=await Order.find({}).countDocuments().exec()
        const results=await Order.find({}).skip(skip).limit(limit).exec()

        res.header("X-Total-Count",totalDocs)
        res.status(200).json(results)

    } catch (error) {
        console.log(error);
        res.status(500).json({message:'Error fetching orders, please try again later'})
    }
};

const updateById=async(req,res)=>{
    try {
        const {id}=req.params
        const updated=await Order.findByIdAndUpdate(id,req.body,{new:true})
        res.status(200).json(updated)
    } catch (error) {
        console.log(error);
        res.status(500).json({message:'Error updating order, please try again later'})
    }
}

export {
    create,
    getByUserId,
    getAll,
    updateById
}