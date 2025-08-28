import express from "express";
import {create,getAll,getById,updateById,deleteById,undeleteById , getLatest,addReview ,addProduct} from "../controllers/Product.js";
import { verifyToken } from "../middlewares/VerifyToken.js";

const router = express.Router();


router
    .post("/",create)
    .get("/",getAll)
    .get("/:id",getById)
    .patch("/:id",updateById)
    .patch("/undelete/:id",undeleteById)
    .delete("/:id",deleteById)
    .get("/get/latest", getLatest)
    .post("/review/:_id" ,addReview)
    .post("/addProduct",addProduct)

export default router