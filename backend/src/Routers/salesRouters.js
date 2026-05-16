import express from 'express';
import { AddSale, GetSales, GetSalesStats, ExportSales } from '../Controller/Sales/salesController.js';
import { GetProducts } from '../Controller/Products/Crud_products.js';
import protect from '../middleware/authMiddle.js';

const salesRouter = express.Router();

salesRouter.post('/', protect, AddSale);
salesRouter.get('/all', protect, GetSales);
salesRouter.get('/stats', protect, GetSalesStats);
salesRouter.get('/products', protect, GetProducts);
salesRouter.get('/export', protect, ExportSales);

export default salesRouter;
