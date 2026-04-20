
export const possibleWords = ["apple", "world", "words", "return"];

export const randomIndex = Math.floor(Math.random() * possibleWords.length);

export const targetWord = possibleWords[randomIndex];

export async function getRandomWord() {
  const response = await fetch(
    "https://random-word-api.herokuapp.com/word?length=5"
  );
  const data = await response.json();
  return data[0];
}


function isValidWord(word) {
  return possibleWords.includes(word);
}


export function checkGuess(guess) {
  const isValid = isValidWord(guess.toLowerCase());

  if (!isValid) {
    return null;
  }

  const targetLetters = targetWord.toLowerCase().split("");
  const guessLetters = guess.toLowerCase().split("");

  return guessLetters.map((letter, index) => {
    if (letter === targetLetters[index]) {
      return "correct";
    } else if (targetLetters.includes(letter)) {
      return "misplaced";
    } else {
      return "incorrect";
    }
  });
}