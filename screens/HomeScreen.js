import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import CowboySprite from '../logic/CowboySprite';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.centeredSprite}>
        <CowboySprite animationType="idle" />
      </View>
      <Text style={styles.title}>Cowboy Blitz</Text>
      <Button
        title="Start Game"
        onPress={() => navigation.navigate('ChooseGame')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredSprite: {
    width: 124,
    height: 124,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default HomeScreen;
