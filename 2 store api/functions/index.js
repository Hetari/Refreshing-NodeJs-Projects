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

export { isBool, isNumber, sortingBy };
