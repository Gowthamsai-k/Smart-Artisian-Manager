import express from 'express';
import { AddSale, GetSales, GetSalesStats } from '../Controller/Sales/salesController.js';
import { GetProducts } from '../Controller/Products/Crud_products.js';

const salesRouter = express.Router();

salesRouter.post('/', AddSale);
salesRouter.get('/all', GetSales);
salesRouter.get('/stats', GetSalesStats);
salesRouter.get('/products', GetProducts);

export default salesRouter;
