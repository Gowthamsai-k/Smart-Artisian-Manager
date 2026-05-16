import Material from "../../models/Materials.js";
import mongoose from "mongoose";

export const AddMaterial = async (req, res) => {
    try {
        const { name, quantity, cost, unit } = req.body;
        const artisanId = req.user.id;
        const normalizedName = name?.trim();
        const normalizedUnit = unit?.trim();

        // Check for existing material with SAME name and SAME unit for THIS artisan
        const existingMaterial = await Material.findOne({
            artisan: artisanId,
            name: { $regex: `^${normalizedName}$`, $options: 'i' },
            unit: { $regex: `^${normalizedUnit}$`, $options: 'i' }
        });

        if (existingMaterial) {
            existingMaterial.quantity += Number(quantity || 0);
            existingMaterial.cost += Number(cost || 0);
            existingMaterial.name = normalizedName; // Update with latest casing
            existingMaterial.unit = normalizedUnit;
            await existingMaterial.save();

            return res.status(200).json({
                success: true,
                mat: existingMaterial,
                message: 'Existing material updated with added quantity and cost.'
            });
        }

        // If no duplicate, create new material
        const mat = new Material({
            name: normalizedName,
            quantity: Number(quantity || 0),
            cost: Number(cost || 0),
            unit: normalizedUnit,
            artisan: artisanId
        });
        await mat.save();
        res.status(201).json({
            success: true,
            mat
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const GetMaterials = async (req, res) => {
    try {
        const materials = await Material.find({ artisan: req.user.id });
        res.status(200).json({
            success: true,
            materials
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const GetMaterialStats = async (req, res) => {
    try {
        const stats = await Material.aggregate([
            {
                $match: { artisan: new mongoose.Types.ObjectId(String(req.user.id)) }
            },
            {
                $group: {
                    _id: { $dayOfWeek: "$createdAt" },
                    amount: { $sum: "$quantity" }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const formattedStats = stats.map(item => ({
            name: days[item._id - 1] || "Unknown",
            amount: item.amount
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

export const UpdateMaterial = async (req, res) => {
    try {
        const { id } = req.params;
        const mat = await Material.findOneAndUpdate(
            { _id: id, artisan: req.user.id },
            req.body,
            { new: true }
        );
        if (!mat) return res.status(404).json({ success: false, message: "Material not found or unauthorized" });
        res.status(200).json({ success: true, mat });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export const DeleteMaterial = async (req, res) => {
    try {
        const { id } = req.params;
        const mat = await Material.findOneAndDelete({ _id: id, artisan: req.user.id });
        if (!mat) return res.status(404).json({ success: false, message: "Material not found or unauthorized" });
        res.status(200).json({ success: true, message: "Material deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}