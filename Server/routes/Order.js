import express from "express";
import {
    create,
    getByUserId,
    getAll,
    updateById
} from "../controllers/Order.js";
import { verifyToken } from "../middlewares/VerifyToken.js";


const router = express.Router();



router
    .post("/", verifyToken, create)
    .get("/", getAll)
    .get("/user/:id", getByUserId)
    .patch("/:id", updateById)


export default router