import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Client from './src/models/Client.js';
import Material from './src/models/Materials.js';
import Product from './src/models/Products.js';
import Sales from './src/models/Sales.js';

dotenv.config();

const populate = async () => {
    try {
        await mongoose.connect(process.env.mongo_url);
        console.log("Connected to MongoDB");

        const now = new Date();

        // 1. Get the specific user
        const user = await Client.findOne({ email: 'gowthamsai0519@gmail.com' }) || await Client.findOne();
        if (!user) {
            console.error("No user found. Please sign up first.");
            process.exit(1);
        }
        const artisanId = user._id;
        console.log(`Populating data for artisan: ${user.name} (${artisanId})`);

        // 2. Clear existing data for this user (optional, but good for clean demo)
        // await Material.deleteMany({ artisan: artisanId });
        // await Product.deleteMany({ artisan: artisanId });
        // await Sales.deleteMany({ artisan: artisanId });

        // 3. Add Sample Materials (with different creation dates for stats)
        const matData = [
            { name: "Clay", quantity: 50, cost: 100, unit: "kg", artisan: artisanId, createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 5) },
            { name: "Teak Wood", quantity: 20, cost: 500, unit: "sq ft", artisan: artisanId, createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3) },
            { name: "Silk Thread", quantity: 100, cost: 50, unit: "spools", artisan: artisanId, createdAt: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1) },
            { name: "Glaze", quantity: 10, cost: 200, unit: "liters", artisan: artisanId, createdAt: new Date() }
        ];
        const materials = await Material.insertMany(matData);
        console.log("Materials added");

        // 4. Add Sample Products
        const products = await Product.insertMany([
            {
                name: "Handcrafted Ceramic Vase",
                description: "A beautiful hand-thrown ceramic vase with blue glaze.",
                price: 1200,
                quantity: 10,
                category: "Ceramics",
                materialsUsed: [
                    { materialId: materials[0]._id, name: materials[0].name, quantity: 2 },
                    { materialId: materials[3]._id, name: materials[3].name, quantity: 0.5 }
                ],
                artisan: artisanId
            },
            {
                name: "Carved Wooden Bowl",
                description: "Deep carved teak wood bowl, polished with natural oils.",
                price: 2500,
                quantity: 5,
                category: "Woodwork",
                materialsUsed: [
                    { materialId: materials[1]._id, name: materials[1].name, quantity: 3 }
                ],
                artisan: artisanId
            },
            {
                name: "Silk Saree",
                description: "Fine hand-woven silk saree with traditional patterns.",
                price: 5000,
                quantity: 3,
                category: "Textiles",
                materialsUsed: [
                    { materialId: materials[2]._id, name: materials[2].name, quantity: 5 }
                ],
                artisan: artisanId
            }
        ]);
        console.log("Products added");

        // 5. Add Sample Sales (distributed over 6 months)
        const salesData = [];
        for (let i = 0; i < 6; i++) {
            const saleDate = new Date(now.getFullYear(), now.getMonth() - i, Math.floor(Math.random() * 25) + 1);
            const product = products[Math.floor(Math.random() * products.length)];
            const qty = Math.floor(Math.random() * 3) + 1;
            
            salesData.push({
                productId: product._id,
                productName: product.name,
                price: product.price * qty,
                quantity: qty,
                category: product.category,
                artisan: artisanId,
                date: saleDate
            });
        }
        
        // Add a few more recent ones
        salesData.push({
            productId: products[0]._id,
            productName: products[0].name,
            price: products[0].price,
            quantity: 1,
            category: products[0].category,
            artisan: artisanId,
            date: new Date()
        });

        await Sales.insertMany(salesData);
        console.log("Sales added");

        console.log("Data population complete!");
        process.exit(0);
    } catch (error) {
        console.error("Error populating data:", error);
        process.exit(1);
    }
};

populate();
