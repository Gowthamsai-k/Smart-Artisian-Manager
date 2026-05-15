import express from 'express'

import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './src/Routers/authRouters.js'
import connectDB from './src/db/db.js'

dotenv.config()
connectDB()

const app = express()
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}))
app.use(express.json())


app.get('/', (req, res) => {
    res.status(200).send('hello world')
})

app.use('/api/auth', authRoutes)

app.listen(3000, () => {
    console.log("server is running on port 3000")
})
