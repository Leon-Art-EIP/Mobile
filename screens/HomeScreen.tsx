import React, { useContext, useEffect, useState } from 'react';
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
  RefreshControl,
  Alert
} from 'react-native'
import { SafeAreaView } from "react-native-safe-area-context";
import { MainContext } from '../context/MainContext';
import { useNavigation } from '@react-navigation/native';

import colors from "../constants/colors";
import { ArtistType, ArticleType } from "../constants/homeValues";
import { get } from '../constants/fetch';

import Title from "../components/Title";
import ArtistCard from "../components/ArtistCard";
import ArticleCard from '../components/ArticleCard';

const HomeScreen = ({ navigation }: any) => {
  console.log('HomeScreen mounted');
  const context = useContext(MainContext);
  const [artists, setArtists] = useState<ArtistType[]>([]);
  const [articles, setArticles] = useState<ArticleType[]>([]);
  const [publications, setPublications] = useState([]);
  const [publicationId, setPublication] = useState([]);
  const [forYou, setForYou] = useState<string[]>(Array(100).fill(0));
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const handleToArtistProfile = (artist: ArtistType) => {
    console.log('artist id: ', artist._id);
    navigation.navigate('other_profile', { id: artist._id });
  };

  const handleToArticle = (article: ArticleType) => {
    navigation.navigate('article', { article });
  };
  
  const towardsPost = (publicationId) => {
    console.log('🔵 ID:', publicationId);
    navigation.navigate('singleart', { id: publicationId });
  };

  const getArticles = () => {
    if (!context?.token) {
      return ToastAndroid.show("Problem authenticating", ToastAndroid.SHORT);
    }
      get(
      "/api/article/latest?limit=5&page=0",
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
    )
  }

  const getPublications = () => {
    console.log('Token:', context?.token);
    if (!context?.token) {
      return ToastAndroid.show("Problem authenticating", ToastAndroid.SHORT);
    }
    get(
      "/api/art-publication/feed/latest?page=0&limit=15",
      context?.token,
      (response) => {
        console.log('🎨 Publications:', response.data)
        setPublications(response?.data || []);
      },
      (error) => {
        console.error("Error fetching publications:", error);
        ToastAndroid.show("Error fetching publications", ToastAndroid.SHORT);
      }
      );
      console.log('LOG');
  };

  useEffect(() => {
  }, [articles]);

  useEffect(() => {
    if (!isRefreshing) {
      return;
    }
    getArticles();
    getArtists();
    getPublications();
    setIsRefreshing(false);
  }, [isRefreshing]);

  useEffect(() => {
    getArtists();
    getArticles();
    getPublications();
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

        {/* Actualités */}

          <Title size={24} style={{ margin: 32, marginBottom: 4 }}>
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
              contentContainerStyle={styles.flatList}
              keyExtractor={(item: ArtistType) => item.email.toString()}
              showsHorizontalScrollIndicator={false}
              horizontal
              nestedScrollEnabled
              renderItem={(e: ListRenderItemInfo<ArtistType>) => (
                <ArtistCard
                  onPress={() => handleToArtistProfile(e.item)}
                  item={e.item}
                  path="other_profile"
                  // style={{ marginRight: 8 }}
                />
              )}
            />
          ) }
        </View>

        {/* Pour Vous */}

    <View>
      <Title size={24} style={{ margin: 32, marginBottom: 4 }}>
        Publications
      </Title>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.publicationsContainer}>
          {publications.map((publication, index) => (
            <TouchableOpacity key={publication._id} onPress={() => towardsPost(publication._id)}>
              <View style={styles.publicationItem}>
                <Image
                  style={styles.publicationImage}
                  source={{ uri: publication.image }}
                  // defaultSource={require('../android/android_asset/elegant_echo.png')}
                  onError={() => console.log("Image loading error")}
                />
                <Text style={styles.publicationTitle}>{publication.name}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
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
  // margin: 'auto'
  paddingLeft: 3, // Add some padding on the left
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
publicationsContainer: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  paddingHorizontal: 10,
},
publicationItem: {
  height: 120,
  width: 120,
  margin: 5,
  padding: 20,
  backgroundColor: colors.publicationPlHolder,
  borderRadius: 7,
},
publicationImage: {
  height: 50,
  marginBottom: 8,
  borderRadius: 10,
},
publicationTitle: {
  color: colors.black,
  
},
});


export default HomeScreen;
