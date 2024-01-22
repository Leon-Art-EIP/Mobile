import React from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';
import colors from '../constants/colors';
import { ArticleType } from "../constants/homeValues";
import Card from "./Card";
import Title from "./Title";

interface ArticleCardProps {
  onPress?: (item) => void;
  item: ArticleType;
  path: "article";
}

const handleType = () => {
    // Your implementation here
  };

const ArticleCard = ({
    
  onPress = () => {},
  item,
  path,
}: ArticleCardProps) => (
  <TouchableOpacity
  accessibilityRole="button"
  onPress={() => onPress(item)} // Pass the item to the onPress handler
>
    <Card style={styles.container}>
      <Image
        style={styles.image}
        source={{ uri: item.mainImage }} // Add the correct image source based on your data
      />
      <Title size={18} style={{ marginTop: 'auto', color: '#fff' }}>{item.title}</Title>
    </Card>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.articlePlHolder,
    marginRight: 5,
    margin: 0,
    width: 230,
    height: 145,
    position: "relative",
    borderRadius: 15,
  },
  image: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 120,
    height: 120,
    borderRadius: 15,
  }
});

export default ArticleCard;
export type { ArticleCardProps };
