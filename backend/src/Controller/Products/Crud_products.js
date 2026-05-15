import Products from "../../models/Products.js";

export const AddProduct = async (req, res) => {
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
export const GetProducts = async (req, res) => {
    try {
        const products = await Products.find();
        res.status(200).json({
            success: true,
            products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
