import express from 'express'
import { AddProduct, GetProducts, UpdateProduct, DeleteProduct } from '../Controller/Products/Crud_products.js'
import protect from '../middleware/authMiddle.js'
const productRouter = express.Router()
productRouter.post('/addproduct', protect, AddProduct)
productRouter.get('/all', protect, GetProducts)
productRouter.put('/:id', protect, UpdateProduct)
productRouter.delete('/:id', protect, DeleteProduct)

export default productRouter

