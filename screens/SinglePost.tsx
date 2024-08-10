import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Text, Image, StatusBar, StyleSheet, TouchableOpacity, View, FlatList, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "../constants/colors";
import { cText, cTextDark, flex1, flexRow, fwBold, mbAuto, mh24, mh8, mlAuto, mr20, mr4, mr8, mt8, mtAuto, mv8, ph24, ph8, taCenter } from "../constants/styles";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AntDesign from 'react-native-vector-icons/AntDesign';
import Title from "../components/text/Title";
import Card from "../components/cards/Card";
import { getImageUrl } from "../helpers/ImageHelper";
import { capitalize, formatName } from "../helpers/NamesHelper";
import { useRefresh } from "@react-native-community/hooks";
import Input from "../components/textInput/Input";
import { MainContext } from "../context/MainContext";
import { RedditPostType } from "../constants/homeValues";
import { get, post } from "../constants/fetch";


type PostType = {
  _id: string;
  body: string;             // the actual content
  link: string | undefined; // if it is linked to another post
  userName: string;
  userId: string;
  userPicture: string;
  likes: number;            // the number of likes this post has
  isLiked: boolean;
  comments: CommentType[];
};


const DATA: RedditPostType = {
  id: "POST_ID",
  text: "POST_TEXT",
  artPublicationId: "ARTPUBLICATION_ID",
  artPublication: undefined,
  userId: "USER_ID,",
  likes: [],
  user: {
    username: "USERNAME",
    profilePicture: "USER_PICTURE"
  },
  createdAt: new Date()
};


type CommentType = {
  _id: string;
  userName: string;
  userId: string;
  userPicture: string;
  body: string;             // the actual content of the comment
  likes: number;            // the number of likes
  isLiked: boolean;
};


const SinglePost = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const context = useContext(MainContext);
  const [redditPost, setRedditPost] = useState<RedditPostType>(DATA);
  const [isLiked, setIsLiked] = useState<boolean>(!!redditPost?.likes.includes(context?.userId ?? "", 0));
  const [newComment, setNewComment] = useState<string>("");


  const sendComment = () => {
    // send a new comment
  }


  const report = () => {
    // report a post here
  }


  const likePost = () => {
    const callback = () => {
      let new_object: RedditPostType = { ...redditPost };
      if (isLiked) {
        new_object.likes = new_object.likes?.filter(
          (like: string) => like === context?.userId
        );
      } else {
        new_object.likes?.push(context?.userId ?? "");
      }
      return setRedditPost({ ...new_object });
    }

    return post(
      `/api/posts/like/${redditPost.id}`,
      { id: redditPost?.id },
      context?.token,
      callback,
      (err: any) => console.error({ ...err })
    );
    // like or unlike a post
  }


  const reloadData = async () => {
    // refresh data
    console.log("refreshing the data...");
  }


  useEffect(() => {
    setIsLiked(!!redditPost?.likes.includes(context?.userId ?? "", 0))
  }, [post]);


  useEffect(() => {
    if (!!route?.params?.post) {
      setRedditPost(route.params.post)
    }
  }, []);


  const { isRefreshing, onRefresh } = useRefresh(reloadData)


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle='dark-content' backgroundColor={colors.bg}/>

      <View style={flexRow}>

        {/* Back arrow */}
        <TouchableOpacity
          onPress={navigation.goBack}
          style={[mtAuto, mbAuto, mh8]}
        >
          <Ionicons name="chevron-back-outline" color={colors.black} size={32} />
        </TouchableOpacity>

        <Title
          style={[mtAuto, mbAuto, mh8]}
        >Post</Title>

        {/* Report */}
        <TouchableOpacity
          onPress={report}
          style={[mlAuto, mtAuto, mbAuto, mh24]}
        >
          <MaterialIcons
            name="report-problem"
            color={colors.primary}
            size={24}
          />
        </TouchableOpacity>
      </View>

      <Card style={[ mh8, ph24 ]}>

        {/* Profile card */}
        <View style={[ flexRow ]}>
          <Image
            source={{ uri: getImageUrl(redditPost?.user.profilePicture) }}
            style={styles.ppic}
          />
          <Text style={styles.profileText}>{ formatName(capitalize(redditPost?.user.username), 20) }</Text>
        </View>

        {/* Actual content */}
        <Text style={[cTextDark, mv8]}>{ redditPost.text }</Text>

        { redditPost?.artPublication && (
          <TouchableOpacity
            onPress={() => navigation.navigate('singleart', { id: redditPost.artPublicationId ?? "" })}
          >
            <Image
              source={{ uri: redditPost.artPublication ?? "" }}
              style={styles.linkedImage}
            />
          </TouchableOpacity>
        ) }

        {/* Likes */}
        <TouchableOpacity
          onPress={likePost}
          style={[flexRow, mt8]}
        >
          <AntDesign
            name={isLiked ? 'heart' : 'hearto'}
            size={16}
            color={isLiked ? colors.primary : colors.textDark}
            style={[ mtAuto, mbAuto, mr8 ]}
          />
          <Text style={[ cTextDark, mtAuto, mbAuto ]}>{ redditPost?.likes.length }</Text>
        </TouchableOpacity>
      </Card>

      {/* Separator */}
      <View style={styles.line} />

      <View style={flex1}>
        <Text style={[ cText, taCenter ]}>
          Les commentaires seront bientôt disponibles
        </Text>
      </View>

      {/* Comments */}
      {/* <FlatList
        data={post.comments}
        renderItem={({ item }) => (
          <Card style={[ mh8, ph24 ]}>
            <View style={flexRow}>
              <Image
                source={{ uri: getImageUrl(item.userPicture) }}
                style={styles.ppic}
              />
              <Text style={styles.profileText}>{ item.userName }</Text>

              <TouchableOpacity
                onPress={likePost}
                style={[ flexRow, mlAuto ]}
              >
                <AntDesign
                  name={item.isLiked ? 'heart' : 'hearto'}
                  size={16}
                  color={item.isLiked ? colors.primary : colors.textDark}
                  style={[ mtAuto, mbAuto, mr4 ]}
                />
                <Text style={[ cTextDark, mtAuto, mbAuto ]}>{ item.likes }</Text>
              </TouchableOpacity>

            </View>

            <Text style={[ cTextDark, { marginTop: 8 } ]}>{ item.body }</Text>
          </Card>
        )}
        refreshControl={<RefreshControl
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          tintColor={colors.primary}
          colors={[ colors.primary ]}
        />}
        contentContainerStyle={[flex1]}
      /> */}

      {/* Write a comment */}
      <View style={styles.inputView}>
        <Input
          placeholder="Votre commentaire..."
          onTextChanged={setNewComment}
          style={styles.inputInput}
        />

        <TouchableOpacity
          onPress={sendComment}
          style={[ mtAuto, mbAuto, mr8 ]}
        >
          <Ionicons
            name="send"
            color={colors.primary}
            size={24}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.bg,
    flex: 1
  },
  ppic: {
    height: 40,
    width: 40,
    borderRadius: 50,
    backgroundColor: colors.tertiary
  },
  profileText: {
    fontWeight: 'bold',
    fontSize: 14,
    color: colors.black,
    marginTop: 'auto',
    marginBottom: 'auto',
    marginLeft: 12
  },
  line: {
    backgroundColor: colors.text,
    height: 2,
    width: "50%",
    marginLeft: 'auto',
    marginRight: 'auto',
    marginVertical: 8
  },
  linkedImage: {
    height: 150,
    marginVertical: 8,
    backgroundColor: colors.tertiary,
    borderRadius: 15
  },
  inputView: {
    marginTop: 'auto',
    paddingHorizontal: 12,
    backgroundColor: colors.disabledBg,
    borderRadius: 50,
    margin: 8,
    flexDirection: 'row'
  },
  inputInput: {
    backgroundColor: colors.disabledBg,
    marginHorizontal: 0,
    flex: 1
  }
});


export default SinglePost;
