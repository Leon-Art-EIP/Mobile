import React from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native'
import colors from '../constants/colors';
import { NewsType } from "../constants/homeValues";
import Card from "./Card";
import Title from "./Title";

interface ArtPiecesProps {
  onPress?: () => void;
  item: NewsType;
  path: string;
}

const ArtPieces = ({
  onPress = () => {},
  item,
  path,
}: ArtPiecesProps) => (
  <TouchableOpacity
    accessibilityRole="button"
    onPress={onPress}
  >
    <Card style={styles.container}>
      <Image style={styles.image} />
      <Title size={18} style={{ marginTop: 'auto', color: '#fff' }}>{ item.title }</Title>
    </Card>
  </TouchableOpacity>
)

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.sampleBg,
    margin: 0,
    width: 120,
    height: 150,
    position: "relative"
  },
  image: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 120,
    height: 120
  }
});

export default ArtPieces;
export type { ArtPiecesProps };
