import { connectToDatabase, getProduct, allProducts } from '../db/connect.js';
import { isNumber } from '../functions/index.js';

const pool2 = await connectToDatabase();

const getAllProductsStatic = async (req, res) => {
  let { page, limit, fields, orderBy } = req.query;

  fields = fields ? fields.split(',') : ['*'];
  const validFields = [
    'id',
    'name',
    'company',
    'price',
    'featured',
    'created_at',
    '*',
  ];
  for (const field of fields) {
    if (!validFields.includes(field)) {
      throw new Error(`Invalid field: ${field}`);
    }
  }

  if (!isNumber(page) && typeof page === 'string') {
    page = parseInt(page);
  }

  if (!isNumber(limit) && typeof limit === 'string') {
    limit = parseInt(limit);
  }

  if (typeof orderBy === 'string') {
    orderBy = orderBy.split(',');
  }

  // By default, it is already sorting by id,
  // but if the user specifies a sort option,
  // we will add id by default cuz we want it deterministically
  if (
    // so if the user specifies a sort options, an there is no id in it:
    typeof orderBy === 'string' &&
    !orderBy.includes('id') &&
    !orderBy.includes('-id')
  ) {
    orderBy += ['id'];
  }

  // TODO: Deciding to add this or remove it
  // if the user doesn't specify any sort option, we will add it
  // else if (typeof orderBy === 'undefined') {
  //   orderBy = ['id'];
  // }

  const products = await allProducts(pool2, fields, page, limit, orderBy);
  return res.status(200).json({ length: products.length, products });
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
    throw new Error(
      'Invalid request, please provide id, company name, featured state, or product name'
    );
  }
};

export { getAllProductsStatic, getAllProducts };
