import React from 'react';
import { TouchableOpacity, Image, StyleSheet, ImageBackground, View } from 'react-native';
import colors from '../../constants/colors';
import { ArticleType } from "../../constants/homeValues";
import Card from "./Card";
import Title from "../text/Title";
import { getImageUrl } from '../../helpers/ImageHelper';

interface ArticleCardProps {
  onPress?: (item: any) => void;
  item: ArticleType;
  path: "article";
}

const ArticleCard = ({
  onPress = () => {},
  item,
  path,
}: ArticleCardProps) => (
  <TouchableOpacity
    accessibilityRole="button"
    onPress={() => onPress(item)}
    style={styles.touchableOpacityContainer}
  >
    <ImageBackground
      source={{ uri: getImageUrl(item?.mainImage) }}
      style={styles.container}
      imageStyle={{ borderRadius: 12 }}
      resizeMode="center"
      blurRadius={20}
    >
      <View style={styles.viewContainer}>
        <Title
          size={16}
          bold={false}
          style={styles.textStyle}
        >{item.title}</Title>
      </View>
    </ImageBackground>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  touchableOpacityContainer: {
    paddingHorizontal: 12,
    paddingVertical: 12
  },
  container: {
    width: 250,
    height: 150,
    borderRadius: 12
  },
  viewContainer: {
    backgroundColor: '#00000066',
    height: '100%',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12
  },
  textStyle: {
    marginTop: 'auto',
    color: colors.whitesmoke
  }
});

export default ArticleCard;
export type { ArticleCardProps };
