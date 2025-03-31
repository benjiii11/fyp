import { Audio } from 'expo-av';

export const playSound = async (soundFile) => {
  const { sound } = await Audio.Sound.createAsync(soundFile);
  try {
    await sound.playAsync();
    // Unload sound after it finishes
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.didJustFinish) {
        sound.unloadAsync();
      }
    });
  } catch (error) {
    console.log('Error playing sound effect:', error);
  }
};
