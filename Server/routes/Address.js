import express from "express";
import * as addressController from "../controllers/Address.js";

const router = express.Router();


router
    .post("/",addressController.create)
    .get("/user/:id",addressController.getByUserId)
    .patch('/:id',addressController.updateById)
    .delete('/:id',addressController.deleteById)

module.exports=router