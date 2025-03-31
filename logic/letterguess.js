export const getInitialGuessedLetters = (word) => {
  const cleaned = word.toUpperCase().replace(/[^A-Z]/g, '');
  const uniqueLetters = [...new Set(cleaned)];

  let hintCount = 1;
  if (cleaned.length >= 6 && cleaned.length <= 9) hintCount = 2;
  if (cleaned.length > 9) hintCount = 3;

  return uniqueLetters.length <= hintCount
    ? uniqueLetters
    : sample(uniqueLetters, hintCount);
};

const sample = (arr, n) => {
  const copy = [...arr];
  const result = [];
  while (result.length < n && copy.length) {
    const index = Math.floor(Math.random() * copy.length);
    result.push(copy.splice(index, 1)[0]);
  }
  return result;
};
