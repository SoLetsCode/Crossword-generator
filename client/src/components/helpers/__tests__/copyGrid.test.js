import { copyGrid } from "../gridModule";

const grid = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

test("should return copy of array", () => {
  expect(copyGrid(grid)).toEqual([
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ]);
});

test("should be a completely new array", () => {
  expect(copyGrid(grid)).not.toBe(grid);
});
