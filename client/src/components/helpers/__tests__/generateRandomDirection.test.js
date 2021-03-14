import { generateRandomDirection } from "../gridModule";
import { DIRECTIONS } from "../../../constants";

//should have direction either "N", "E", "S", "W", "NE", "NW", "SE", "SW"
//having trouble making jest = one of the array of values

test("should generate proper direction", () => {
  expect(generateRandomDirection(["N"])).toEqual("N");
});
