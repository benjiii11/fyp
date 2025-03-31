import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import wordLogic from '../logic/wordLogic';
import { getInitialGuessedLetters } from '../logic/letterguess';
import BulletSprite from '../logic/BulletSprite';
import CowboySprite from '../logic/CowboySprite';
import ZombieSprite from '../logic/ZombieSprite';
import {
  calculateLetterScore,
  calculateWordScore,
  updateHighScoreChallenge,
  getHighScoreChallenge,
} from '../logic/scoringchallenge';

import { playSound } from '../logic/soundManager';
import shootSound from '../assets/sounds/gun.mp3';
import zombieResetSound from '../assets/sounds/zombiehit.mp3';
import zombieLeapSound from '../assets/sounds/zombie.mp3';

const { width } = Dimensions.get('window');
const ZOMBIE_START = width - 150;
const ZOMBIE_END = 40;
const WRONG_GUESS_LEAP = 15;
const CORRECT_LETTER_KNOCKBACK = 20;

export default function GameScreenChallenge({ route, navigation }) {
  const { category } = route.params;
  const [difficulty, setDifficulty] = useState('easy');
  const [word, setWord] = useState('');
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [score, setScore] = useState(0);
  const [recentWords, setRecentWords] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const [shoot, setShoot] = useState(false);
  const zombiePosition = useRef(new Animated.Value(ZOMBIE_START)).current;
  const intervalRef = useRef(null);
  const triggeredGameOverRef = useRef(false);

  const startZombieMovement = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    intervalRef.current = setInterval(() => {
      zombiePosition.setValue(zombiePosition.__getValue() - 1);
      if (
        zombiePosition.__getValue() <= ZOMBIE_END &&
        !triggeredGameOverRef.current
      ) {
        triggeredGameOverRef.current = true;
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        updateHighScoreChallenge(score, category);
        navigation.replace('ResultsChallenge', { score, category });
      }
    }, 200);
  };

  const stopZombieMovement = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const getNewWord = () => {
    let newDiff = 'easy';
    if (score >= 800) newDiff = 'hard';
    else if (score >= 400) newDiff = 'normal';
    setDifficulty(newDiff);

    let attempts = 0;
    let newWord;
    do {
      newWord = wordLogic.getRandomWord(category, newDiff);
      attempts++;
    } while (recentWords.includes(newWord) && attempts < 20);
    return newWord;
  };

  useEffect(() => {
    const newWord = getNewWord();
    const hints = getInitialGuessedLetters(newWord);
    setWord(newWord);
    setGuessedLetters(hints);
    setRecentWords((prev) => [...prev.slice(-4), newWord]);
    startZombieMovement();
    return stopZombieMovement;
  }, []);

  const handleLetterPress = (letter) => {
    if (isPaused || guessedLetters.includes(letter)) return;

    const updatedGuesses = [...guessedLetters, letter];
    setGuessedLetters(updatedGuesses);

    if (word.includes(letter)) {
      setShoot(true);
      playSound(shootSound);
      setTimeout(() => setShoot(false), 200);

      const letterScore = calculateLetterScore(letter, word, guessedLetters);
      setScore((prev) => prev + letterScore);

      const newPos = Math.min(
        ZOMBIE_START,
        zombiePosition.__getValue() + CORRECT_LETTER_KNOCKBACK
      );
      zombiePosition.setValue(newPos);
    } else {
      playSound(zombieLeapSound);
      zombiePosition.setValue(zombiePosition.__getValue() - WRONG_GUESS_LEAP);
    }

    const allGuessed = word
      .replace(/\s/g, '')
      .split('')
      .every((char) => updatedGuesses.includes(char));

    if (allGuessed) {
      const wordScore = calculateWordScore();
      const newScore = score + wordScore;
      setScore(newScore);
      triggeredGameOverRef.current = true;

      setTimeout(() => {
        playSound(zombieResetSound);
        const newWord = getNewWord();
        const newHints = getInitialGuessedLetters(newWord);
        setWord(newWord);
        setGuessedLetters(newHints);
        setRecentWords((prev) => [...prev.slice(-4), newWord]);
        zombiePosition.setValue(ZOMBIE_START);
        triggeredGameOverRef.current = false;
      }, 1000);
    }
  };

  useEffect(() => {
    if (isPaused) stopZombieMovement();
    else startZombieMovement();
    return stopZombieMovement;
  }, [isPaused]);

  const renderWord = () => {
    return word.split('').map((char, idx) => (
      <Text key={idx} style={styles.letter}>
        {char === ' ' ? ' ' : guessedLetters.includes(char) ? char : '_'}
      </Text>
    ));
  };

  const renderKeyboard = () => {
    const isTransitioning = triggeredGameOverRef.current || isPaused;
    return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((letter) => {
      const alreadyGuessed = guessedLetters.includes(letter);
      const isDisabled = alreadyGuessed || isTransitioning;
      return (
        <TouchableOpacity
          key={letter}
          style={[
            styles.key,
            alreadyGuessed && styles.keyGuessed,
            isTransitioning && styles.keyLocked,
          ]}
          onPress={() => handleLetterPress(letter)}
          disabled={isDisabled}
        >
          <Text style={[styles.keyText, isDisabled && styles.keyTextDisabled]}>
            {letter}
          </Text>
        </TouchableOpacity>
      );
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerAbsolute}>
        <Text style={styles.categoryTitle}>
          {category.toUpperCase()} - CHALLENGE
        </Text>
        <Text style={styles.score}>Score: {score}</Text>
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
        <TouchableOpacity style={styles.pauseBtn} onPress={() => setIsPaused(true)}>
          <Text style={styles.pauseText}>Pause</Text>
        </TouchableOpacity>
      </View>
      {isPaused && (
        <View style={styles.pauseOverlay}>
          <Text style={styles.pauseTitle}>Game Paused</Text>
          <TouchableOpacity style={styles.resumeBtn} onPress={() => setIsPaused(false)}>
            <Text style={styles.resumeText}>Resume</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.homeBtn} onPress={() => navigation.navigate('Home')}>
            <Text style={styles.homeText}>Back to Home</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.endGameBtn}
            onPress={() => {
              updateHighScoreChallenge(score, category);
              navigation.replace('ResultsChallenge', { score, category });
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
  keyGuessed: { backgroundColor: '#888', opacity: 0.4 },
  keyLocked: { opacity: 0.3 },
  keyText: { color: 'white', fontSize: 18 },
  keyTextDisabled: { color: '#ccc' },
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
