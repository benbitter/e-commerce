import express from "express";
import * as reviewController from "../controllers/Review.js";

const router = express.Router();



router
    .post("/",reviewController.create)
    .get('/product/:id',reviewController.getByProductId)
    .patch('/:id',reviewController.updateById)
    .delete("/:id",reviewController.deleteById)

module.exports=router