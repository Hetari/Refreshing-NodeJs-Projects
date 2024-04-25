const getAllProductsStatic = async (req, res) => {
  res.status(200).json({ msg: 'Products testing route' });
};

const getAllProducts = async (req, res) => {
  throw new Error('Test error');
  res.status(200).json({ msg: 'Products route' });
};

export { getAllProductsStatic, getAllProducts };
