import React from 'react';
import { TouchableOpacity, Image, StyleSheet, View } from 'react-native';
import colors from '../../constants/colors';
import { ArtistType } from '../../constants/homeValues';
import { getImageUrl } from '../../helpers/ImageHelper';
import Card from './Card';
import Title from '../text/Title';

interface ArtistCardProps {
  onPress?: () => void;
  item: ArtistType;
  style?: object;
  showTitle?: boolean;
}

const ArtistCard = ({
  onPress = () => {},
  item,
  style = {},
  showTitle = true,
}: ArtistCardProps) => (
  <View style={styles.cardContainer}>
    <TouchableOpacity onPress={onPress} style={styles.touchable}>
      <Card style={[styles.container]}>
        {item?.profilePicture && (
          <Image
            style={styles.image}
            source={{ uri: getImageUrl(item?.profilePicture) }}
          />
        )}
      </Card>
      {showTitle && (
        <Title size={16} style={styles.title}>
          {item.username}
        </Title>
      )}
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  cardContainer: {
    alignItems: 'center',  // Center align the card and title horizontally
    // backgroundColor: colors.deepyellow,
  },
  touchable: {
    alignItems: 'center',  // Align children (image and title) center
    width: 140,  // Define width to align text correctly
  },
  container: {
    backgroundColor: colors.white,
    width: 150,
    height: 125,
    // border25Radius: 70,
    marginBottom: 5,  // Space between card and title
    overflow: 'hidden' // Ensures the image does not bleed outside the card
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8
    // borderRadius: 70,
  },
  title: {
    color: colors.darkGreyBg,
    textAlign: 'center',  // Center-align the title text
  },
});

export default ArtistCard;
export type { ArtistCardProps };
