import { connectToDatabase, getProductById } from '../db/connect.js';

const pool2 = await connectToDatabase();

const getAllProductsStatic = async (req, res) => {
  const product = await getProductById(pool2, '1036');
  return res.status(200).json(product[0]);
};

const getAllProducts = async (req, res) => {
  res.status(200).json({ msg: 'Products route' });
};

export { getAllProductsStatic, getAllProducts };
