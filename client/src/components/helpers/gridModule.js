import * as constants from "../../constants";

const copyGrid = (grid) => {
  let tempGrid = [];
  for (let col = 0; col < grid.length; col++) {
    tempGrid.push([...grid[col]]);
  }
  return tempGrid;
};

const fillWithRandom = (myGrid) => {
  //create a new copy of grid
  let tempGrid = copyGrid(myGrid);

  //run through tempGrid and change blank values
  for (let y = 0; y < myGrid.length; y++) {
    for (let x = 0; x < myGrid[0].length; x++) {
      if (tempGrid[y][x] === 0) {
        tempGrid[y][x] =
          constants.ALPHABET[generateRandomNum(constants.ALPHABET.length)];
      }
    }
  }

  return tempGrid;
};

const generateGrid = (rows, columns) => {
  let tempGrid = [];
  for (let x = 0; x < rows; x++) {
    tempGrid.push([]);
    for (let y = 0; y < columns; y++) {
      tempGrid[x][y] = 0;
    }
  }
  return tempGrid;
};

const generateRandomDirection = (directions) => {
  return directions[generateRandomNum(directions.length)];
};

const generateRandomNum = (range = 0) => {
  if (!Number.isInteger(range)) {
    throw "range must be a number";
  }
  return Math.floor(Math.random() * range);
};

export {
  copyGrid,
  fillWithRandom,
  generateGrid,
  generateRandomDirection,
  generateRandomNum,
};
