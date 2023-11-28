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

const ArtistCard = ({
  onPress = () => {},
  item,
  path,
}: ArtistCardProps) => (
  <TouchableOpacity
    accessibilityRole="button"
    onPress={onPress}
  >
    <Card style={styles.container}>
      <Image style={styles.image} />
    </Card>
    <Title size={16} style={styles.title}>
      {item.username}
    </Title>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.artistPlHolder,
    margin: 0,
    marginBottom: 40,
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
    position: 'absolute',
    bottom: 10,
    left: '50%',
    transform: [{ translateX: -30 }],
    color: colors.darkGreyBg,
  },
});

export default ArtistCard;
export type { ArtistCardProps };
