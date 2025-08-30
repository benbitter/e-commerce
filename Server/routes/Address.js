import express from "express";
import {
    create,
    getByUserId,
    updateById,
    deleteById,
    getAddresses
} from "../controllers/Address.js";
import { verifyToken } from "../middlewares/VerifyToken.js";

const router = express.Router();


router
    .post("/", create)
    .get("/user/:id", getByUserId)
    .patch('/:id', updateById)
    .delete('/:id', deleteById)
    .get("/", verifyToken, getAddresses)

export default router