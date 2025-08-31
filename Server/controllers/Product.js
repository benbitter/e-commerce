import mongoose from "mongoose"
import { Schema } from "mongoose"
import Product from "../models/Product.js"
import cloudinary from "../config/cloudinary.js";
import Seller from "../models/Seller.js";

const getSellerfromProductId = async(req,res)=>{
  try {
    
    const {_id} = req.params;
    const seller = await Seller.findOne({productid : _id});
    return res.status(200).json(seller);

  } catch (error) {
    return res.status(400).json({message : "cannot not find seller" ,error });
  }
}

const getSellerProducts = async (req, res) => {
  try {
    const seller = req.user.email;
    const products = await Seller.find({ sellerEmail: seller }).populate("product");
    return res.status(200).json(
      products
    );
  } catch (error) {
    return res.status(400).json({ message: "Cannot find products for this seller", error });
  }
};

const addProduct = async (req, res) => {
  try {
    const { title, description, price, stock, images } = req.body;

    if (!images || images.length === 0) {
      return res.status(400).json({ message: "No images provided" });
    }

    console.log(title ,description , price , stock , images);

    // Upload each image (Base64 / URL)
    // const uploadedUrls = [];
    // for (let img of images) {
    //   const result = await cloudinary.uploader.upload(img, {
    //     folder: "products",
    //   });
    //   uploadedUrls.push(result.secure_url);
    // }

    const newProduct = new Product({
      title,
      description,
      price,
      stock,
      images: images,
      thumbnail: images[0],
    });

    const saved = await newProduct.save();

    const seller = new Seller({
      sellerEmail: req.user.email,
      product: newProduct._id,
    });

    await seller.save();

    res.status(201).json({
      message: "✅ Product added successfully",
      product: saved,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "❌ Failed to add product" });
  }
};

const create=async(req,res)=>{
    try {
        const created=new Product(req.body)
        await created.save()
        res.status(201).json(created)
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:'Error adding product, please trying again later'})
    }
}

const getLatest = async (req, res) => {
    try {
        const results = await Product.find().sort({ createdAt: -1 }).limit(30);
        res.status(200).json(results);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error fetching latest products, please try again later' });
    }
};

const getAll = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", category, minPrice, maxPrice } = req.query;

    const query = {};

    // 🔍 Search by title (case-insensitive, anywhere in string)
    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    // 📂 Filter by category
    if (category) {
      query.category = category;
    }

    // 💰 Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // 📄 Pagination
    const skip = (page - 1) * limit;
    const results = await Product.find(query).skip(skip).limit(Number(limit));
    const total = await Product.countDocuments(query);

    // Get all categories for dropdown filter
    const categories = await Product.distinct("category");

    res.status(200).json({
      results,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      categories
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching products, please try again later' });
  }
};


const getById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Product.findById(id).populate("brand").populate("category");
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error getting product details, please try again later' });
    }
}

const addReview = async (req, res) => {
  try {
    const { _id } = req.params; // product id
   
    const { user , rating, comment } = req.body;

    console.log(user ,rating,comment);

    const review = {
      rating,
      comment,
      date: new Date(),
      reviewerName: user?.name || "Anonymous",
      reviewerEmail: user?.email || "anonymous@example.com",
    };

    const updatedProduct = await Product.findByIdAndUpdate(
      _id,
      { $push: { reviews: review } },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    req.io.emit("newReview", { productId: _id, review: review });
    res.status(200).json({ message: "Review added successfully", 
      product: updatedProduct 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Cannot add review" });
  }
};

const updateById = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Product.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(updated)
    } catch (error) {
        console.log(error);
        res.status(500).json({message:'Error updating product, please try again later'})
    }
}

const undeleteById=async(req,res)=>{
    try {
        const {id}=req.params
        const unDeleted=await Product.findByIdAndUpdate(id,{isDeleted:false},{new:true}).populate('brand')
        res.status(200).json(unDeleted)
    } catch (error) {
        console.log(error);
        res.status(500).json({message:'Error restoring product, please try again later'})
    }
}

const deleteById=async(req,res)=>{
    try {
        const {id}=req.params
        const deleted=await Product.findByIdAndUpdate(id,{isDeleted:true},{new:true}).populate("brand")
        res.status(200).json(deleted)
    } catch (error) {
        console.log(error);
        res.status(500).json({message:'Error deleting product, please try again later'})
    }
}

export {create,getAll,getById,updateById,deleteById,undeleteById,getLatest, addReview ,addProduct,getSellerfromProductId , getSellerProducts}
