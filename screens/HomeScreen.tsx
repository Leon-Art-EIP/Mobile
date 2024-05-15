import React, {useCallback, useContext, useEffect, useState} from 'react';
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
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { MainContext } from '../context/MainContext';
import { getImageUrl } from '../helpers/ImageHelper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import colors from "../constants/colors";
import { ArtistType, ArticleType } from "../constants/homeValues";
import { get } from '../constants/fetch';
import { useFocusEffect } from '@react-navigation/native';

import Title from "../components/text/Title";
import ArtistCard from "../components/cards/ArtistCard";
import ArticleCard from '../components/cards/ArticleCard';
import {useFocusEffect} from "@react-navigation/native";
import { setupNotifications, getUnreadNotifCount } from '../constants/notifications';


const HomeScreen = ({ navigation }: any) => {
  const context = useContext(MainContext);
  const [artists, setArtists] = useState<ArtistType[]>([]);
  const [articles, setArticles] = useState<ArticleType[]>([]);
  const [publications, setPublications] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState<boolean>(false);


  const handleToArtistProfile = (artist: ArtistType) => {
    navigation.navigate('other_profile', { id: artist._id });
  };


  const handleToArticle = (article: ArticleType) => {
    navigation.navigate('article', { article });
  };


  const towardsPost = (publicationId: string) => {
    navigation.navigate('singleart', { id: publicationId });
  };


  const getArticles = () => {
    if (!context?.token) {
      return ToastAndroid.show("Problem authenticating", ToastAndroid.SHORT);
    }
      get(
      "/api/article/latest?limit=10&page=0",
      context?.token,
      (response) => {
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
    );
  };


  const getPublications = () => {
    if (!context?.token) {
      return ToastAndroid.show("Problem authenticating", ToastAndroid.SHORT);
    }

    get(
      "/api/art-publication/feed/latest?page=0&limit=50",
      context?.token,
      (response) => setPublications(response?.data || []),
      (error) => {
        ToastAndroid.show("Error fetching publications", ToastAndroid.SHORT);
        return console.error("Error fetching publications:", error);
      }
    );
  };


  const getHasUnreadNotifications = async () => {
    let unreadNumber: number = await getUnreadNotifCount(context?.token);
    setHasUnreadNotifications(unreadNumber !== 0 && unreadNumber !== -1);
  }


  const refreshData = () => {
    getArticles();
    getArtists();
    getPublications();
    getHasUnreadNotifications();
  };


  useEffect(() => {
    if (!isRefreshing) {
      return;
    }
    refreshData();
    setIsRefreshing(false);
  }, [isRefreshing]);


  useEffect(() => {
    refreshData();
    setupNotifications(context?.token);
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
  }, []);


  useFocusEffect(
    useCallback(refreshData, [navigation])
  );


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.bg} barStyle='dark-content' />
      <ScrollView nestedScrollEnabled refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={() => setIsRefreshing(current => !current)}
          colors={[colors.primary]}
        />
      }>
        <View style={styles.titleView}>
          <Title style={{ color: colors.primary }}>Leon</Title>
          <Title>'Art</Title>
          <TouchableOpacity
            onPress={() => navigation.navigate('notifications')}
            style={styles.notifIconTouchable}
          >
            <MaterialIcons
              name={hasUnreadNotifications ? "notification-important" : "notifications"}
              size={32}
              color={hasUnreadNotifications ? colors.primary : colors.black}
            />
          </TouchableOpacity>
        </View>
        <View>

        {/* Actuality */}

          <Title size={24} style={{ margin: 32, marginBottom: 8 }}>
            Actualités
          </Title>
          {articles.length === 0 ? (
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
              data={articles}
              contentContainerStyle={styles.flatList}
              renderItem={(e: ListRenderItemInfo<ArticleType>) => (
                <ArticleCard
                  onPress={() => handleToArticle(e.item)}
                  item={e.item}
                  path="article"
                />
              )}
              keyExtractor={(item) => (item.id ? item.id.toString() : item.title)}
              showsHorizontalScrollIndicator={false}
              pagingEnabled
              horizontal
              scrollEnabled
            />
          )}
        </View>

        {/* Artistes */}
        <View>
          <Title
            size={24}
            style={{ margin: 32, marginBottom: 8 }}
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
              contentContainerStyle={styles.flatList}
              keyExtractor={(item: ArtistType) => item.email.toString()}
              showsHorizontalScrollIndicator={false}
              horizontal
              nestedScrollEnabled
              renderItem={(e: ListRenderItemInfo<ArtistType>) => e.item._id === context?.userId ? (<></>) : (
                <ArtistCard
                  onPress={() => handleToArtistProfile(e.item)}
                  item={e.item}
                  path="other_profile"
                />
              )}
            />
          ) }
        </View>

        {/* Pour Vous */}

      <View>
        <Title size={24} style={{ margin: 32, marginBottom: 8 }}>
          Publications
        </Title>

        <View style={styles.publicationsContainer}>
          <FlatList
            data={publications.filter((pub) => pub?.userId !== context?.userId)}
            numColumns={3}
            renderItem={(e) => (
              <TouchableOpacity key={e.item._id} onPress={() => towardsPost(e.item._id)}>
                <View style={styles.publicationItem}>
                  <Image
                    style={styles.publicationImage}
                    source={{ uri: getImageUrl(e.item.image) }}
                    onError={() => console.log("Image loading error")}
                  />
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </ScrollView>
  </SafeAreaView>
  );
};

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
    paddingLeft: 3,
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
    marginBottom: 8,
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  notifIconTouchable: {
    marginLeft: 'auto',
    marginTop: 'auto',
    marginRight: 12
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
  publicationsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
  },
  publicationItem: {
    height: 120,
    width: 120,
    margin: 5,
    backgroundColor: colors.disabledBg,
    borderRadius: 7,
  },
  publicationImage: {
    height: 120,
    width: 120,
    borderRadius: 7,
  },
  publicationTitle: {
    color: colors.black,
  },
});


export default HomeScreen;
