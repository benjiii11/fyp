import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const categories = ['Animals', 'Countries', 'Jobs', 'Food'];
const difficulties = ['Easy', 'Normal', 'Hard', 'Challenge'];

export default function ChooseGame({ navigation }) {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleSelect = (difficulty) => {
    if (!selectedCategory) return;

    const screen =
      difficulty.toLowerCase() === 'challenge' ? 'GameChallenge' : 'Game';

    navigation.navigate(screen, {
      category: selectedCategory,
      difficulty: difficulty.toLowerCase(),
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose a Category</Text>
      <View style={styles.grid}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryBtn,
              selectedCategory === category && styles.categorySelected,
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={styles.categoryText}>{category}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {selectedCategory && (
        <>
          <Text style={styles.subtitle}>Choose Difficulty</Text>
          <View style={styles.grid}>
            {difficulties.map((diff) => (
              <TouchableOpacity
                key={diff}
                style={[
                  styles.diffBtn,
                  diff === 'Challenge' && styles.challengeBtn,
                ]}
                onPress={() => handleSelect(diff)}
              >
                <Text style={styles.diffText}>{diff}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      <TouchableOpacity
        style={[styles.instructionBtn]}
        onPress={() => navigation.navigate('Instructions')}
      >
        <Text style={styles.instructionText}>Instructions</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  subtitle: { fontSize: 20, fontWeight: '600', marginTop: 30, marginBottom: 10, textAlign: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  categoryBtn: {
    backgroundColor: '#ccc',
    padding: 15,
    margin: 10,
    borderRadius: 10,
    width: 140,
    alignItems: 'center',
  },
  categorySelected: {
    backgroundColor: '#999',
  },
  categoryText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  diffBtn: {
    backgroundColor: '#444',
    padding: 12,
    margin: 10,
    borderRadius: 10,
    width: 120,
    alignItems: 'center',
  },
  challengeBtn: {
    backgroundColor: '#1E90FF',
  },
  diffText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  instructionBtn: {
    marginTop: 40,
    backgroundColor: '#00BFFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '60%',
    alignSelf: 'center',
  },
  instructionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});
