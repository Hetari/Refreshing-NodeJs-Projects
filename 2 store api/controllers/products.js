import { connectToDatabase, getProduct } from '../db/connect.js';

const pool2 = await connectToDatabase();

const getAllProductsStatic = async (req, res) => {
  const params = req.body;

  if ('id' in params || 'company' in params || 'featured' in params) {
    const product = await getProduct(pool2, params);
    return res
      .status(200)
      .json({ len: product[0].length, product: product[0] });
  } else {
    throw new Error('Invalid request, please provide id, company or featured');
  }
};

const getAllProducts = async (req, res) => {
  res.status(200).json({ msg: 'Products route' });
};

export { getAllProductsStatic, getAllProducts };
