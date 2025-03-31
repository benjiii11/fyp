import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import wordLogic from '../logic/wordLogic';
import { resetGameState } from '../logic/resetLogic';
import { getInitialGuessedLetters } from '../logic/letterguess';
import { updateHighScore, getHighScore } from '../logic/scoring';
import ZombieSprite from '../logic/ZombieSprite';
import CowboySprite from '../logic/CowboySprite';
import BulletSprite from '../logic/BulletSprite';
import { Audio } from 'expo-av';
import gunSound from '../assets/sounds/gun.mp3';
import zombieHit from '../assets/sounds/zombiehit.mp3';

const ZOMBIE_START = Dimensions.get('window').width - 140;
const ZOMBIE_END = 60;

export default function GameScreen({ navigation, route }) {
  const { category, difficulty } = route.params;
  const [word, setWord] = useState('');
  const [guessed, setGuessed] = useState([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [shoot, setShoot] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [pressedLetters, setPressedLetters] = useState([]);
  const zombiePosition = useRef(new Animated.Value(ZOMBIE_START)).current;
  const intervalRef = useRef(null);
  const triggeredGameOverRef = useRef(false);

  useEffect(() => {
    loadHighScore();
    loadNewWord();
    startZombieMovement();
    return () => clearInterval(intervalRef.current);
  }, []);

  const loadHighScore = async () => {
    const stored = await getHighScore(category, difficulty);
    setHighScore(stored);
  };

  const loadNewWord = () => {
    const newWord = wordLogic.getRandomWord(category, difficulty);
    const hinted = getInitialGuessedLetters(newWord);
    setWord(newWord);
    setGuessed(hinted);
    setPressedLetters([]);
    setShoot(false);
    zombiePosition.setValue(ZOMBIE_START);
    triggeredGameOverRef.current = false;
  };

  const startZombieMovement = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    intervalRef.current = setInterval(() => {
      if (!isPaused) {
        zombiePosition.setValue(zombiePosition.__getValue() - 1);
        if (
          zombiePosition.__getValue() <= ZOMBIE_END &&
          !triggeredGameOverRef.current
        ) {
          triggeredGameOverRef.current = true;
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          updateHighScore(score, category, difficulty);
          navigation.replace('Results', { score, category, difficulty });
        }
      }
    }, 150);
  };

  const playSound = async (soundFile) => {
    const { sound } = await Audio.Sound.createAsync(soundFile);
    await sound.playAsync();
  };

  const handleLetterPress = (letter) => {
    if (guessed.includes(letter) || pressedLetters.includes(letter)) return;

    setPressedLetters((prev) => [...prev, letter]);

    if (word.toLowerCase().includes(letter.toLowerCase())) {
      const updatedGuessed = [...guessed, letter];
      setGuessed(updatedGuessed);
      setScore((prev) => prev + 10);

      if (
        word
          .replace(/ /g, '')
          .split('')
          .every((l) => updatedGuessed.includes(l) || l === ' ')
      ) {
        setShoot(true);
        playSound(gunSound);
        setTimeout(() => setShoot(false), 200);
        setScore((prev) => prev + 50);
        playSound(zombieHit);
        setTimeout(loadNewWord, 1000);
      }
    }
  };

  const renderWord = () =>
    word.split('').map((char, idx) => (
      <Text key={idx} style={styles.letter}>
        {char === ' ' ? ' ' : guessed.includes(char) ? char : '_'}
      </Text>
    ));

  const renderKeyboard = () => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    return alphabet.map((char) => {
      const isPressed = pressedLetters.includes(char);
      return (
        <TouchableOpacity
          key={char}
          style={[styles.key, isPressed && styles.keyPressed]}
          onPress={() => handleLetterPress(char)}
          disabled={isPressed}
        >
          <Text style={styles.keyText}>{char}</Text>
        </TouchableOpacity>
      );
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerAbsolute}>
        <Text style={styles.categoryTitle}>
          {category.toUpperCase()} - {difficulty.toUpperCase()}
        </Text>
        <Text style={styles.score}>Score: {score}</Text>
        <Text style={styles.score}>High Score: {highScore}</Text>
      </View>

      <View style={styles.topRow}>
        <View style={{ width: 124, height: 124, top: 98 }}>
          <CowboySprite animationType={shoot ? 'shoot' : 'idle'} />
        </View>
        <BulletSprite
          visible={shoot}
          targetX={zombiePosition.__getValue()}
          onFinish={() => {}}
        />
        <ZombieSprite position={zombiePosition} />
      </View>

      <View style={styles.bottomContainer}>
        <View style={styles.wordRow}>{renderWord()}</View>
        <View style={styles.keyboard}>{renderKeyboard()}</View>
        <TouchableOpacity
          style={styles.pauseBtn}
          onPress={() => setIsPaused(true)}
        >
          <Text style={styles.pauseText}>Pause</Text>
        </TouchableOpacity>
      </View>

      {isPaused && (
        <View style={styles.pauseOverlay}>
          <Text style={styles.pauseTitle}>Game Paused</Text>
          <TouchableOpacity
            style={styles.resumeBtn}
            onPress={() => setIsPaused(false)}
          >
            <Text style={styles.resumeText}>Resume</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.homeBtn}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.homeText}>Back to Home</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.endGameBtn}
            onPress={() => {
              clearInterval(intervalRef.current);
              updateHighScore(score, category, difficulty);
              navigation.replace('Results', { score, category, difficulty });
            }}
          >
            <Text style={styles.endGameText}>End Game</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', justifyContent: 'flex-start' },
  headerAbsolute: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    zIndex: 999,
    alignItems: 'center',
  },
  categoryTitle: { fontSize: 20, fontWeight: 'bold', textAlign: 'center' },
  score: { fontSize: 18, color: '#000', marginTop: 4, textAlign: 'center' },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 150,
    marginLeft: 20,
    position: 'relative',
  },
  bottomContainer: { flex: 1, justifyContent: 'flex-end', paddingBottom: 30 },
  wordRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  letter: { fontSize: 28, color: 'black', marginHorizontal: 4 },
  keyboard: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  key: {
    width: 40,
    height: 40,
    margin: 3,
    backgroundColor: '#444',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  keyPressed: { backgroundColor: '#888', opacity: 0.4 },
  keyText: { color: 'white', fontSize: 18 },
  pauseBtn: { alignSelf: 'center', marginTop: 20 },
  pauseText: { color: '#FFD700', fontSize: 20 },
  pauseOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  pauseTitle: { fontSize: 32, color: '#fff', marginBottom: 30 },
  resumeBtn: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 15,
  },
  resumeText: { fontSize: 20, color: '#fff' },
  homeBtn: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  homeText: { fontSize: 20, color: '#fff' },
  endGameBtn: {
    backgroundColor: '#FF9800',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 15,
  },
  endGameText: { fontSize: 20, color: '#fff' },
});
