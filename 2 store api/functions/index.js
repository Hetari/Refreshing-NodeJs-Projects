function isBool(bool) {
  let t = [true, false, 1, 0];
  return t.includes(bool);
}

function isNumber(number) {
  return typeof number === 'number' && !isNaN(number);
}

const sortingBy = (sql, sortBy) => {
  // Add order by clause
  sql += ' ORDER BY ';

  // Loop through sortBy options
  for (let i = 0; i < sortBy.length; i++) {
    // Get sort order, if there is negative sign, it's descending
    let sortOrder = sortBy[i].startsWith('-') ? 'DESC' : 'ASC';

    // Get sort option without negative sign
    let sortByField = sortOrder === 'DESC' ? sortBy[i].substring(1) : sortBy[i];

    // Validate sortByField to prevent SQL injection
    const validSortFields = ['id', 'price', 'name', 'created_at', 'name'];
    if (!validSortFields.includes(sortByField)) {
      throw new Error('Invalid sort field');
    }

    // Add sort option into the sql query
    sql += `${sortByField} ${sortOrder},`;
  }

  // remove last comma, and return the query
  sql = sql.slice(0, -1);
  return sql;
};

const validateOptions = (options) => {
  if (!options || typeof options !== 'object') {
    throw new Error('Options should be an object');
  }

  if (Object.keys(params).length === 0) {
    throw new Error('No options provided');
  }

  const params = {};

  if (options.id !== undefined) {
    if (typeof options.id !== 'string' || isNaN(options.id))
      throw new Error('Id should be a string');
    params.id = options.id;
  }

  if (options.name !== undefined) {
    if (typeof options.name !== 'string')
      throw new Error('name should be a string');

    params.name = options.name;
  }

  if (options.company !== undefined) {
    if (typeof options.company !== 'string')
      throw new Error('Company should be a string');

    params.company = options.company;
  }

  if (options.featured !== undefined) {
    if (!isBool(options.featured))
      throw new Error('Featured should be a boolean or an integer (0 or 1)');

    params.featured = options.featured;
  }

  return params;
};

export { isBool, isNumber, sortingBy, validateOptions };
