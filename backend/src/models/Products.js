import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({

    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    category: { type: String, required: true },
    materialsUsed: [{
        materialId: { type: mongoose.Schema.Types.ObjectId, ref: 'Material' },
        name: String,
        quantity: Number
    }],
    artisan: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' }

}, { timestamps: true })

export default mongoose.model('Products', ProductSchema);