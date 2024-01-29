import React from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';
import colors from '../constants/colors';
import { ArtistType } from '../constants/homeValues';
import { getImageUrl } from '../helpers/ImageHelper';
import Card from './Card';
import Title from './Title';

interface ArtistCardProps {
  onPress?: () => void;
  item: ArtistType;
  path: string;
  style?: object;
  showTitle?: boolean;
}

const API_URL = process.env.REACT_APP_API_URL;


const ArtistCard = ({
  onPress = () => {},
  item,
  style = {},
  showTitle = true, // Default to true if not provided
}: ArtistCardProps) => (
  <TouchableOpacity onPress={onPress}>
    <Card style={[styles.container, style.container]}>
      {item?.profilePicture && (
        <Image
          style={[styles.image, style.image]}
          source={{ uri: getImageUrl(item?.profilePicture) }}
        />
      )}
    </Card>
    {showTitle && (
      <Title size={16} style={[styles.title, style.title]}>
        {item.username}
      </Title>
    )}
  </TouchableOpacity>
);


const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    marginRight: 5,
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
    left: '50%',
    transform: [{ translateX: -50 }],
    marginRight: 5,
    marginLeft: 25,
    position: 'absolute',
    bottom: 10,

    color: colors.darkGreyBg,
  },
});

export default ArtistCard;
export type { ArtistCardProps };
