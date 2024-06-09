const { sum, fetchData } = require('../main.js');

describe('sum', () => {
  test('should return the sum of two positive numbers', () => {
    // Arrange
    const a = 5;
    const b = 3;

    // Act
    const result = sum(a, b);

    // Assert
    expect(result).toBe(8);
  });

  test('should return the sum of two negative numbers', () => {
    // Arrange
    const a = -5;
    const b = -3;

    // Act
    const result = sum(a, b);

    // Assert
    expect(result).toBe(-8);
  });

  test('should return the sum of zero and a number', () => {
    // Arrange
    const a = 0;
    const b = 5;

    // Act
    const result = sum(a, b);

    // Assert
    expect(result).toBe(5);
  });

  test('should return the sum of two floating point numbers', () => {
    // Arrange
    const a = 1.5;
    const b = 2.3;

    // Act
    const result = sum(a, b);

    // Assert
    expect(result).toBeCloseTo(3.8);
  });

  test('should throw an error when the first argument is a string', () => {
    // Arrange
    const a = '5';
    const b = 3;

    // Act and Assert
    expect(() => sum(a, b)).toThrow("Args should not be 'string'");
  });

  test('should throw an error when the second argument is a string', () => {
    // Arrange
    const a = 5;
    const b = '3';

    // Act and Assert
    expect(() => sum(a, b)).toThrow("Args should not be 'string'");
  });

  test('should throw an error when both arguments are strings', () => {
    // Arrange
    const a = '5';
    const b = '3';

    // Act and Assert
    expect(() => sum(a, b)).toThrow("Args should not be 'string'");
  });
});

describe('API', () => {
  test('should log the data after 2 sec', (done) => {
    const callback = (data) => {
      try {
        expect(data).toBe('Done! here i your data');
        done();
      } catch (error) {
        done(error);
      }
    };

    fetchData(callback);
  });
});
