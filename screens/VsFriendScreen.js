import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef, useState } from 'react';
import {
  Animated,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function VsFriendScreen({ navigation }) {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXTurn, setIsXTurn] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [resultText, setResultText] = useState('');
  const [stars, setStars] = useState([false, false, false]);
  const [showButtons, setShowButtons] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const handlePress = (index) => {
    if (board[index] || checkWinner(board)) return;

    const newBoard = [...board];
    newBoard[index] = isXTurn ? 'X' : 'O';
    setBoard(newBoard);
    setIsXTurn(!isXTurn);

    const winner = checkWinner(newBoard);
    if (winner) {
      setResultText(winner === 'X' ? 'Player X Wins!' : 'Player O Wins!');
      endGame();
    } else if (!newBoard.includes(null)) {
      setResultText("It's a Draw!");
      endGame();
    }
  };

  const endGame = () => {
    setModalVisible(true);
    animateStars();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const animateStars = () => {
    setTimeout(() => {
      setStars([true, false, false]);
      setTimeout(() => {
        setStars([true, true, false]);
        setTimeout(() => {
          setStars([true, true, true]);
          setTimeout(() => {
            setShowButtons(true);
          }, 500);
        }, 1000);
      }, 1000);
    }, 1000);
  };

  const resetBoard = () => {
    setBoard(Array(9).fill(null));
    setIsXTurn(true);
    setModalVisible(false);
    setStars([false, false, false]);
    setShowButtons(false);
    fadeAnim.setValue(0);
  };

  const checkWinner = (b) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];
    for (let [a, b1, c] of lines) {
      if (b[a] && b[a] === b[b1] && b[a] === b[c]) return b[a];
    }
    return null;
  };

  const renderBox = (index) => (
    <TouchableOpacity key={index} style={styles.box} onPress={() => handlePress(index)}>
      <Text style={[styles.symbol, {
        color: board[index] === 'X' ? '#00e676' : '#ff5252',
      }]}>
        {board[index]}
      </Text>
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={['#667eea', '#764ba2']} style={styles.container}>
      <Text style={styles.title}>Turn: {isXTurn ? 'X' : 'O'}</Text>

      <View style={styles.board}>{board.map((_, i) => renderBox(i))}</View>

      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Animated.View style={[
            styles.modalContainer,
            {
              opacity: fadeAnim,
              transform: [{
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                }),
              }],
            }
          ]}>
            <Text style={styles.resultText}>{resultText}</Text>

            <View style={styles.starsContainer}>
              {stars.map((show, i) =>
                show ? <Text key={i} style={styles.star}>⭐</Text> : null
              )}
            </View>

            {showButtons && (
              <View style={styles.modalButtons}>
                <TouchableOpacity onPress={resetBoard} style={styles.button}>
                  <Text style={styles.buttonText}>Play Again</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(false);
                    navigation.navigate('Home');
                  }}
                  style={[styles.button, styles.exitButton]}
                >
                  <Text style={styles.buttonText}>Exit</Text>
                </TouchableOpacity>
              </View>
            )}
          </Animated.View>
        </View>
      </Modal>
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
  board: {
    width: 300,
    height: 300,
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderWidth: 4,
    borderColor: '#fff',
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  box: {
    width: '33.33%',
    height: '33.33%',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff',
  },
  symbol: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 12,
    alignItems: 'center',
    width: 300,
  },
  resultText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  star: {
    fontSize: 36,
    marginHorizontal: 5,
    color: '#FFD700',
  },
  modalButtons: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    backgroundColor: '#4caf50',
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: 'center',
  },
  exitButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});