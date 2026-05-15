import Sales from "../../models/Sales.js";
import Products from "../../models/Products.js";

export const AddSale = async (req, res) => {
    try {
        const { productId, productName, price, category, quantity } = req.body;
        const qtyToSell = parseInt(quantity) || 1;

        // 1. Check product stock
        const product = await Products.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        if (product.quantity < qtyToSell) {
            return res.status(400).json({
                success: false,
                message: `Insufficient stock. Only ${product.quantity} items available.`
            });
        }

        // 2. Create the sale record
        const sale = new Sales({
            productId,
            productName,
            price: price * qtyToSell, // Store total price for the sale
            category,
            quantity: qtyToSell
        });
        await sale.save();

        // 3. Reduce product quantity
        product.quantity -= qtyToSell;
        await product.save();

        res.status(201).json({
            success: true,
            sale,
            updatedProduct: product
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const GetSales = async (req, res) => {
    try {
        const sales = await Sales.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            sales
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const GetSalesStats = async (req, res) => {
    try {
        const stats = await Sales.aggregate([
            {
                $group: {
                    _id: { $month: "$date" },
                    profit: { $sum: "$price" }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const formattedStats = stats.map(item => ({
            name: months[item._id - 1] || "Unknown",
            profit: item.profit
        }));

        res.status(200).json({
            success: true,
            stats: formattedStats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
