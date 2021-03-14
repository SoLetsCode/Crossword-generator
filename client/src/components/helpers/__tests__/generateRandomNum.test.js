import { generateRandomNum } from "../gridModule";

test("number should be within range", () => {
  for (let i = 0; i < 10; i++) {
    const value = generateRandomNum(10);
    expect(value).toBeGreaterThanOrEqual(0);
    expect(value).toBeLessThanOrEqual(10);
  }
});

test("if range is not a number throw error", () => {
  expect(() => {
    generateRandomNum("hello");
  }).toThrowError("range must be a number");
});
