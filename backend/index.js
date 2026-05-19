import express from 'express'
import dotenv from 'dotenv'
dotenv.config()

import cors from 'cors'
import authRoutes from './src/Routers/authRouters.js'
import connectDB from './src/db/db.js'
import materialRouter from './src/Routers/materialRouters.js'
import productRoutes from './src/Routers/productRouters.js'
import salesRouter from './src/Routers/salesRouters.js'
import aiRouter from './src/Routers/aiRouters.js'
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config()
connectDB()

const app = express()
app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}))
app.use(express.json())

// Request Logger
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});





app.use('/api/auth', authRoutes)
app.use('/api/material', materialRouter)
app.use('/api/products', productRoutes)
app.use('/api/sales', salesRouter)
app.use('/api/ai', aiRouter)

// Serve frontend static assets in production
const frontendDist = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendDist));

// Wildcard route to serve React's index.html for client-side routing
app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
        return next();
    }
    res.sendFile(path.join(frontendDist, 'index.html'), (err) => {
        if (err) {
            next();
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})
