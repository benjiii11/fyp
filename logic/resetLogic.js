import wordLogic from './wordLogic';
import { getInitialGuessedLetters } from './letterguess';

export const resetGame = (
  setWord,
  setGuessedLetters,
  _,
  zombiePosition,
  difficulty,
  setScore,
  category
) => {
  const newWord = wordLogic.getRandomWord(category, difficulty);
  const initialHints = getInitialGuessedLetters(newWord);
  setWord(newWord);
  setGuessedLetters(initialHints);
  setScore(0);
  zombiePosition.setValue(zombiePosition.__getValue());
};
