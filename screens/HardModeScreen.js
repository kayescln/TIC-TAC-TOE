import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const HardModeScreen = () => {
  const navigation = useNavigation(); 
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXTurn, setIsXTurn] = useState(true);
  const [isGameOver, setIsGameOver] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [winnerText, setWinnerText] = useState('');
  const [showButtons, setShowButtons] = useState(false);
  const [stars, setStars] = useState([false, false, false]);
  const colorAnim = useRef(Array(9).fill().map(() => new Animated.Value(0))).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!isXTurn && !isGameOver) {
      setTimeout(() => {
        hardBotMove();
      }, 500);
    }
  }, [isXTurn]);

  const handlePress = (index) => {
    if (board[index] || isGameOver) return;

    Animated.timing(colorAnim[index], {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();

    const newBoard = [...board];
    newBoard[index] = isXTurn ? 'X' : 'O';
    setBoard(newBoard);
    setIsXTurn(!isXTurn);

    const winner = checkWinner(newBoard);
    if (winner) {
      setIsGameOver(true);
      setWinnerText(winner === 'X' ? ' You Win!' : ' Bot Wins!');
      setModalVisible(true);
      animateStars();
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } else if (!newBoard.includes(null)) {
      setIsGameOver(true);
      setWinnerText(` It's a Draw!`);
      setModalVisible(true);
      animateStars();
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  };

  const resetBoard = () => {
    setBoard(Array(9).fill(null));
    setIsGameOver(false);
    setIsXTurn(true);
    setModalVisible(false);
    setStars([false, false, false]);
    setShowButtons(false);
    colorAnim.forEach((anim) => anim.setValue(0));
    fadeAnim.setValue(0);
  };

  const hardBotMove = () => {
    const bestMove = findBestMove(board);
    if (bestMove !== undefined) {
      handlePress(bestMove);
    }
  };

  const findBestMove = (board) => {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = 'O';
        const score = minimax(board, 0, false);
        board[i] = null;
        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      }
    }
    return move;
  };

  const minimax = (board, depth, isMaximizing) => {
    const winner = checkWinner(board);
    if (winner === 'O') return 10 - depth;
    if (winner === 'X') return depth - 10;
    if (!board.includes(null)) return 0;

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (board[i] === null) {
          board[i] = 'O';
          const score = minimax(board, depth + 1, false);
          board[i] = null;
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 9; i++) {
        if (board[i] === null) {
          board[i] = 'X';
          const score = minimax(board, depth + 1, true);
          board[i] = null;
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  };

  const checkWinner = (b) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let [a, b1, c] of lines) {
      if (b[a] && b[a] === b[b1] && b[a] === b[c]) return b[a];
    }
    return null;
  };

  const renderBox = (index) => {
    const player = board[index];
    const color = colorAnim[index].interpolate({
      inputRange: [0, 1],
      outputRange: ['#ffffff00', player === 'X' ? '#00e676' : '#ff5252'],
    });

    return (
      <TouchableOpacity
        key={index}
        style={styles.box}
        onPress={() => handlePress(index)}
      >
        <Animated.View style={[styles.boxInner, { backgroundColor: color }]}>
          <Text
            style={[
              styles.symbol,
              { color: player === 'X' ? '#2ecc71' : '#e74c3c' },
            ]}
          >
            {player}
          </Text>
        </Animated.View>
      </TouchableOpacity>
    );
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

  return (
    <LinearGradient colors={['#ff7e5f', '#feb47b']} style={styles.background}>
      <View style={styles.container}>
        <Text
          style={[
            styles.turnText,
            { color: isXTurn ? '#2ecc71' : '#e74c3c' },
          ]}
        >
          {isGameOver
            ? 'Game Over'
            : isXTurn
            ? 'Your Turn (X)'
            : "Bot's Turn (O)"}
        </Text>
        <View style={styles.board}>{board.map((_, i) => renderBox(i))}</View>
      </View>

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Animated.View
            style={[
              styles.modalContent,
              {
                opacity: fadeAnim,
                transform: [
                  {
                    translateY: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [50, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={styles.modalTitle}>{winnerText}</Text>
            <View style={styles.starsContainer}>
              {stars.map((show, i) =>
                show ? (
                  <Text key={i} style={styles.star}>
                    ⭐
                  </Text>
                ) : null
              )}
            </View>
            {showButtons && (
              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  style={styles.restartButton}
                  onPress={resetBoard}
                >
                  <Text style={styles.restartText}>Play Again</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.exitButton}
                  onPress={() => {
                    setModalVisible(false);
                    navigation.navigate('Home'); 
                  }}
                >
                  <Text style={styles.exitText}>Exit</Text>
                </TouchableOpacity>
              </View>
            )}
          </Animated.View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  turnText: {
    fontSize: 26,
    fontWeight: 'bold',
    fontStyle: 'italic',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    marginBottom: 30,
  },
  board: {
    width: 300,
    height: 300,
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderWidth: 4,
    borderColor: '#fff',
  },
  box: {
    width: '33.33%',
    height: '33.33%',
    borderWidth: 2,
    borderColor: '#fff',
  },
  boxInner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  symbol: {
    fontSize: 38,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
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
  buttonsContainer: {
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  gap: 20, 
},

  restartButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  exitButton: {
    backgroundColor: '#F44336',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  restartText: { color: '#fff', fontSize: 16 },
  exitText: { color: '#fff', fontSize: 16 },
});

export default HardModeScreen;