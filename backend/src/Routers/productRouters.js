import express from 'express'
import { AddProduct, GetProducts, UpdateProduct, DeleteProduct } from '../Controller/Products/Crud_products.js'
const productRouter = express.Router()
productRouter.post('/addproduct', AddProduct)
productRouter.get('/all', GetProducts)
productRouter.put('/:id', UpdateProduct)
productRouter.delete('/:id', DeleteProduct)

export default productRouter

