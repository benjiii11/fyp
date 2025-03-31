import React, { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet } from 'react-native';

const BulletSprite = ({ visible, targetX, onFinish }) => {
  const bulletX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible && targetX !== null) {
      bulletX.setValue(0);
      Animated.timing(bulletX, {
        toValue: targetX - 100,
        duration: 300,
        useNativeDriver: true
      }).start(() => {
        if (onFinish) onFinish();
      });
    }
  }, [visible, targetX]);

  if (!visible) return null;

  return (
    <Animated.Image
      source={require('../assets/bullet2.png')}
      style={[
        styles.bullet,
        { transform: [{ translateX: bulletX }] }
      ]}
    />
  );
};

const styles = StyleSheet.create({
  bullet: {
    width: 16,
    height: 8,
    position: 'absolute',
    top: 170,
    left: 140
  }
});

export default BulletSprite;
