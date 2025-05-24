import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function NewGameScreen({ navigation }) {
  return (
    <LinearGradient
      colors={['#db93b3', '#94bbe9']} 
      style={styles.container}
    >
      <Text style={styles.title}>Choose Mode</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('VsBot')}
      >
        <Text style={styles.buttonText}>Vs Bot</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('VsFriend')}
      >
        <Text style={styles.buttonText}>Vs Friend</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 40,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#ffffff',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5, // For Android shadow
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3498db',
  },
});