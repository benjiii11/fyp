import wordsData from '../assets/words.json';

const getRandomWord = (category, difficulty) => {
  if (!category || !difficulty) return '';

  const upperCategory = category.trim().toLowerCase();
  const lowerDifficulty = difficulty.trim().toLowerCase();

  const categoryData = wordsData.categories;
  if (!categoryData[category]) return '';

  const wordList = categoryData[category][lowerDifficulty];
  if (!wordList || wordList.length === 0) return '';

  const randomIndex = Math.floor(Math.random() * wordList.length);
  return wordList[randomIndex].toUpperCase(); // Capitalized for game use
};

const displayWord = (word, guessedLetters) => {
  return word
    .split('')
    .map((letter) => (guessedLetters.includes(letter) ? letter : '_'))
    .join(' ');
};

export default {
  getRandomWord,
  displayWord,
};
