import { allProducts, connectToDatabase } from '../db/connect.js';

const pool = await connectToDatabase();

const getAllProductsStatic = async (req, res) => {
  const products = await allProducts(pool);
  return res.status(200).json({ total: products.length, products });
};

const getAllProducts = async (req, res) => {
  res.status(200).json({ msg: 'Products route' });
};

export { getAllProductsStatic, getAllProducts };
