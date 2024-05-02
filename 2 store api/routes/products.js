import { Router } from 'express';
import { getAllProducts } from '../controllers/products.js';

const productsRouter = Router();

productsRouter.route('/').get(getAllProducts);

export { productsRouter };
