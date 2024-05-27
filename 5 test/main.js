const sum = (a, b) => {
  if (typeof a == 'string' || typeof b == 'string') {
    throw new Error("Args should not be 'string'");
  }
  return a + b;
};

module.exports = sum;
