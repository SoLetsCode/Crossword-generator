import React, { useState, useEffect } from "react";

import { Button, Col } from "reactstrap";

const defaultWordList = [
  "pigeon",
  "suppress",
  "singer",
  "casualty",
  "curriculum",
  "vacuum",
  "jurisdiction",
  "translate",
  "organize",
  "printer",
];

const alphabet = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

const DIRECTIONS = ["N", "E", "S", "W", "NE", "NW", "SE", "SW"];

const ROWS = 15;
const COLUMNS = 15;

function Grid() {
  const [wordList, setWordList] = useState(
    defaultWordList.map((word) => word.toUpperCase())
  );
  const [grid, setGrid] = useState(null);

  useEffect(() => {
    generateGrid();
  }, []);

  const generateGrid = () => {
    let tempGrid = [];
    for (let x = 0; x < COLUMNS; x++) {
      tempGrid.push([]);
      for (let y = 0; y < ROWS; y++) {
        tempGrid[x][y] = 0;
      }
    }
    setGrid(tempGrid);
  };

  const generateCrosswordClicked = async () => {
    await putWordsInGrid();
    // await fillWithRandom();
  };

  const resetCrosswordClicked = () => {
    generateGrid();
  };

  const fillWithRandom = async () => {
    //create a new copy of grid
    let tempGrid = copyGrid(grid);

    //run through tempGrid and change blank values
    for (let x = 0; x < COLUMNS; x++) {
      for (let y = 0; y < ROWS; y++) {
        if (tempGrid[x][y] === 0) {
          tempGrid[x][y] = alphabet[generateRandomNum(alphabet.length)];
        }
      }
    }

    setGrid(tempGrid);

    return;
  };

  const putWordsInGrid = async () => {
    if (grid === null) {
      console.log("WAIT");
      return;
    }

    let tempWordList = [...wordList];
    putWordInGrid(tempWordList[0]);
  };

  const putWordInGrid = (word) => {
    let directions = [...DIRECTIONS];
    let { x, y } = generateRandomPos();
    let tempDirection = generateRandomDirection(directions);
    let tempGrid = copyGrid(grid);
    console.log(`x is ${x}`);
    console.log(`y is ${y}`);
    console.log(tempDirection);
    setGrid(tempGrid);
    console.log(checkIfWordFits(tempGrid, tempDirection, wordList[0], x, y));
    if (checkIfWordFits(tempGrid, tempDirection, wordList[0], x, y)) {
      checkIfWordFits(tempGrid, tempDirection, wordList[0], x, y, true);
    }

    setGrid(tempGrid);
  };

  const checkIfWordFits = (tempGrid, direction, word, x, y, write = false) => {
    //checks if word fits and works in grid. returns false if it doesn't work.
    //if in write mode (boolean) then write the word into grid and return grid
    let result = true;
    let myGrid = copyGrid(tempGrid);
    switch (direction) {
      case "N":
        if (y - word.length < 0) {
          return false;
        }
        for (let count = 0; count < word.length; count++) {
          if (
            myGrid[y - count][x] !== 0 &&
            myGrid[y - count][x] !== word[count]
          ) {
            result = false;
          }

          if (write) {
            myGrid[y - count][x] = word[count];
          }
        }
        break;
      case "E":
        if (x + word.length >= COLUMNS) {
          return false;
        }
        for (let count = 0; count < word.length; count++) {
          if (
            myGrid[y][x + count] !== 0 &&
            myGrid[y][x + count] !== word[count]
          ) {
            result = false;
          }
          if (write) {
            myGrid[y][x + count] = word[count];
          }
        }
        break;
      case "S":
        if (y + word.length >= ROWS) {
          return false;
        }
        for (let count = 0; count < word.length; count++) {
          if (
            myGrid[y + count][x] !== 0 &&
            myGrid[y + count][x] !== word[count]
          ) {
            result = false;
          }

          if (write) {
            myGrid[y + count][x] = word[count];
          }
        }
        break;
      case "W":
        if (x - word.length < 0) {
          return false;
        }
        for (let count = 0; count < word.length; count++) {
          if (
            myGrid[y][x - count] !== 0 &&
            myGrid[y][x - count] !== word[count]
          ) {
            result = false;
          }
          if (write) {
            myGrid[y][x - count] = word[count];
          }
        }
        break;
      case "NE":
        if (y - word.length < 0 || x + word.length >= COLUMNS) {
          return false;
        }
        for (let count = 0; count < word.length; count++) {
          if (
            myGrid[y - count][x + count] !== 0 &&
            myGrid[y - count][x + count] !== word[count]
          ) {
            result = false;
          }
          if (write) {
            myGrid[y - count][x + count] = word[count];
          }
        }
        break;
      case "NW":
        if (y - word.length < 0 || x - word.length < 0) {
          return false;
        }
        for (let count = 0; count < word.length; count++) {
          if (
            myGrid[y - count][x - count] !== 0 &&
            myGrid[y - count][x - count] !== word[count]
          ) {
            result = false;
          }
          if (write) {
            myGrid[y - count][x - count] = word[count];
          }
        }
        break;
      case "SE":
        if (y + word.length >= ROWS || x + word.length >= COLUMNS) {
          return false;
        }
        for (let count = 0; count < word.length; count++) {
          if (
            myGrid[y + count][x + count] !== 0 &&
            myGrid[y + count][x + count] !== word[count]
          ) {
            result = false;
          }
          if (write) {
            myGrid[y + count][x + count] = word[count];
          }
        }
        break;
      case "SW":
        if (y + word.length >= ROWS || x - word.length < 0) {
          return false;
        }
        for (let count = 0; count < word.length; count++) {
          if (
            myGrid[y + count][x - count] !== 0 &&
            myGrid[y + count][x - count] !== word[count]
          ) {
            result = false;
          }
          if (write) {
            myGrid[y + count][x - count] = word[count];
          }
        }

        break;
      default:
    }
    if (!write) {
      return result;
    } else {
      console.table(myGrid);
      return myGrid;
    }
  };

  const generateRandomPos = () => {
    let x, y;
    let attempts = 0;
    do {
      x = generateRandomNum(COLUMNS);
      y = generateRandomNum(ROWS);
      attempts++;
    } while (grid[x][y] !== 0 && attempts <= ROWS * COLUMNS);

    if (attempts >= ROWS * COLUMNS) {
      console.log(`${attempts} attempts made. Unable to find position`);
      throw `${attempts} attempts made. Unable to find position`;
    }
    return { x, y };
  };

  const generateRandomDirection = (directions) => {
    return DIRECTIONS[generateRandomNum(DIRECTIONS.length)];
  };

  const generateRandomNum = (range = 0) => {
    if (!Number.isInteger(range)) {
      throw "range must be a number";
    }
    return Math.floor(Math.random() * range);
  };

  const copyGrid = (grid) => {
    let tempGrid = [];
    for (let col = 0; col < COLUMNS; col++) {
      tempGrid.push([...grid[col]]);
    }
    return tempGrid;
  };

  //react component creators
  const createWordList = () => {
    return wordList.map((word) => <div>{word}</div>);
  };

  const createWordSearchGrid = () => {
    if (grid === null) {
      return;
    }
    return grid.map((col) => (
      <div className="d-flex">
        {col.map((letter) => (
          <Col>{letter}</Col>
        ))}
      </div>
    ));
  };

  return (
    <div>
      <Button onClick={generateCrosswordClicked}>GENERATE CROSSWORD</Button>
      <Button onClick={resetCrosswordClicked}>RESET</Button>
      {createWordSearchGrid()}
      <div>wordList</div>
      {createWordList()}
    </div>
  );
}

export default Grid;
