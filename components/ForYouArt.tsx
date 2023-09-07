import React from 'react';
import { View, StyleSheet } from "react-native";
import colors from "../constants/colors";

const ForYouArt = (index: number) => (
  <View style={styles.container} key={index.toString() + Math.random()} />
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.sampleBg,
    borderRadius: 4,
    margin: 2,
    height: 150,
    flex: 1
  }
});

export default ForYouArt;
