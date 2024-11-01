import React, {useCallback, useContext, useEffect, useRef, useState} from 'react';
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
import Entypo from 'react-native-vector-icons/Entypo';
import { SafeAreaView } from "react-native-safe-area-context";
import { MainContext } from '../context/MainContext';
import { getImageUrl } from '../helpers/ImageHelper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import colors from "../constants/colors";
import { ArtistType, ArticleType, RedditPostType } from "../constants/homeValues";
import { get, post } from '../constants/fetch';
import { useFocusEffect } from '@react-navigation/native';

import Title from "../components/text/Title";
import ArtistCard from "../components/cards/ArtistCard";
import ArticleCard from '../components/cards/ArticleCard';
import { setupNotifications, getNotificationCount } from '../constants/notifications';
import Button from '../components/buttons/Button';
import SlidingUpPanel from 'rn-sliding-up-panel';
import { aiCenter, bgColor, cTextDark, flex1, flexRow, mbAuto, mh0, mh24, ml4, ml8, mr4, mt8, mtAuto, mv24, fwBold, mvAuto, mr8, mr20, bgRed } from '../constants/styles';
import Card from '../components/cards/Card';
import AntDesign from "react-native-vector-icons/AntDesign";


const HomeScreen = ({ navigation }: any) => {
  const context = useContext(MainContext);
  const [artists, setArtists] = useState<ArtistType[]>([]);
  const [articles, setArticles] = useState<ArticleType[]>([]);
  const [posts, setPosts] = useState<RedditPostType[]>([]);
  const [publications, setPublications] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState<number>(0);
  const [isPublications, setIsPublications] = useState<boolean>(true); // true: art publications, false: reddit posts
  const _slidingPanel = useRef<SlidingUpPanel>(null);


  const handleToArtistProfile = (artist: ArtistType) => {
    navigation.navigate('other_profile', { id: artist._id });
  };


  const handleToArticle = (article: ArticleType) => {
    navigation.navigate('article', { article });
  };

  const handleToArticlesList = (articles) => {
    navigation.navigate('articles', {articles});
  };

  const towardsPost = (publicationId: string) => {
    navigation.navigate('singleart', { id: publicationId });
  };


  const logOut = () => {
    ToastAndroid.show('Veuillez vous reconnecter', ToastAndroid.SHORT);
    context?.logOut();
    return navigation.navigate('login');
  }


  const onErrorCallback = (error: any) => {
    if (error.response.status === 401) {
      return logOut();
    }

    console.error({ ...error });
    ToastAndroid.show("Une erreur est survenue", ToastAndroid.SHORT);
  }


  const getArticles = () => {
    if (!context?.token) {
      return logOut();
    }

    get(
      "/api/article/latest?limit=10&page=0",
      context?.token,
      (response) => {
        setArticles(response?.data || []);
      },
      onErrorCallback
    );
  };


  const getArtists = () => {
    if (!context?.token) {
      return logOut();
    }

    get(
      "/api/artists/latest?limit=5&page=0",
      context?.token,
      (response: any) => {
        setArtists(response?.data?.artists);
      },
      onErrorCallback
    );
  };


  const getPublications = () => {
    if (!context?.token) {
      return logOut();
    }

    get(
      "/api/art-publication/feed/latest?page=0&limit=50",
      context?.token,
      (response: any) => setPublications(response?.data),
      onErrorCallback
    );
  };


  const getHasUnreadNotifications = async () => {
    const unreadNumber: number | undefined = await getNotificationCount(context?.token) as number;
    setHasUnreadNotifications(unreadNumber ?? 0);
  };


  const getPosts = () => {
    const callback = async (res: any) => {
      setPosts(res?.data);

      const new_array = await Promise.all(
        res?.data.map(async (item: RedditPostType) => {
          if (!item?.artPublication) {
            return item;
          }

          const promise: string = await new Promise((resolve, reject) => {
            get(
              `/api/art-publication/${item.artPublicationId}`,
              context?.token,
              (res: any) => resolve(res.data?.image),
              () => reject()
            );
          });

          item.artPublication = {
            name: item?.artPublication?.name,
            image: promise
          };

          return item;
        })
      );

      setPosts([ ...new_array ]);
      setIsRefreshing(false);
    };

    setIsRefreshing(true);
    return get(
      "/api/posts?filter=popular",
      context?.token,
      callback,
      onErrorCallback
    );
  };


  const likePost = (id: string) => {
    return post(
      `/api/posts/like/${id}`,
      { id: id },
      context?.token,
      getPosts,
      onErrorCallback
    );
  };


  // if publications is true, it will load art publications, else the posts
  const refreshData = () => {
    getArticles();
    getArtists();
    if (isPublications) {
      getPublications();
    } else {
      getPosts();
    }
    getHasUnreadNotifications();
  };


  useEffect(() => {
    if (isPublications) {
      getPublications();
    } else {
      getPosts();
    }
  }, [isPublications]);


  useEffect(() => {
    if (!isRefreshing) {
      return;
    }
    refreshData();
    setIsRefreshing(false);
  }, [isRefreshing]);


  useEffect(() => {
    refreshData();
    /* I have to patch the display, it's too slow and to low
     if (!isNotificationRegistered()) {
       _slidingPanel.current?.show();
     }
     */
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
          tintColor={context?.userColor ?? colors.primary}
          onRefresh={() => setIsRefreshing(current => !current)}
          colors={[context?.userColor ?? colors.primary]}
        />
      }>
        <View style={styles.titleView}>
          <Title style={{ color: context?.userColor ?? colors.primary }}>Leon</Title>
          <Title>'Art</Title>
          <TouchableOpacity
            onPress={() => navigation.navigate('notifications')}
            style={styles.notifIconTouchable}
          >
            <MaterialIcons
               name={"notifications"}
               size={24}
               color={colors.offerFg}
             />
             <Text style={styles.notifIconText}>{ hasUnreadNotifications }</Text>
          </TouchableOpacity>
        </View>

        {/* News */}
        <View>
          <TouchableOpacity
            style={[flexRow, aiCenter, flex1]}
            onPress={() => handleToArticlesList(articles)}
          >
            <Title
              style={styles.newsTitle}
              size={24}
            >
              Actualités
            </Title>

            <Entypo
              name="chevron-thin-right"
              color={colors.black}
              size={20}
              style={[mvAuto, mr20]}
            />
          </TouchableOpacity>

          { articles.length === 0 ? (
            <View style={styles.emptyView}>
              <Image
                style={{ height: 50, width: 50 }}
                source={require('../assets/icons/box.png')}
              />
              <Title
                size={18}
                style={{ color: colors.disabledFg }}
              >C'est tout vide par ici !</Title>
              <Text style={{
                fontWeight: '500',
                color: colors.disabledFg
              }}>Essaie de recharger la page</Text>
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
          ) }
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
              >C'est tout vide par ici !</Title>
              <Text style={{
                fontWeight: '500',
                color: colors.disabledFg
              }}>Essaie de recharger la page</Text>
            </View>
            ) : (
            <FlatList
              data={artists}
              contentContainerStyle={styles.flatList}
              keyExtractor={(item: ArtistType) => item.email.toString()}
              showsHorizontalScrollIndicator={false}
              horizontal
              nestedScrollEnabled
              renderItem={(e: ListRenderItemInfo<ArtistType>) => e.item._id === context?.userId ? (
                <></>
              ) : (
                <ArtistCard
                  onPress={() => handleToArtistProfile(e.item)}
                  item={e.item}
                />
              )}
            />
          ) }
        </View>

        {/* Pour Vous */}
        <View>
          <View style={[flexRow]}>
            <Title size={24} style={{ margin: 32, marginBottom: 8 }}>
              Publications
            </Title>
          </View>

          {/* oeuvres or posts chooser */}
          <View style={[ flexRow, mh24 ]}>
            <Button
              value='Oeuvres'
              onPress={() => setIsPublications(true)}
              secondary={!isPublications}
              tertiary={isPublications}
              style={[ mh0, flex1, mr4, { height: 40 } ]}
              textStyle={{ fontSize: 13 }}
            />
            <Button
              value='Posts >'
              onPress={() => setIsPublications(false)}
              secondary={isPublications}
              tertiary={!isPublications}
              style={[ mh0, flex1, ml4, { height: 40 } ]}
              textStyle={{ fontSize: 13 }}
            />

          </View>

          {/* If is art publication, then post */}
          { isPublications ? (
            <View style={styles.publicationsContainer}>
              <FlatList
                horizontal={false}
                key={"artFlatList"}
                data={publications.filter((pub) => pub?.userId !== context?.userId)}
                numColumns={3}
                renderItem={(e) => (
                  <TouchableOpacity
                    key={e.item._id + Math.random().toString()}
                    onPress={() => towardsPost(e.item?._id)}
                    style={{ flex: 1/3 }}
                  >
                    <View style={styles.publicationItem}>
                      <Image
                        style={styles.publicationImage}
                        source={{ uri: getImageUrl(e.item?.image) }}
                        onError={() => console.log("Image loading error")}
                      />
                    </View>
                  </TouchableOpacity>
                )}
              />
            </View>
          ) : (
            <View style={styles.publicationsContainer}>
              <FlatList
                key={"postFlatList"}
                data={posts.filter((post) => post?.userId !== context?.userId)}
                numColumns={1}
                renderItem={(post) => (
                  <TouchableOpacity
                    onPress={() => navigation.navigate('singlepost', { post: post.item })}
                  >
                    <Card style={mh0}>
                      <View style={flexRow}>
                        <Image
                          source={{ uri: getImageUrl(post.item?.user?.profilePicture ?? "") }}
                          style={{
                            height: 30,
                            width: 30,
                            borderRadius: 50
                          }}
                        />

                        <Text style={[cTextDark, mtAuto, mbAuto, ml8]}>
                          { post.item?.user?.username }
                        </Text>
                      </View>

                      {/* To update according to the back-end */}
                      <Text style={cTextDark}>{ post.item?.text }</Text>

                      {/* if retweet, show picture */}
                      { post.item?.artPublication && (
                        <TouchableOpacity
                          onPress={() => navigation.navigate('singleart', { id: post.item?.artPublicationId })}
                        >
                          <Image
                            source={{ uri: getImageUrl(post.item?.artPublication?.image ?? "") }}
                            style={styles.postImage}
                          />
                        </TouchableOpacity>
                      ) }

                      {/* Post action bar */}
                      <View style={[flexRow]}>

                        {/* Like button */}
                        <TouchableOpacity
                          onPress={() => likePost(post.item.id)}
                          style={[flexRow, mt8]}
                        >
                          <AntDesign
                            name={post.item?.likes?.includes(context?.userId ?? "", 0) ? "heart" : "hearto"}
                            size={18}
                            color={post.item?.likes?.includes(context?.userId ?? "", 0) ? colors.primary : colors.textDark}
                          />
                          <Text style={[cTextDark, ml8, { fontSize: 12 }]}>
                            { post.item?.likes?.length }
                          </Text>
                        </TouchableOpacity>

                      </View>
                    </Card>
                  </TouchableOpacity>
                )}
              />
            </View>
          ) }
        </View>

        {/* Notification Sliding Panel */}
        <SlidingUpPanel
          ref={_slidingPanel}
          height={200}
          allowDragging={true}
          draggableRange={{ top: 200, bottom: 0 }}
          containerStyle={[ bgColor, { borderTopLeftRadius: 20, borderTopRightRadius: 20 } ]}
        >
          <>
            <View style={[ flex1, aiCenter, mv24 ]}>
              <Title style={cTextDark}>Dring dring !</Title>
              <Text style={cTextDark}>Voulez-vous activer les notifications ?</Text>
            </View>

            <View style={flexRow}>
              <Button
                value="Non"
                onPress={() => _slidingPanel.current?.hide()}
                style={flex1}
                secondary
              />
              <Button
                value="Oui !"
                onPress={async () => {
                  await setupNotifications(context?.token);
                  ToastAndroid.show("Les notifications ont été activées !", ToastAndroid.SHORT);
                  return _slidingPanel.current?.hide();
                }}
                style={flex1}
              />
            </View>
          </>
        </SlidingUpPanel>
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
    marginRight: 12,
    flexDirection: 'row',
    backgroundColor: colors.offerBg,
    borderRadius: 50,
    paddingVertical: 4,
    paddingHorizontal: 12,
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
    paddingHorizontal: 24,
  },
  publicationItem: {
    width: '90%',
    margin: 5,
    backgroundColor: colors.disabledBg,
    borderRadius: 7,
  },
  publicationImage: {
    height: 120,
    width: '100%',
    borderRadius: 7,
  },
  publicationTitle: {
    color: colors.black,
  },
  notifIconText: {
    color: colors.offerFg,
    fontWeight: 'bold',
    marginHorizontal: 4,
  },
  postImage: {
    height: 200,
    borderRadius: 12,
    backgroundColor: colors.tertiary,
    marginVertical: 8
  },
  newsTitle: {
    fontWeight: 'bold',
    flex: 1,
    marginLeft: 32,
    marginTop: 8,
    marginBottom: 8
  }
});


export default HomeScreen;
