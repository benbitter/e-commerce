import { Brand } from "../models/Brand";

const getAll = async (req, res) => {
    try {
        const result = await Brand.find({});
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error fetching brands" });
    }
}

export { getAll };