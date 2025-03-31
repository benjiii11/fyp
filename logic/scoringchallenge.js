import AsyncStorage from '@react-native-async-storage/async-storage';

const SCORE_PER_LETTER = 10;
const SCORE_PER_WORD = 50;

export const calculateLetterScore = () => SCORE_PER_LETTER;
export const calculateWordScore = () => SCORE_PER_WORD;

export const getHighScoreChallenge = async (category) => {
  const key = `highScore_${category}_challenge`;
  const stored = await AsyncStorage.getItem(key);
  return stored ? parseInt(stored) : 0;
};

export const updateHighScoreChallenge = async (score, category) => {
  const current = await getHighScoreChallenge(category);
  const key = `highScore_${category}_challenge`;
  if (score > current) {
    await AsyncStorage.setItem(key, score.toString());
  }
};
