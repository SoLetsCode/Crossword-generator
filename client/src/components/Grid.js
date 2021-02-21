import React, { useState, useEffect } from "react";

import { Button, Container, Col, Row } from "reactstrap";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { Input, Form, FormGroup, Label } from "reactstrap";

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
  "impossible",
  "mission",
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

const API_PATH = "https://api.datamuse.com/words";

function Grid() {
  const [wordList, setWordList] = useState(
    defaultWordList.map((word) => word.toUpperCase())
  );
  const [grid, setGrid] = useState(null);
  const [solutionGrid, setSolutionGrid] = useState([[]]);
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);

  //for Form
  const [theme, setTheme] = useState("");
  const [maxWords, setMaxWords] = useState(15);
  const [minLength, setMinLength] = useState(5);

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
    return tempGrid;
  };

  const generateCrosswordClicked = () => {
    putWordsInGrid();
  };

  const resetCrosswordClicked = () => {
    generateGrid();
  };

  const formSubmit = async (e) => {
    e.preventDefault();
    let maxWords = e.target.maxWords.value || 10;
    let theme = e.target.theme.value;
    let minLength = parseInt(e.target.minLength.value);
    setLoading(!loading);

    setTheme(theme);
    setMaxWords(maxWords);
    setMinLength(minLength);

    fetch(`${API_PATH}?ml=${theme}&max=${1000}`)
      .then((response) => response.json())
      .then((data) => {
        let myWords = data.map((word) => word.word);
        myWords = wordlistFormatter(myWords, {
          minLength,
          numOfWords: maxWords,
        });
        console.log(myWords);
        setWordList(myWords);
        toggleModal();
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.error(error);
      })
      .finally(putWordsInGrid());
  };

  const toggleModal = () => {
    setModal(!modal);
  };

  const fillWithRandom = (myGrid) => {
    //create a new copy of grid
    let tempGrid = copyGrid(myGrid);

    //run through tempGrid and change blank values
    for (let x = 0; x < COLUMNS; x++) {
      for (let y = 0; y < ROWS; y++) {
        if (tempGrid[x][y] === 0) {
          tempGrid[x][y] = alphabet[generateRandomNum(alphabet.length)];
        }
      }
    }

    return tempGrid;
  };

  const wordlistFormatter = (wordlist, { minLength = 0, numOfWords = 10 }) => {
    let finalWordList = [];
    let result = wordlist.filter(
      (word) =>
        word.split(" ").length === 1 &&
        word.length > minLength &&
        word.length < ROWS &&
        word.length < COLUMNS
    );

    for (
      let count = 0;
      count < numOfWords && result.length > numOfWords;
      count++
    ) {
      let index = generateRandomNum(result.length);
      finalWordList.push(result[index]);
      result = result.slice(0, index).concat(result.slice(index + 1));
    }

    finalWordList = finalWordList.map((word) => word.toUpperCase());

    return finalWordList;
  };

  const putWordsInGrid = (count = 0) => {
    if (grid === null) {
      console.log("WAIT");
      return;
    }
    let myGrid = generateGrid();
    let tempWordList = [...wordList];
    console.log(`running ${count} times`);

    if (count > 100) {
      alert(
        `after ${count} tries unable to find a working crossword puzzle, please try with a different set of words`
      );
      return;
    }

    for (let word of tempWordList) {
      let attempts = 0;
      while (true) {
        attempts++;
        let result = putWordInGrid(myGrid, word);

        if (attempts > COLUMNS * ROWS) {
          console.log(
            `Too many attempts. ${word} input failed after ${attempts} tries`
          );
          putWordsInGrid(count + 1);
          throw `Too many attempts. ${word} input failed after ${attempts} tries`;
        } else if (result) {
          myGrid = result;
          break;
        }
      }
    }
    setSolutionGrid(myGrid);
    console.table(myGrid);
    myGrid = fillWithRandom(myGrid);
    console.table(myGrid);
    setGrid(myGrid);
  };

  const putWordInGrid = (myGrid, word, debug = false) => {
    let directions = [...DIRECTIONS];
    let { x, y } = generateRandomPos(myGrid, word);
    let tempDirection = generateRandomDirection(directions);
    let tempGrid = myGrid;
    if (debug) {
      console.log(`x is ${x}`);
      console.log(`y is ${y}`);
      console.log(`direction is ${tempDirection}`);
      console.log(
        `${word} fits ? ${checkIfWordFits(
          tempGrid,
          tempDirection,
          wordList[0],
          x,
          y
        )}`
      );
    }
    if (checkIfWordFits(tempGrid, tempDirection, word, x, y)) {
      return copyGrid(
        checkIfWordFits(tempGrid, tempDirection, word, x, y, true)
      );
    }
    return false;
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
      return copyGrid(myGrid);
    }
  };

  const generateRandomPos = (myGrid, word) => {
    let choices = [];
    let position = {};

    //create list of possible choices good candidate for useMemo();
    for (let y = 0; y < COLUMNS; y++) {
      for (let x = 0; x < ROWS; x++) {
        if (myGrid[y][x] === 0 || myGrid[y][x] === word[0]) {
          choices.push({ x, y });
        }
      }
    }

    position = { ...choices[generateRandomNum(choices.length)] };
    return { ...position };
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
    return wordList.map((word) => <div className="text-center">{word}</div>);
  };

  const createWordSearchGrid = () => {
    if (grid === null) {
      return;
    }
    return (
      <Container className="wordsearch__container">
        {grid.map((col) => (
          <Row>
            {col.map((letter) => (
              <Col>{letter}</Col>
            ))}
          </Row>
        ))}
      </Container>
    );
  };

  if (loading) {
    return <div>Loading</div>;
  }

  return (
    <div>
      <Container className="d-flex justify-content-center">
        <Button onClick={generateCrosswordClicked}>GENERATE CROSSWORD</Button>
        <Button onClick={toggleModal}>Set Theme For Words</Button>
      </Container>
      <Container>
        <Col className="text-center">{theme.toUpperCase()}</Col>
      </Container>
      {createWordSearchGrid()}
      <div className="text-center">==========WORDLIST==========</div>
      {createWordList()}
      <div>
        Words supplied by Datamuse{" "}
        <a href="https://www.datamuse.com/api/">
          https://www.datamuse.com/api/
        </a>
      </div>
      <Modal isOpen={modal} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Set your word theme</ModalHeader>
        <Form onSubmit={(e) => formSubmit(e)}>
          <ModalBody>
            <FormGroup>
              <Label for="word-theme">Word Theme</Label>
              <Input
                type="text"
                name="theme"
                id="word-theme"
                placeholder="Insert Theme"
                defaultValue={theme}
              />
            </FormGroup>
            <FormGroup>
              <Label for="num_of_words">Max Number of Words</Label>
              <Input
                type="number"
                name="maxWords"
                id="num_of_words"
                defaultValue={maxWords}
              />
            </FormGroup>
            <FormGroup>
              <Label for="length_of_words">Minimum Word Length</Label>
              <Input
                type="number"
                name="minLength"
                id="length_of_words"
                defaultValue={minLength}
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button>Submit</Button>
            <Button onClick={toggleModal}>Cancel</Button>
          </ModalFooter>
        </Form>
      </Modal>
    </div>
  );
}

export default Grid;
