function isBool(bool) {
  let t = [true, false, 1, 0];
  return t.includes(bool);
}

function isNumber(number) {
  return typeof number === 'number' && !isNaN(number);
}

export { isBool, isNumber };
