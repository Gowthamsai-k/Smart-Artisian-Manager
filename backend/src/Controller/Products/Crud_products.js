import Products from "../../models/Products.js";
import Material from "../../models/Materials.js";

export const AddProduct = async (req, res) => {
    try {
        const { name, description, price, quantity, category, materialsUsed } = req.body;

        // 1. Validate and reduce materials
        if (materialsUsed && materialsUsed.length > 0) {
            for (const item of materialsUsed) {
                const material = await Material.findById(item.materialId);
                if (!material) {
                    return res.status(404).json({ success: false, message: `Material ${item.name} not found` });
                }

                // Total quantity needed = quantity per unit * number of products being made
                const totalNeeded = item.quantity * quantity;

                if (material.quantity < totalNeeded) {
                    return res.status(400).json({
                        success: false,
                        message: `Insufficient quantity for ${material.name}. Available: ${material.quantity}, Needed: ${totalNeeded}`
                    });
                }

                // Calculate cost of material used (proportional to total cost)
                const costOfUsedMaterial = (material.cost / material.quantity) * totalNeeded;

                material.quantity -= totalNeeded;
                material.cost -= costOfUsedMaterial;
                await material.save();
            }
        }

        const product = new Products({
            name,
            description,
            price,
            quantity,
            category,
            materialsUsed,
            artisan: req.user.id
        });

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
        const products = await Products.find({ artisan: req.user.id });
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

export const UpdateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Products.findOneAndUpdate(
            { _id: id, artisan: req.user.id },
            req.body,
            { new: true }
        );
        if (!product) return res.status(404).json({ success: false, message: "Product not found or unauthorized" });
        res.status(200).json({ success: true, product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export const DeleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Products.findOneAndDelete({ _id: id, artisan: req.user.id });
        if (!product) return res.status(404).json({ success: false, message: "Product not found or unauthorized" });
        res.status(200).json({ success: true, message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
