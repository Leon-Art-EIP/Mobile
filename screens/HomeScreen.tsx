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
import {const_news, NewsType, const_artists} from "../constants/homeValues";
import colors from "../constants/colors";
import NewsCard from "../components/NewsCard";
import ArtistCard from "../components/ArtistCard";

const HomeScreen = () => {
  const [news, setNews] = useState<NewsType[]>([]);
  const [artists, setArtists] = useState<NewsType[]>([]);

  // run at startup
  useEffect(() => {
    // fetch news from back/firebase
    setNews([ ...const_news ]);
    setArtists([ ...const_artists ]);
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
            renderItem={(e: ListRenderItemInfo<NewsType>) => NewsCard(e.item)}
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
        <FlatList
          data={artists}
          renderItem={(e: ListRenderItemInfo<NewsType>) => ArtistCard(e.item)}
          horizontal
        />
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
});

export default HomeScreen;
