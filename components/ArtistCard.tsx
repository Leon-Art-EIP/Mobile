import React from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native'
import colors from '../constants/colors';
import { ArtistType } from "../constants/homeValues";
import Card from "./Card";
import Title from "./Title";

interface ArtistCardProps {
  onPress?: () => void;
  item: ArtistType;
  path: string;
}

const API_URL = process.env.REACT_APP_API_URL;


const ArtistCard = ({
  onPress = () => {},
  item,
}: ArtistCardProps) => (
  <TouchableOpacity
    accessibilityRole="button"
    onPress={onPress}
  >
    <Card style={styles.container}>
      { item?.profilePicture && (
        <Image
          style={styles.image}
          source={{ uri: API_URL + "/api" + item.profilePicture }}
        />
      ) }
      <Title size={18} style={{ marginTop: 'auto', color: '#fff' }}>{ item.username }</Title>
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

export default ArtistCard;
export type { ArtistCardProps };
