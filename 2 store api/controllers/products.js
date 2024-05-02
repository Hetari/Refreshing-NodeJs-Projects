import { connectToDatabase, getProduct, allProducts } from '../db/connect.js';
import { isNumber } from '../functions/index.js';

const pool2 = await connectToDatabase();

const getAllProducts = async (req, res) => {
  let { page, limit, fields, numericFilter, orderBy } = req.query;

  // numericFilter validation
  let filter = '';

  if (numericFilter) {
    filter = numericFilter.split(/([,<>=\s]+)/);
  }

  if (filter.length !== 3) {
    throw new Error('Invalid numeric filter');
  }

  // Validate fields (select fields from)
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

  const products = await allProducts(
    pool2,
    fields,
    page,
    limit,
    orderBy,
    filter
  );
  return res.status(200).json({ length: products.length, products });
};

export { getAllProducts };
