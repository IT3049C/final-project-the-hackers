export const WORDS = [
  "apple",
  "banana",
  "cherry",
  "date",
  "elderberry"
];

export const getRandomWord = () => {
    return WORDS[Math.floor(Math.random() * WORDS.length)];
};