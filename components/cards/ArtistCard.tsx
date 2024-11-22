import React, { useContext } from 'react';
import { TouchableOpacity, Image, StyleSheet, View } from 'react-native';
import colors from '../../constants/colors';
import { ArtistType } from '../../constants/homeValues';
import { getImageUrl } from '../../helpers/ImageHelper';
import Card from './Card';
import Title from '../text/Title';
import { MainContext } from '../../context/MainContext';

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
}: ArtistCardProps) => {
  const context = useContext(MainContext);

  return (
    <View style={styles.cardContainer}>
      <TouchableOpacity onPress={onPress} style={styles.touchable}>
        <Card style={[styles.container]}>
          {item?.profilePicture && (
            <Image
              style={[
                styles.image,
                { borderColor: context?.userColor }
              ]}
              source={{ uri: getImageUrl(item?.profilePicture) }}
            />
          )}
        </Card>

        { showTitle && (
          <Title size={16} style={styles.title}>
            {item.username}
          </Title>
        ) }
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    alignItems: 'center',
    borderRadius: 200
  },
  touchable: {
    alignItems: 'center',
    width: 140,
  },
  container: {
    backgroundColor: colors.white,
    width: 150,
    height: 125,
    marginBottom: 5,
    overflow: 'hidden'
  },
  image: {
    borderWidth: 4,
    width: '100%',
    height: '100%',
    borderRadius: 200
  },
  title: {
    color: colors.darkGreyBg,
    textAlign: 'center',  // Center-align the title text
  },
});

export default ArtistCard;
export type { ArtistCardProps };
