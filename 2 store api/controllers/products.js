import { connectToDatabase, getProduct } from '../db/connect.js';

const pool2 = await connectToDatabase();

const getAllProductsStatic = async (req, res) => {
  return res.status(200).json({ msg: 'Products route' });
};

const getAllProducts = async (req, res) => {
  const params = req.body;

  if (
    'id' in params ||
    'company' in params ||
    'featured' in params ||
    'name' in params
  ) {
    const product = await getProduct(pool2, params);
    return res
      .status(200)
      .json({ len: product[0].length, product: product[0] });
  } else {
    throw new Error('Invalid request, please provide id, company or featured');
  }
};

export { getAllProductsStatic, getAllProducts };
