import React from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';
import colors from '../constants/colors';
import { ArtistType } from '../constants/homeValues';
import Card from './Card';
import Title from './Title';

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
    </Card>
    <Title size={16} style={styles.title}>
      {item.username}
    </Title>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.artistPlHolder,
    marginRight: 5,
    // marginLeft: 8,
    marginBottom: 60,
    textAlign: 'center',
    width: 120,
    height: 120,
    position: 'relative',
    borderRadius: 70,
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 120,
    height: 120,
    borderRadius: 70,
  },
  title: {
    marginRight: 5,
    marginLeft: 25,
    position: 'absolute',
    bottom: 10,
    left: '50%',
    transform: [{ translateX: -50 }],
    color: colors.darkGreyBg,
  },
});

export default ArtistCard;
export type { ArtistCardProps };
