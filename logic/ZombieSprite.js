import React from 'react';
import AnimatedSprite from 'react-native-animated-sprite';
import { Animated } from 'react-native';

const ZombieSprite = ({ position }) => {
  const sprite = {
    name: 'zombie',
    size: { width: 124, height: 124 },
    animationTypes: ['walk'],
    frames: [
      require('../assets/zombie.png'),
      require('../assets/zombie2.png'),
    ],
    animationIndex: (type) => {
      switch (type) {
        case 'walk':
          return [0, 1];
        default:
          return [0];
      }
    },
  };

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: 110,
        left: position
      }}
    >
      <AnimatedSprite
        sprite={sprite}
        animationFrameIndex={sprite.animationIndex('walk')}
        loopAnimation={true}
        coordinates={{ top: 0, left: 0 }}
        size={sprite.size}
      />
    </Animated.View>
  );
};

export default ZombieSprite;
