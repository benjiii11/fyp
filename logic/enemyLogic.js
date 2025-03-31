import { Animated, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const ENEMY_START_POSITION = width - 80;
const ENEMY_MOVE_DISTANCE = 50;

const enemyLogic = () => {
  const enemyPosition = new Animated.Value(ENEMY_START_POSITION);

  const animateEnemy = (incorrectGuesses) => {
    Animated.timing(enemyPosition, {
      toValue: ENEMY_START_POSITION - incorrectGuesses * ENEMY_MOVE_DISTANCE,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const knockbackEnemy = () => {
    Animated.timing(enemyPosition, {
      toValue: enemyPosition.__getValue() + ENEMY_MOVE_DISTANCE,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const resetEnemyPosition = () => {
    enemyPosition.setValue(ENEMY_START_POSITION);
  };

  return {
    enemyPosition,
    animateEnemy,
    knockbackEnemy,
    resetEnemyPosition,
  };
};

export default enemyLogic;
