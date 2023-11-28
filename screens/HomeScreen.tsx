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
      "/api/article/latest?limit=1&page=1",
      context?.token,
      (response) => {
        setArticles((prevArticles) => {
          console.log("Articles STATE:", prevArticles);
          return response?.data;
        });
      }
    );
  };

  const renderArticles = () => {
    if (articles.length === 0) {
      return (
        <View style={styles.emptyView}>
          {/* Add your empty state content */}
        </View>
      );
    }
  
    return articles.map((article: ArticleType) => (
      <View key={article.id} style={styles.articleContainer}>
        <Text style={styles.articleTitle}>{article.title}</Text>
        {/* <Image source={{ uri: article.mainImage }} style={styles.articleImage} />
        <Text style={styles.articleDescription}>{article.content}</Text>
        <Text style={styles.articleAuthor}>Author: {article.author}</Text> */}
        {/* Add other information you want to display */}
      </View>
    ));
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
        {/* <View>
          <Title size={24} style={{ margin: 32, marginBottom: 4 }}>
            Actualités
          </Title>
          <FlatList
            data={articles}  // Use the articles state here
            renderItem={({ item }) => <NewsCard news={item} />}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.flatList}
            showsHorizontalScrollIndicator={true}
            pagingEnabled
            horizontal
            scrollEnabled
          />

        </View> */}
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
          {renderArticles()}
          {/* <FlatList
            data={articles}
            contentContainerStyle={styles.flatList}
            renderItem={(e: ListRenderItemInfo<ArticleType>) => (
              <ArticleCard onPress={handleToArticle} item={e.item} path="article" />
            )}
            keyExtractor={(item: ArticleType) => item.id.toString()}
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            horizontal
            scrollEnabled
          /> */}
        </View>

      {/* <View>
          <Title size={24} style={{ margin: 32, marginBottom: 4 }}>
            Actualités
          </Title>
          <FlatList
            data={articles}
            contentContainerStyle={styles.flatList}
            renderItem={(e: ListRenderItemInfo<ArticleType>) => ArticleCard(e.item)}
            keyExtractor={(item: NewsType) => item.id.toString()}
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            horizontal
            scrollEnabled
          />
        </View> */}
          {/* <FlatList
              data={articles}
              style={{ marginHorizontal: 8 }}
              keyExtractor={(item: ArticleType) => item.id.toString()}
              showsHorizontalScrollIndicator={false}
              renderItem={(e: ListRenderItemInfo<ArticleType>) => (
                <ArtistCard
                  onPress={handleArticle}
                  item={e.item}
                  path="article"
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
            /> */}

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
