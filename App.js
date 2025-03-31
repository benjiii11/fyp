import React, { useState, useEffect } from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Font from 'expo-font';
import AppLoading from 'expo-app-loading';

import HomeScreen from './screens/HomeScreen';
import ChooseGame from './screens/ChooseGame';
import GameScreen from './screens/GameScreen';
import GameScreenChallenge from './screens/GameScreenChallenge';
import ResultsScreen from './screens/ResultsScreen';
import ResultsChallenge from './screens/ResultsChallenge';
import Instructions from './screens/Instructions';

import { musicBackground } from './logic/musicBackground';

const Stack = createStackNavigator();

export default function App() {
  const [fontsLoaded] = Font.useFonts({
    'PixelifySans': require('./assets/fonts/PixelifySans-Regular.ttf'),
  });

  useEffect(() => {
    musicBackground.start();
    return () => musicBackground.stop();
  }, []);

  if (!fontsLoaded) return <AppLoading />;

  Text.defaultProps = Text.defaultProps || {};
  Text.defaultProps.style = { fontFamily: 'PixelifySans' };

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="ChooseGame" component={ChooseGame} />
        <Stack.Screen name="Game" component={GameScreen} />
        <Stack.Screen name="GameChallenge" component={GameScreenChallenge} />
        <Stack.Screen name="Results" component={ResultsScreen} />
        <Stack.Screen name="ResultsChallenge" component={ResultsChallenge} />
        <Stack.Screen name="Instructions" component={Instructions} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
