import Products from "../models/Products";
import protect from "../middleware/authMiddle";


export const AddProduct = async (req, res, protect) => {
    try {

        const product = new Products(req.body);

        await product.save();

        res.status(201).json({
            success: true,
            product
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
}

