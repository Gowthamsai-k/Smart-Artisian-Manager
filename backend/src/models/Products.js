import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({

    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    // image: { type: String, required: true },
    category: { type: String, required: true },
    // stock: { type: Number, required: true },
    // rating: { type: Number, required: true },
    // review: { type: String, required: tr ue }
    oilBrand: { type: String },
    canvasSize: { type: String },
    pencilGrade: { type: String },
    paperType: { type: String },

}, { timestamps: true })

export default mongoose.model('Products', ProductSchema);