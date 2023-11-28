import {
  TouchableOpacity,
  FlatList,
  ListRenderItemInfo,
  ScrollView,
  StyleSheet,
  View,
  LogBox,
  StatusBar,
  Image,
  ToastAndroid,
  Text,
  RefreshControl
} from 'react-native'

import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { SafeAreaView } from "react-native-safe-area-context";
import { MainContext } from '../context/MainContext';
import { useNavigation } from '@react-navigation/native';
import env from '../env';

import colors from "../constants/colors";
import { const_news, NewsType, const_artists, ArtistType } from "../constants/homeValues";
import { get } from '../constants/fetch';

import Title from "../components/Title";
import NewsCard from "../components/NewsCard";
import ArtistCard from "../components/ArtistCard";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const HomeScreen = () => {
  const { API_URL } = env;
  const [news, setNews] = useState([]);
  
  const context = useContext(MainContext);
  const latestArtist = 0;
  const navigation = useNavigation();
  const [artists, setArtists] = useState<ArtistType[]>([]);
  const [articles, setArticles] = useState<NewsType[]>([]);
  const [forYou, setForYou] = useState<string[]>(Array(100).fill(0));
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  
  const handleToArtistProfile = () => {
    navigation.navigate('singleart');
  };

  const getArticles = () => {
    if (!context?.token) {
      return ToastAndroid.show("Problem authentificating", ToastAndroid.SHORT);
    }
    console.log('IN ARTICLES');
    get(
      "/api/article/latest?limit=1&page=1",
      context?.token,
      (response: any) => {
        setArticles(response?.data?.artists);
        console.log(response.data); // Log the response here
      }
    )
  }

  const getArtists = () => {
    if (!context?.token) {
      return ToastAndroid.show("Problem authentificating", ToastAndroid.SHORT);
    }

    get(
      "/api/artists/latest?limit=5&page=0",
      context?.token,
      (response: any) => {
        setArtists(response?.data?.artists);
      }
    )
  }


  // When isRefreshing is changed
  useEffect(() => {
    if (!isRefreshing) {
      return;
    }
    getArticles();
    getArtists();
    setIsRefreshing(false);
  }, [isRefreshing]);


  // run at startup
  useEffect(() => {
    // fetch news from back/firebase
    // setNews([...const_news]);

    getArtists();
    getArticles();

    // ignore nested virtualized lists warning until I can find a solution
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  }, []);


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.bg} />
      <ScrollView nestedScrollEnabled refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={() => setIsRefreshing(current => !current)}
        />
      }>
        <View style={styles.titleView}>
          <Title style={{ color: colors.primary }}>Leon</Title>
          <Title>'Art</Title>
        </View>
        <View>
          <Title size={24} style={{ margin: 32, marginBottom: 4 }}>
            Actualités
          </Title>
          <FlatList
            data={news}
            renderItem={({ item }) => <NewsCard news={item} />}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.flatList}
            showsHorizontalScrollIndicator={true}
            pagingEnabled
            horizontal
            scrollEnabled
          />
        </View>
        <View>
          <Title
            size={24}
            style={{ margin: 32, marginBottom: 4 }}
          >
            Artistes
          </Title>

          { artists.length === 0 ? (

            <View style={styles.emptyView}>
              <Image
                style={{ height: 50, width: 50 }}
                source={require('../assets/icons/box.png')}
              />
              <Title
                size={18}
                style={{ color: colors.disabledFg }}
              >Looks quite empty here !</Title>
              <Text style={{
                fontWeight: '500',
                color: colors.disabledFg
              }}>Try to refresh the page</Text>
            </View>

          ) : (

            <FlatList
              data={artists}
              style={{ marginHorizontal: 8 }}
              keyExtractor={(item: ArtistType) => item.email.toString()}
              showsHorizontalScrollIndicator={false}
              renderItem={(e: ListRenderItemInfo<ArtistType>) => (
                <ArtistCard
                  onPress={handleToArtistProfile}
                  item={e.item}
                  path="other_profile"
                />
              )}
              horizontal
              nestedScrollEnabled
              ListFooterComponent={() => (
                <TouchableOpacity style={styles.moreArrowView}>
                  <Image
                    source={require('../assets/icons/arrow.png')}
                    style={styles.moreArrowImage}
                  />
                </TouchableOpacity>
              )}
            />

          ) }
        </View>

        {/* Oeuvres */}
        <View>
          <Title size={24} style={{ margin: 32, marginBottom: 4 }}>Pour vous</Title>

          { forYou.length === 0 ? (

            <View style={styles.emptyView}>
              <Image
                style={{ height: 50, width: 50 }}
                source={require('../assets/icons/box.png')}
              />
              <Title
                size={18}
                style={{ color: colors.disabledFg }}
              >Couldn't get art you could like !</Title>
              <Text style={{
                fontWeight: '500',
                color: colors.disabledFg
              }}>Try to refresh page</Text>
            </View>

          ) : (
            <ScrollView horizontal contentContainerStyle={{ flexGrow: 1, marginHorizontal: 10 }}>
              <FlatList
                data={forYou}
                contentContainerStyle={{ width: '100%' }}
                renderItem={(e: ListRenderItemInfo<string>) => (
                  <View style={{ flex: 1, backgroundColor: colors.disabledBg, borderRadius: 5, margin: 2, height: 100 }}>
                  </View>
                )}
                scrollEnabled={false}
                numColumns={3}
              />
            </ScrollView>
          ) }
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
  emptyView: {
    alignSelf: 'center',
    alignItems: 'center',
    marginVertical: 12
  },
  moreArrowView: {
    backgroundColor: colors.offerBg,
    borderRadius: 50,
    padding: 4,
    marginTop: 'auto',
    marginBottom: 'auto',
    marginHorizontal: 12
  },
  moreArrowImage: {
    transform: [{rotate: '-90deg'}],
    width: 24,
    height: 24
  }
});


export default HomeScreen;
