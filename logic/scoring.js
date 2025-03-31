import AsyncStorage from '@react-native-async-storage/async-storage';

export const calculateLetterScore = (letter, word, guessedLetters) => {
  if (!word.includes(letter) || guessedLetters.includes(letter)) return 0;
  return 10;
};

export const addWordScore = () => 50;

export const updateHighScore = async (score, category, difficulty) => {
  try {
    const key = `highScore_${category}_${difficulty}`;
    const stored = await AsyncStorage.getItem(key);
    const currentHigh = stored ? parseInt(stored) : 0;
    if (score > currentHigh) {
      await AsyncStorage.setItem(key, score.toString());
    }
  } catch (err) {
    console.error('Error updating high score:', err);
  }
};

export const getHighScore = async (category, difficulty) => {
  try {
    const key = `highScore_${category}_${difficulty}`;
    const stored = await AsyncStorage.getItem(key);
    return stored ? parseInt(stored) : 0;
  } catch (err) {
    console.error('Error getting high score:', err);
    return 0;
  }
};
