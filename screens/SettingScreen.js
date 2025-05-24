import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SettingsScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Game Guide</Text>
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.sectionTitle}>🎮 About the Game</Text>
        <Text style={styles.paragraph}>
          This is a classic Tic Tac Toe game where two players take turns marking the spaces in a 3×3 grid with 'X' or 'O'.
          The player who succeeds in placing three of their marks in a horizontal, vertical, or diagonal row wins the game.
        </Text>

        <Text style={styles.sectionTitle}>🧾 How to Play</Text>
        <Text style={styles.paragraph}>
          1. Player X always goes first.{"\n"}
          2. Players alternate turns and place their mark in an empty cell.{"\n"}
          3. The first player to align 3 of their marks in a row (vertically, horizontally, or diagonally) wins.{"\n"}
          4. If all 9 cells are filled without a winner, the game ends in a draw.
        </Text>

        <Text style={styles.sectionTitle}>💡 Tips</Text>
        <Text style={styles.paragraph}>
          - Try to take the center spot early.{"\n"}
          - Watch your opponent’s moves and block them.{"\n"}
          - Think a few steps ahead to trap your opponent.
        </Text>

        <Text style={styles.sectionTitle}>👨‍💻 Credits</Text>
        <Text style={styles.paragraph}>
          Designed and Developed for fun, to help you learn and enhance React Native skills. {"\n"}
          This app was created as a part of a project to learn React Native and improve mobile game developmeny skills.{"\n"}
        </Text>
      </ScrollView>

      <TouchableOpacity
        style={styles.homeButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.homeButtonText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  scrollContainer: {
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    color: '#444',
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
    marginBottom: 20,
  },
  homeButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 20,
  },
  homeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});