import React, { NewLifecycle, useEffect, useState } from 'react';
import {
  TouchableOpacity,
  FlatList,
  ListRenderItemInfo,
  ScrollView,
  StyleSheet,
  View,
  LogBox,
  StatusBar
} from 'react-native'
import { SafeAreaView } from "react-native-safe-area-context";
import Title from "../components/Title";
import { const_news, NewsType, const_artists } from "../constants/homeValues";
import colors from "../constants/colors";
import NewsCard from "../components/NewsCard";
import ArtistCard from "../components/ArtistCard";
import ArtPieces from "../components/ArtPieces"
import ForYouArt from "../components/ForYouArt";
import Card from "../components/Card";
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const latestArtist = 0;
  const navigation = useNavigation();
  const [news, setNews] = useState<NewsType[]>([]);
  const [artists, setArtists] = useState<NewsType[]>([]);
  const [forYou, setForYou] = useState<number[]>(Array(100).fill((index: number) => index));

  const handleToArtistProfile = () => {
    navigation.navigate('other_profile');
  };

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
      <StatusBar backgroundColor={colors.bg} />
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
            renderItem={(e: ListRenderItemInfo<NewsType>) => (
              <ArtistCard
                onPress={handleToArtistProfile}
                item={e.item}
                path="other_profile"
              />
            )}
            horizontal
            nestedScrollEnabled
          />
        </View>

        {/* Oeuvres */}
        <View>
          <Title size={24} style={{ margin: 32, marginBottom: 4 }}>Pour vous</Title>
        {/* Clickable card */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.bg,
    flex: 1
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
