import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import AnimatedSprite from 'react-native-animated-sprite';

const CowboySprite = ({ animationType }) => {
  const sprite = {
    name: 'cowboy',
    size: { width: 124, height: 124 },
    animationTypes: ['idle', 'shoot'],
    frames: [
      require('../assets/cowboy.png'),
      require('../assets/cowboy2.png'),
      require('../assets/cowboyshoot.png')
    ],
    animationIndex: {
      idle: [0, 1],
      shoot: [2]
    }
  };

  const spriteKey = useMemo(() => {
    return animationType === 'shoot' ? `shoot-${Date.now()}` : 'idle';
  }, [animationType]);

  return (
    <View style={styles.container}>
      <AnimatedSprite
        key={spriteKey}
        sprite={sprite}
        loopAnimation={animationType === 'idle'}
        animationFrameIndex={sprite.animationIndex[animationType] || [0, 1]}
        coordinates={{ top: 0, left: 0 }}
        size={sprite.size}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 124,
    height: 124,
    position: 'relative'
  }
});

export default CowboySprite;
