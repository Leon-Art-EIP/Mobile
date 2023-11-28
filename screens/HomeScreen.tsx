import React, { useContext, useEffect, useState } from 'react';
import { ToastAndroid, LogBox, ScrollView, StyleSheet, View, StatusBar, Image, Text, RefreshControl, FlatList, ListRenderItemInfo, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { SafeAreaView } from "react-native-safe-area-context";
import { MainContext } from '../context/MainContext';
import { useNavigation } from '@react-navigation/native';
import env from '../env';

import colors from "../constants/colors";
import { const_news, NewsType, const_artists, ArtistType, ArticleType } from "../constants/homeValues";
import { get } from '../constants/fetch';

import Title from "../components/Title";
import NewsCard from "../components/NewsCard";
import ArtistCard from "../components/ArtistCard";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ArticleCard from '../components/ArticleCard';

const HomeScreen = () => {
  const { API_URL } = env;
  const [news, setNews] = useState([]);
  const context = useContext(MainContext);
  const navigation = useNavigation();
  const [artists, setArtists] = useState<ArtistType[]>([]);
  const [articles, setArticles] = useState<ArticleType[]>([]);
  const [forYou, setForYou] = useState<string[]>(Array(100).fill(0));
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const handleToArtistProfile = () => {
    navigation.navigate('singleart');
  };

  const handleToArticle = () => {
    navigation.navigate('article');
  };

  const getArticles = () => {
    if (!context?.token) {
      return ToastAndroid.show("Problem authenticating", ToastAndroid.SHORT);
    }
  
    console.log('IN ARTICLES');
    get(
      "/api/article/latest?limit=5&page=0",
      context?.token,
      (response) => {
        console.log("API Response for Articles:", response);
        setArticles(response?.data || []);
      },
      (error) => {
        console.error("Error fetching articles:", error);
        ToastAndroid.show("Error fetching articles", ToastAndroid.SHORT);
      }
    );
  };

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

  useEffect(() => {
    console.log("Articles state updated:", articles);
  }, [articles]);

  useEffect(() => {
    if (!isRefreshing) {
      return;
    }
    getArticles();
    getArtists();
    setIsRefreshing(false);
  }, [isRefreshing]);

  useEffect(() => {
    getArtists();
    getArticles();
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
        <View>
          <Title size={24} style={{ margin: 32, marginBottom: 4 }}>
            Actualités
          </Title>

          {articles.length === 0 ? (
            <View style={styles.emptyView} />
          ) : (
            <FlatList
              data={articles}
              keyExtractor={(item) => (item.id ? item.id.toString() : item.title)}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <View key={item.id} style={styles.articleContainer}>
                  <Text style={styles.articleTitle}>{item.title}</Text>
                  <Image source={{ uri: item.mainImage }} style={styles.articleImage} />
                  <Text style={styles.articleDescription}>{item.content}</Text>
                </View>
              )}
            />
          )}
        </View>
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
  },
  articleContainer: {
    marginHorizontal: 8,
    marginBottom: 16,
  },
  
  articleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  
  articleImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
  },

  articleDescription: {
    fontSize: 16,
    marginBottom: 8,
  },

  articleAuthor: {
    fontSize: 14,
    color: colors.disabledFg,
  },
});


export default HomeScreen;
