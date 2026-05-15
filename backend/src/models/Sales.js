import mongoose from 'mongoose';

const SalesSchema = new mongoose.Schema({
    productName: { type: String, required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Products', required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, default: 1 },
    category: { type: String },
    date: { type: Date, default: Date.now },
    artisan: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default mongoose.model('Sales', SalesSchema);