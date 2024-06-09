const sum = (a, b) => {
  if (typeof a == 'string' || typeof b == 'string') {
    throw new Error("Args should not be 'string'");
  }
  return a + b;
};

const fetchData = (callback) => {
  setTimeout(() => {
    callback('Done! here i your data');
  }, 2000);
};

module.exports = {
  sum,
  fetchData,
};
