import express from 'express'
import { AddProduct } from '../Controller/Products/Crud_products.js'
const productRouter = express.Router()
productRouter.post('/addproduct', AddProduct)

export default productRouter

