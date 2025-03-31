import { Audio } from 'expo-av';
import backgroundSound from '../assets/sounds/background.mp3';

let bgMusic = null;

const start = async () => {
  if (bgMusic) return;

  try {
    bgMusic = new Audio.Sound();
    await bgMusic.loadAsync(backgroundSound);
    await bgMusic.setIsLoopingAsync(true);
    await bgMusic.playAsync();
  } catch (error) {
    console.error('Error starting background music:', error);
  }
};

const stop = async () => {
  try {
    if (bgMusic) {
      await bgMusic.stopAsync();
      await bgMusic.unloadAsync();
      bgMusic = null;
    }
  } catch (error) {
    console.error('Error stopping background music:', error);
  }
};

const pause = async () => {
  try {
    if (bgMusic) {
      await bgMusic.pauseAsync();
    }
  } catch (error) {
    console.error('Error pausing background music:', error);
  }
};

const resume = async () => {
  try {
    if (bgMusic) {
      await bgMusic.playAsync();
    }
  } catch (error) {
    console.error('Error resuming background music:', error);
  }
};

export const musicBackground = {
  start,
  stop,
  pause,
  resume,
};
