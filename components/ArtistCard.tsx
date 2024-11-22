import React from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';
import colors from '../constants/colors';
import { ArtistType } from '../constants/homeValues';
import { getImageUrl } from '../helpers/ImageHelper';
import Card from './cards/Card';
import Title from './text/Title';

interface ArtistCardProps {
  onPress?: () => void;
  item: ArtistType | undefined;
  path: string;
  style?: any;
  showTitle?: boolean;
}

const ArtistCard = ({
  onPress = () => {},
  item,
  style = {},
  showTitle = true,
}: ArtistCardProps) => (
    <Card
      style={[styles.container, style?.container, style?.image]}
      onPress={onPress}
      pressable
    >
      { item?.profilePicture && (
        <Image
          style={[styles.image, style?.image]}
          source={{ uri: getImageUrl(item?.profilePicture) }}
        />
      ) }

      { showTitle && (
        <Title size={16} style={[styles.title, style.title]}>
          {item?.username}
        </Title>
      ) }
    </Card>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    marginRight: 12,
    marginLeft: 0,
    marginBottom: 10,
    borderRadius: 40,
    paddingHorizontal: 0,
    paddingVertical: 0
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  title: {
    transform: [{ translateX: -50 }],
    position: 'absolute',
    bottom: -20,
    left: '50%',
    color: colors.darkGreyBg,
    fontSize: 12,
    disabled: false,
  },
});

export default ArtistCard;
export type { ArtistCardProps };
