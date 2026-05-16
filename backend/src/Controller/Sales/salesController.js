import Sales from "../../models/Sales.js";
import Products from "../../models/Products.js";
import mongoose from "mongoose";

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
            quantity: qtyToSell,
            artisan: req.user.id
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
        const sales = await Sales.find({ artisan: req.user.id }).sort({ createdAt: -1 });
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
                $match: { artisan: new mongoose.Types.ObjectId(String(req.user.id)) }
            },
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
export const ExportSales = async (req, res) => {
    try {
        const { period } = req.query; // monthly, quarterly, yearly
        let filter = { artisan: req.user.id };
        const now = new Date();

        if (period === 'monthly') {
            filter.date = { $gte: new Date(now.getFullYear(), now.getMonth(), 1) };
        } else if (period === 'quarterly') {
            const currentQuarter = Math.floor(now.getMonth() / 3);
            filter.date = { $gte: new Date(now.getFullYear(), currentQuarter * 3, 1) };
        } else if (period === 'yearly') {
            filter.date = { $gte: new Date(now.getFullYear(), 0, 1) };
        }

        const sales = await Sales.find(filter).sort({ date: -1 });

        // Convert to CSV
        let csv = "Date,Product Name,Category,Quantity,Price\n";
        sales.forEach(s => {
            csv += `${s.date.toISOString().split('T')[0]},${s.productName},${s.category},${s.quantity},${s.price}\n`;
        });

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=analysis_${period}.csv`);
        res.status(200).send(csv);

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
