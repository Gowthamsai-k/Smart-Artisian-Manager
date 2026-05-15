import express from 'express'
const productRouter = express.Router()
productRouter.post('/addproduct', AddProduct)

export default productRouter

