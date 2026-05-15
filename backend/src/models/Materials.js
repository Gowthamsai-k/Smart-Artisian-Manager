import mongoose from "mongoose";

const MaterialSchema = new mongoose.Schema({
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    cost: { type: Number, required: true },
    unit: { type: String, required: true },
    artisan: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default mongoose.model('Material', MaterialSchema);  