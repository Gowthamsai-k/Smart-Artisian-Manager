import Material from "../../models/Materials.js";

export const AddMaterial = async (req, res) => {
    try {
        const mat = new Material(req.body);
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
        const materials = await Material.find();
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