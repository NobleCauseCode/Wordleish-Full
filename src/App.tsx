import axios from 'axios';
import { useState, useEffect } from 'react';
import './App.css';
import { WordInput } from './Components/WordInput';
import { getGuessList } from './data/GuessList';
import { Guess } from './Models/Guess';
import { GuessDetail } from './Models/GuessDetail';

interface ElementWithFocus extends Element {
  focus(): void;
}

const MAX_GUESSES = 5;

function App() {
  const [wordList, setWordList] = useState([]);
  const [selectedWord, setSelectedWord] = useState('');
  const [gameBoard, setGameBoard] = useState({} as Map<number, Guess>);
  const [currentGuessNumber, setCurrentGuessNumber] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isWinner, setIsWinner] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (wordList.length === 0) {
        const response = await axios.get('http://localhost:3000/data/words.txt');
        const words = response.data;
        const converted = words.split('\r\n').map((word: string) => word.toLowerCase());
        const randomIndex = Math.floor(Math.random() * converted.length);
        setSelectedWord(converted[randomIndex]);
        setWordList(converted);
      }
    };
    const guessList = getGuessList();
    setGameBoard(guessList);
    init();
  }, [wordList]);

  const updateGuess = (value: string, x: number, y: number) => {
    const updatedGuesses = new Map<number, Guess>(gameBoard);
    let updateGuess = updatedGuesses.get(x);
    if (updateGuess) {
      updateGuess.items[y] = {
        position: y,
        value,
      } as GuessDetail;
    }
    setGameBoard(updatedGuesses);
    const nextField = document.querySelector(`input[name=guess-${parseInt(x.toString())}-${parseInt((y + 1).toString())}]`);
    (nextField as ElementWithFocus)?.focus();
  };

  const getValue = (x: number, y: number) => {
    const guess = gameBoard.get(x);
    if (guess) {
      const guessDetail = guess.items[y];
      if (guessDetail) {
        return guessDetail.value;
      }
    }
    return '';
  };

  const gradeIt = () => {
    const guessesCopy = new Map<number, Guess>(gameBoard);
    const currentGuess = guessesCopy.get(currentGuessNumber);
    if (currentGuess) {
      // correct guesses
      for (let i = 0; i < selectedWord.length; i++) {
        if (getValue(currentGuessNumber, i) === selectedWord[i]) {
          console.log(`CORRECT! - ${i}`);
          currentGuess.items[i].isCorrect = true;
          currentGuess.items[i].css = 'bg-correct-answer';
        }

        // is the letter in the word?
        if (selectedWord.includes(getValue(currentGuessNumber, i)) && !currentGuess.items[i].isCorrect) {
          console.log(`Wrong Place! - ${i}`);
          currentGuess.items[i].notInPlace = true;
          currentGuess.items[i].css = 'bg-wrong-place';
        }

        // is the letter not in the word at all?
        if (!selectedWord.includes(getValue(currentGuessNumber, i))) {
          console.log(`Not in word! - ${i}`);
          currentGuess.items[i].notInAnswer = true;
          currentGuess.items[i].css = 'bg-wrong-answer';
        }

        // do we have a winner?
        if (currentGuess.items.filter((item) => item.isCorrect).length === selectedWord.length) {
          console.log('WINNER!');
          currentGuess.isWinner = true;
          setIsWinner(true);
          setIsGameOver(true);
          setCurrentGuessNumber(-1);
          return;
        }
      }
      setGameBoard(guessesCopy);
      setIsGameOver(currentGuessNumber >= MAX_GUESSES);
      setCurrentGuessNumber(currentGuessNumber + 1);
    }
  };

  return (
    <div className='container mx-auto py-4 px-s'>
      <div className='flex flex-col items-center justify-center'>
        <h1 className='font-medium leading-tight text-4xl mt-0 mb-2 text-black-600'>WORDLEISH</h1>
      </div>
      {/* <div className='flex items-center justify-center'>{selectedWord}</div> */}
      <div className='flex flex-col items-center justify-center'>
        <div className='grid grid-cols-5 grid-rows-6 gap-4'>
          {
            /* loop through a gameboard 5x6 grid
              create an input box for letter guesses
              Map<number, Guess>
              0-5 = turns (tries)
              0-4 = guessDetails for each letter of that turn
          */
            gameBoard &&
              gameBoard.size > 0 &&
              Array.from(gameBoard.keys()).map((key) => {
                return gameBoard.get(key)?.items.map((detail) => {
                  return (
                    <WordInput
                      isDisabled={currentGuessNumber !== key}
                      key={`${key}-${detail.position}`}
                      x={key}
                      y={detail.position}
                      css={detail.css}
                      updateGuess={updateGuess}
                      getValue={getValue}
                    />
                  );
                });
              })
          }
        </div>
        {isGameOver && isWinner && (
          <div>
            <h1 className='font-medium leading-tight text-4xl my-4 text-purple-600'>YOU WIN!!!!!!!!!!!!!</h1>
          </div>
        )}
        {isGameOver && !isWinner && (
          <div>
            <h1 className='font-medium leading-tight text-4xl  my-4 text-red-600'>YOU LOST, YOU SUCK AT THIS GAME!</h1>
          </div>
        )}
        <button
          className='mt-2 ml-2 border-1 border-white bg-white text-spotify-darker font-med font-semibold p-1 rounded h-10 w-28 hover:bg-light-grey'
          onClick={gradeIt}
        >
          Guess
        </button>
      </div>
    </div>
  );
}

export default App;
