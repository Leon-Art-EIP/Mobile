import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  ListRenderItemInfo,
  StyleSheet,
  Text,
  View
} from 'react-native'
import {SafeAreaView} from "react-native-safe-area-context";
import Title from "../components/Title";
import {const_news, NewsType} from "../constants/homeValues";
import Card from "../components/Card";
import colors from "../constants/colors";

const HomeScreen = () => {
  const [news, setNews] = useState<NewsType[]>([]);

  // display a piece a news
  const renderNews = (news: NewsType) => (
    <Card style={styles.newsCard}>
      <Image key={news.id} source={{ uri: news.imgUrl }} style={styles.newsCardImage} />
      <View style={styles.newsCardTitleView}>
        <Text style={styles.newsCardTitle}>{ news.title }</Text>
      </View>
    </Card>
  );

  // run at startup
  useEffect(() => {
    // fetch news from back/firebase
    setNews([ ...const_news ]);
  }, []);

  return (
    <SafeAreaView style={styles.container}>

      {/* Title */}
      <View style={styles.titleView}>
        <Title style={{color: colors.primary }}>Leon</Title>
        <Title>'Art</Title>
      </View>


      {/* Actualités */}
      <View>
        <Title size={24} style={{ margin: 32, marginBottom: 4 }}>Actualités</Title>
          <FlatList
            data={news}
            contentContainerStyle={styles.flatList}
            renderItem={(e: ListRenderItemInfo<NewsType>) => renderNews(e.item)}
            keyExtractor={(item: NewsType) => item.id.toString()}
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            horizontal
            scrollEnabled
          />
      </View>

    {/* Artistes */}
      <View>
        <Title size={24} style={{ margin: 32, marginBottom: 4 }}>Artistes</Title>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 32
  },
  titleView: {
    display: 'flex',
    flexDirection: 'row',
    marginLeft: 32
  },
  flatList: {
    margin: 'auto'
  },
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

export default HomeScreen;
