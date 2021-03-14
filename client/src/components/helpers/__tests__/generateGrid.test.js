import { generateGrid } from "../gridModule";

const rows = 5;
const columns = 4;

test("grid should have 5 rows and 4 columns", () => {
  const grid = generateGrid(rows, columns);
  expect(grid.length).toBe(rows);
  expect(grid[0].length).toBe(columns);
});
