import { Router } from 'express';
import {
  getAllProductsStatic,
  getAllProducts,
} from '../controllers/products.js';

const productsRouter = Router();

productsRouter.route('/').get(getAllProducts);

productsRouter.route('/static').get(getAllProductsStatic);

export { productsRouter };
