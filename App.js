import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Text, StyleSheet, Alert } from "react-native";

const colors = ["red", "blue", "green", "yellow", "purple"];

export default function App() {
  const [sequence, setSequence] = useState([]);      // Speicher für die Reihenfolge
  const [playerInput, setPlayerInput] = useState([]); // Eingaben des Spielers
  const [isPlaying, setIsPlaying] = useState(false);  // Sequenz wird abgespielt
  const [highlight, setHighlight] = useState(null);   // Welcher Button gerade leuchtet
  const [round, setRound] = useState(0);

  // Neue Runde starten
  const startRound = () => {
    const nextColor = Math.floor(Math.random() * colors.length);
    setSequence([...sequence, nextColor]);
    setPlayerInput([]);
    setRound(round + 1);
    playSequence([...sequence, nextColor]);
  };

  // Sequenz abspielen (Buttons blinken nacheinander)
  const playSequence = (seq) => {
    setIsPlaying(true);
    let i = 0;
    const interval = setInterval(() => {
      setHighlight(seq[i]);
      setTimeout(() => setHighlight(null), 500);
      i++;
      if (i >= seq.length) {
        clearInterval(interval);
        setTimeout(() => setIsPlaying(false), 600);
      }
    }, 1000);
  };

  // Spieler klickt auf Button
  const handlePress = (index) => {
    if (isPlaying) return; // Während die Sequenz läuft, keine Eingabe möglich

    const newInput = [...playerInput, index];
    setPlayerInput(newInput);

    // Prüfen ob korrekt
    if (sequence[newInput.length - 1] !== index) {
      Alert.alert("Game Over", `Du hast bis Runde ${round} geschafft!`);
      resetGame();
      return;
    }

    // Falls Sequenz richtig wiederholt
    if (newInput.length === sequence.length) {
      setTimeout(() => startRound(), 800);
    }
  };

  const resetGame = () => {
    setSequence([]);
    setPlayerInput([]);
    setRound(0);
    setIsPlaying(false);
    setHighlight(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Memory Spiel</Text>
      <Text style={styles.round}>Runde: {round}</Text>
      <View style={styles.grid}>
        {colors.map((color, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.button,
              { backgroundColor: highlight === index ? "white" : color },
            ]}
            onPress={() => handlePress(index)}
          />
        ))}
      </View>
      <TouchableOpacity style={styles.startBtn} onPress={startRound}>
        <Text style={styles.startText}>
          {round === 0 ? "Start" : "Weiter spielen"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    color: "white",
    marginBottom: 20,
  },
  round: {
    fontSize: 20,
    color: "lightgrey",
    marginBottom: 20,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 30,
  },
  button: {
    width: 100,
    height: 100,
    margin: 10,
    borderRadius: 20,
  },
  startBtn: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
  },
  startText: {
    color: "white",
    fontSize: 18,
  },
});
