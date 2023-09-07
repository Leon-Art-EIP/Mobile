import React, { NewLifecycle, useEffect, useState } from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  ScrollView,
  StyleSheet,
  View,
  LogBox
} from 'react-native'
import { SafeAreaView } from "react-native-safe-area-context";
import Title from "../components/Title";
import { const_news, NewsType, const_artists } from "../constants/homeValues";
import colors from "../constants/colors";
import NewsCard from "../components/NewsCard";
import ArtistCard from "../components/ArtistCard";
import ForYouArt from "../components/ForYouArt";

const HomeScreen = () => {
  const [news, setNews] = useState<NewsType[]>([]);
  const [artists, setArtists] = useState<NewsType[]>([]);
  const [forYou, setForYou] = useState<number[]>(Array(100).fill((index: number) => index));

  // run at startup
  useEffect(() => {
    // fetch news from back/firebase
    setNews([...const_news]);
    setArtists([...const_artists]);

    // ignore nested virtualized lists warning until I can find a solution
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView nestedScrollEnabled>

        {/* Title */}
        <View style={styles.titleView}>
          <Title style={{ color: colors.primary }}>Leon</Title>
          <Title>'Art</Title>
        </View>


        {/* Actualités */}
        <View>
          <Title size={24} style={{ margin: 32, marginBottom: 4 }}>Actualités</Title>
          {/* <ScrollView horizontal showsHorizontalScrollIndicator={false}> */}
          {/*   { news.map((piecOfNews: NewsType) => NewsCard(piecOfNews)) } */}
          {/* </ScrollView> */}

          <FlatList
            data={news}
            contentContainerStyle={styles.flatList}
            renderItem={(e: ListRenderItemInfo<NewsType>) => NewsCard(e.item)}
            keyExtractor={(item: NewsType) => item.id.toString()}
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            horizontal
            scrollEnabled
            nestedScrollEnabled
          />
        </View>

        {/* Artistes */}
        <View>
          <Title size={24} style={{ margin: 32, marginBottom: 4 }}>Artistes</Title>
          <FlatList
            data={artists}
            style={{ marginHorizontal: 8 }}
            keyExtractor={(item: NewsType) => item.id.toString()}
            showsHorizontalScrollIndicator={false}
            renderItem={(e: ListRenderItemInfo<NewsType>) => ArtistCard(e.item)}
            horizontal
            nestedScrollEnabled
          />
          {/* <ScrollView horizontal showsHorizontalScrollIndicator={false}> */}
          {/*   { artists.map((artist: NewsType) => ArtistCard(artist)) } */}
          {/* </ScrollView> */}
        </View>

        {/* Oeuvres */}
        <View>
          <Title size={24} style={{ margin: 32, marginBottom: 4 }}>Pour vous</Title>
          <FlatList
            scrollEnabled={false}
            data={forYou}
            renderItem={(e: any) => ForYouArt(e.item)}
            keyExtractor={(item: number) => item.toString() + Math.random().toString()}
            numColumns={3}
            style={{ display: 'flex', marginHorizontal: 14 }}
          />
          {/* <View style={{ flexWrap: 'wrap', flexDirection: 'row' }}> */}
          {/*   { forYou.map((item: number) => ForYouArt(item)) } */}
          {/* </View> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
  },
  titleView: {
    display: 'flex',
    flexDirection: 'row',
    marginLeft: 32,
    marginTop: 32
  },
  flatList: {
    margin: 'auto'
  },
});

export default HomeScreen;
