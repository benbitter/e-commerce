import express from "express";
import {create,getAll,getById,updateById,deleteById,undeleteById , getLatest} from "../controllers/Product.js";

const router = express.Router();


router
    .post("/",create)
    .get("/",getAll)
    .get("/:id",getById)
    .patch("/:id",updateById)
    .patch("/undelete/:id",undeleteById)
    .delete("/:id",deleteById)
    .get("/get/latest", getLatest)

export default router