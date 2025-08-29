import express from "express";
import {
    create,
    getByUserId,
    updateById,
    deleteById,
    deleteByUserId,
    getcarts
} from "../controllers/Cart.js";
import { verifyToken } from "../middlewares/VerifyToken.js";

const router = express.Router();


router
    .post("/", create)
    .get("/user/:id", getByUserId)
    .patch("/:id", updateById)
    .delete("/:id", deleteById)
    .delete("/user/:id", deleteByUserId)
    .get('/getcarts',verifyToken,getcarts)

export default router