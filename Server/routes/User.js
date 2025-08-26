import express from "express";
import * as userController from "../controllers/User.js";

const router = express.Router();


router
    .get("/:id",userController.getById)
    .patch("/:id",userController.updateById)

module.exports=router