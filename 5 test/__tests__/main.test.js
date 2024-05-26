import { sum } from '../main';

test('adds 1 + 2 to = 3', () => {
  expect(sum(1, 2).toBe(3));
});

test('adds -1 + -2 to = -3', () => {
  expect(sum(-1, -2).toBe(-3));
});

test('adds 1 + -2 to = -1', () => {
  expect(sum(1, -2).toBe(-1));
});

test('adds 1 + 2 to and throw error', () => {
  expect(sum('1', '2').toThrow());
});

test('adds 1 + 2 to and throw error', () => {
  expect(sum(1, '2').toThrow());
});

test('adds 1 + 2 to and throw error', () => {
  expect(sum('1', 2).toThrow());
});
