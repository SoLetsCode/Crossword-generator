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
  const [wordList, setWordList] = useState(defaultWordList);
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
    putWordInGrid();
    let tempWord = tempWordList.pop();
  };

  const putWordInGrid = (word) => {
    let directions = [...DIRECTIONS];
    let tempPosition = generateRandomPos();
    let tempDirection = generateRandomDirection(directions);
    debugger;
    switch (tempDirection) {
      case "N":
        break;
      case "E":
        break;
      case "S":
        break;
      case "W":
        break;
      case "NE":
        break;
      case "NW":
        break;
      case "SE":
        break;
      case "SW":
        break;
      default:
    }
  };

  const generateRandomPos = async () => {
    let x, y;
    let attempts = 0;
    do {
      x = generateRandomNum(ROWS);
      y = generateRandomNum(COLUMNS);
      attempts++;
      console.log(attempts);
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
  //create react components
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
