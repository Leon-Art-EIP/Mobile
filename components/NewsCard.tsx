import {NewsType} from "../constants/homeValues";
import Card from "./Card";
import {Dimensions, Image, StyleSheet, Text, View} from "react-native";
import React from "react";
import colors from "../constants/colors";

const NewsCard = (news: NewsType) => (
  <Card style={styles.newsCard}>
    <Image
      key={news.id}
      source={{ uri: news.imgUrl }}
      style={styles.newsCardImage}
    />
    <View style={styles.newsCardTitleView}>
      <Text style={styles.newsCardTitle}>{ news.title }</Text>
    </View>
  </Card>
);

const styles = StyleSheet.create({
  newsCard: {
    width: Dimensions.get('window').width - 40,
    height: 120,
    paddingHorizontal: 16,
    position: 'relative'
  },
  newsCardImage: {
    position: "absolute",
    borderRadius: 18,
    top: 0,
    left: 0,
    width: Dimensions.get('window').width - 40,
    height: 120,
  },
  newsCardTitleView: {
    position: "absolute",
    bottom: 8,
    left: 8,
    width: Dimensions.get('window').width - 58,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#000a'
  },
  newsCardTitle: {
    color: colors.white
  }
});

export default NewsCard;
