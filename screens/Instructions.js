import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const Instructions = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Instructions</Text>

      <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.instructionText}>
            This is a game of hangman with a twist — where there is a timer instead of lives like in traditional hangman.
            The zombies have invaded, and they will slowly eat you up unless you solve the word in time.
          </Text>

          <Text style={styles.instructionText}>
            There are different modes where you can challenge yourself to beat your high score:
          </Text>

          <Text style={styles.subHeader}>Practice Mode:</Text>
          <Text style={styles.instructionText}>
            Easy, Normal, and Hard modes are for practice. The zombie will slowly make its way toward your brains!
          </Text>

          <Text style={styles.subHeader}>Challenge Mode:</Text>
          <Text style={styles.instructionText}>
            The real challenge is here! For every wrong guess, the zombie will leap toward you. For every correct guess,
            you will knock the zombie back a little. Be warned: the words get tougher the longer you survive.
          </Text>

          <Text style={styles.subHeader}>How to Play:</Text>
          <Text style={styles.instructionText}>
            A zombie is coming for your brains! Solve the hidden word before it reaches you. Press any letter on the on-screen
            keyboard to guess. When the full word is revealed, your cowboy will shoot the zombie down and reset the challenge.
          </Text>

          <Text style={styles.subHeader}>Challenge Mechanics Recap:</Text>
          <Text style={styles.instructionText}>
            For each wrong guesses, the zombie will leap towards you! For each right guesses, you will be able to knock the zombie back!
          </Text>

          <Text style={styles.instructionText}>Good luck, and defend your brains!</Text>
        </ScrollView>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate('ChooseGame')}
      >
        <Text style={styles.backText}>Back to Mode</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 60,
    alignItems: 'center',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  scrollContent: {
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  instructionText: {
    fontSize: 18,
    color: '#333',
    lineHeight: 26,
    textAlign: 'center',
    paddingBottom: 80,
  },
  subHeader: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  backButton: {
    position: 'absolute',
    bottom: 30,
    backgroundColor: '#87CEFA',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  backText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
  },
});

export default Instructions;
