import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import { musicBackground } from '../logic/musicBackground';
import gameOverSound from '../assets/sounds/gameover.mp3';
import { getHighScore } from '../logic/scoring';

export default function ResultsScreen({ route, navigation }) {
  const { score, category, difficulty } = route.params;
  const [highScore, setHighScore] = React.useState(0);

  useEffect(() => {
    let gameOverSoundInstance;

    const playGameOverSound = async () => {
      await musicBackground.pause();
      gameOverSoundInstance = new Audio.Sound();
      try {
        await gameOverSoundInstance.loadAsync(gameOverSound);
        await gameOverSoundInstance.playAsync();
      } catch (error) {
        console.log('Error playing game over sound:', error);
      }
    };

    const loadHighScore = async () => {
      const stored = await getHighScore(category, difficulty);
      setHighScore(stored || 0);
    };

    playGameOverSound();
    loadHighScore();

    return () => {
      if (gameOverSoundInstance) {
        gameOverSoundInstance.unloadAsync();
      }
      musicBackground.resume();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Game Over</Text>
      <Text style={styles.text}>Your Score: {score}</Text>
      <Text style={styles.text}>High Score ({category} - {difficulty}): {highScore}</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.replace('ChooseGame')}>
        <Text style={styles.buttonText}>Play Again</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.replace('Home')}>
        <Text style={styles.buttonText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  text: {
    fontSize: 24,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 8,
    marginTop: 15,
    width: '70%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});
