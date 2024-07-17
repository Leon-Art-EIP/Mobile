import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { Text, Image, StatusBar, StyleSheet, TouchableOpacity, View, FlatList, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import colors from "../constants/colors";
import { cTextDark, flex1, flexRow, fwBold, mbAuto, mh24, mh8, mlAuto, mr4, mr8, mt8, mtAuto, mv8, ph24, ph8 } from "../constants/styles";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AntDesign from 'react-native-vector-icons/AntDesign';
import Title from "../components/text/Title";
import Card from "../components/cards/Card";
import { getImageUrl } from "../helpers/ImageHelper";
import { capitalize, formatName } from "../helpers/NamesHelper";
import { useRefresh } from "@react-native-community/hooks";
import Input from "../components/textInput/Input";


type CommentType = {
  _id: string;
  userName: string;
  userId: string;
  userPicture: string;
  body: string;             // the actual content of the comment
  likes: number;            // the number of likes
  isLiked: boolean;
};


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


const DATA: PostType = {
  _id: "mqlsdkfj",
  body: "Ceci est un post super cool sur des trucs méga intéressants",
  link: undefined,
  userName: "dev",
  userId: "qskdjfmlqksjdm,",
  userPicture: "undefined",
  likes: 1244,
  isLiked: false,
  comments: [
    {
      _id: "fgdqdsd",
      userPicture: "undefined",
      userId: "mlkjmlkjmlkj",
      likes: 1,
      userName: "dev2",
      isLiked: true,
      body: "Wow tro drol jador"
    }
  ]
};


const SinglePost = () => {
  const navigation = useNavigation();
  const post: PostType = DATA;
  const [newComment, setNewComment] = useState<string>("");


  const sendComment = () => {
    // send a new comment
  }


  const report = () => {
    // report a post here
  }


  const likePost = () => {
    // like or unlike a post
  }


  const reloadData = async () => {
    // refresh data
    console.log("refreshing the data...");
  }


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
            source={{ uri: getImageUrl(post.userPicture) }}
            style={styles.ppic}
          />
          <Text style={styles.profileText}>{ formatName(capitalize(post.userName), 20) }</Text>
        </View>

        {/* Actual content */}
        <Text style={[cTextDark, mv8]}>{ post.body }</Text>

        {/* { post.link && ( */}
          <TouchableOpacity
            onPress={() => navigation.navigate('singleart', { id: post.link })}
          >
            <Image
              source={{ uri: post.link }}
              style={styles.linkedImage}
            />
          </TouchableOpacity>
        {/* ) } */}

        {/* Likes */}
        <TouchableOpacity
          onPress={likePost}
          style={[flexRow, mt8]}
        >
          <AntDesign
            name={post.isLiked ? 'heart' : 'hearto'}
            size={16}
            color={post.isLiked ? colors.primary : colors.textDark}
            style={[ mtAuto, mbAuto, mr8 ]}
          />
          <Text style={[ cTextDark, mtAuto, mbAuto ]}>{ post.likes }</Text>
        </TouchableOpacity>
      </Card>

      {/* Separator */}
      <View style={styles.line} />

      {/* Comments */}
      <FlatList
        data={post.comments}
        renderItem={({ item }) => (
          <Card style={[ mh8, ph24 ]}>
            <View style={flexRow}>
              <Image
                source={{ uri: getImageUrl(item.userPicture) }}
                style={styles.ppic}
              />
              <Text style={styles.profileText}>{ item.userName }</Text>

              {/* Like that comment */}
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
      />

      {/* Write a comment */}
      <View style={styles.inputView}>
        <Input
          placeholder="Votre commentaire..."
          onTextChanged={setNewComment}
          style={styles.inputInput}
        />

        <TouchableOpacity
          onPress={sendComment}
        >
          <Text>Send</Text>
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
    backgroundColor: colors.disabledBg,
    borderRadius: 50,
    margin: 8,
    flexDirection: 'row'
  },
  inputInput: {
    backgroundColor: colors.disabledBg,
    margin: 0,
    flex: 1
  }
});


export default SinglePost;
