import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const NormalModeScreen = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isUserTurn, setIsUserTurn] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [stars, setStars] = useState([false, false, false]);

  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const colorAnim = useRef(Array(9).fill().map(() => new Animated.Value(0))).current;

  const handlePress = (index) => {
    if (board[index] || gameOver || !isUserTurn) return;

    Animated.timing(colorAnim[index], {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();

    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);
    setIsUserTurn(false);
  };

  useEffect(() => {
    if (!isUserTurn && !gameOver) {
      const timer = setTimeout(() => {
        const botIndex = getBotMove(board);
        if (botIndex !== -1) {
          Animated.timing(colorAnim[botIndex], {
            toValue: 1,
            duration: 300,
            useNativeDriver: false,
          }).start();

          const newBoard = [...board];
          newBoard[botIndex] = 'O';
          setBoard(newBoard);
          setIsUserTurn(true);
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isUserTurn]);

  useEffect(() => {
    const win = checkWinner(board);
    if (win) {
      setWinner(win);
      setGameOver(true);
      setModalVisible(true); 
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
      animateStars(); 
   } else if (!board.includes(null)) {
  setGameOver(true);
  setWinner('draw');
  setModalVisible(true);
  Animated.timing(fadeAnim, {
    toValue: 1,
    duration: 500,
    useNativeDriver: true,
  }).start();
  animateStars();
}
  }, [board]);

  const getBotMove = (board) => {
    const empty = board.map((val, idx) => (val === null ? idx : null)).filter(val => val !== null);
    return empty.length > 0 ? empty[Math.floor(Math.random() * empty.length)] : -1;
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

  const restartGame = () => {
    setBoard(Array(9).fill(null));
    setIsUserTurn(true);
    setGameOver(false);
    setWinner(null);
    setModalVisible(false);
    setShowButtons(false);
    setStars([false, false, false]);
    colorAnim.forEach(anim => anim.setValue(0));
    fadeAnim.setValue(0);
  };

  const exitGame = () => {
    setModalVisible(false);
    navigation.navigate('Home');
  };

  const animateStars = () => {
    setTimeout(() => {
      setStars([true, false, false]);
      setTimeout(() => setStars([true, true, false]), 1000);
      setTimeout(() => setStars([true, true, true]), 2000);
      
      setTimeout(() => setShowButtons(true), 2000);  
    }, 1000); 
  };

  const renderSquare = (index) => {
    const player = board[index];
    const squareColor = colorAnim[index].interpolate({
      inputRange: [0, 1],
      outputRange: [
        'rgba(0,0,0,0)',
        player === 'X' ? 'rgba(0,255,204,0.5)' : 'rgba(254, 13, 13, 0.5)',
      ],
    });

    return (
      <TouchableOpacity key={index} style={styles.square} onPress={() => handlePress(index)}>
        <Animated.View style={[styles.squareContent, { backgroundColor: squareColor }]}>
          <Text style={styles.squareText}>{player}</Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient colors={['#1c92d2', '#f2fcfe']} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.turnText}>
          {gameOver ? 'Game Over' : isUserTurn ? "Your Turn (X)" : "Bot's Turn (O)"}
        </Text>
        <View style={styles.board}>
          {board.map((_, idx) => renderSquare(idx))}
        </View>

        <Modal transparent animationType="fade" visible={modalVisible}>
          <View style={styles.modalOverlay}>
            <Animated.View style={[styles.modalContent, { opacity: fadeAnim }]}>
              <Text style={styles.modalText}>
                {winner === 'X' ? 'You Win!' : winner === 'O' ? 'Bot Wins!' : "It's a Draw!"}
              </Text>
              <View style={styles.starsContainer}>
                {stars.map((show, i) => show && <Text key={i} style={styles.star}>⭐</Text>)}
              </View>
              {showButtons && (
                <View style={styles.buttonsContainer}>
                  <TouchableOpacity style={styles.restartButton} onPress={restartGame}>
                    <Text style={styles.restartText}>Play Again</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.exitButton} onPress={exitGame}>
                    <Text style={styles.exitText}>Exit</Text>
                  </TouchableOpacity>
                </View>
              )}
            </Animated.View>
          </View>
        </Modal>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  turnText: { fontSize: 30, fontWeight: 'bold', color: '#fff', marginBottom: 30 },
  board: { width: 300, height: 300, flexDirection: 'row', flexWrap: 'wrap' },
  square: {
    width: '33.33%',
    height: '33.33%',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  squareContent: { justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' },
  squareText: { fontSize: 36, fontWeight: 'bold', color: '#fff' },
  modalOverlay: {
    flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalContent: {
    width: 300, backgroundColor: '#fff', borderRadius: 10, alignItems: 'center', padding: 20,
  },
  modalText: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  starsContainer: { flexDirection: 'row', marginBottom: 20 },
  star: { fontSize: 36, marginHorizontal: 5, color: '#FFD700' },
  buttonsContainer: { flexDirection: 'row', justifyContent: 'space-around', width: '100%' },
  restartButton: {
    backgroundColor: '#4CAF50', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8,
  },
  exitButton: {
    backgroundColor: '#F44336', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 8,
  },
  restartText: { color: '#fff', fontSize: 16 },
  exitText: { color: '#fff', fontSize: 16 },
});

export default NormalModeScreen;