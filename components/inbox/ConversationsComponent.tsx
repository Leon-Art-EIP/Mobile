//* Standard imports
import { useIsFocused, useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { Text, Image, StyleSheet, ScrollView, TouchableOpacity, View, FlatList, RefreshControl, processColor } from 'react-native'

//* Local imports
import colors from '../../constants/colors';
import { get } from '../../constants/fetch';
import { MainContext } from '../../context/MainContext';
import SockHelper from '../../helpers/SocketHelper';
import Title from '../Title';


type ConversationType = {
  "_id": string;
  "lastMessage": string;
  "unreadMessages": boolean;
  "UserOneId": string;
  "UserOneName": string;
  "UserOnePicture": string;
  "UserTwoId": string;
  "UserTwoName": string;
  "UserTwoPicture": string;
};


const ConversationsComponent = () => {
  const navigation = useNavigation();
  const context = useContext(MainContext);
  const [conversations, setConversations] = useState<ConversationType[]>([]);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const isFocused = useIsFocused();


  // get conversations through back end
  const getConversations = () => {
    setIsRefreshing(true);
    get(
      `/api/conversations/${context?.userId}`,
      context?.token,
      (res: any) => {
        setConversations([ ...(res.data['chats'] as ConversationType[]) ]);
        console.log('got conversations');
        return setIsRefreshing(false);
      },
      (err: any) => console.error("Couldn't get conversations: ", err)
    );
  }


  useEffect(() => {
    if (isFocused) {
      return getConversations();
    }
  }, [isFocused]);


  useEffect(() => {
    // get conversations
    console.log('getting conversations');
    getConversations();
    if (!SockHelper.isStarted()) {
      SockHelper.start(process.env.REACT_APP_API_URL, true);
    }
    SockHelper.on('msg-recieve', () => getConversations());
  }, []);


  return conversations.length !== 0 ? (
    <FlatList
      data={conversations}
      renderItem={({ item }) => (
        <TouchableOpacity
          key={item._id.toString()}
          style={styles.conversationView}
          onPress={() => navigation?.navigate(
            'single_conversation',
            {
              name: item?.UserOneId === context?.userId ? item.UserTwoName : item.UserOneName,
              // ids: conversation ID, your ID, the correspondant ID
              ids: [
                item._id,
                item.UserOneId,
                item.UserTwoId
              ]
            }
          )}
        >
          <View style={{ flexDirection: 'row', height: 60 }}>

            {/* Unread dot */}
            <View style={[
              styles.unreadDot,
              { backgroundColor: item.unreadMessages ? colors.primary : colors.white }
            ]} />

            <Image
              source={require('../../assets/images/user.png')}
              style={styles.conversationPicture}
            />
            <View style={{ marginTop: 'auto', marginBottom: 'auto' }}>
              <Title size={16}>{
                context?.userId === item.UserTwoId ? item.UserOneName : item.UserTwoName
              }</Title>
              <Text numberOfLines={1} style={{
                fontWeight: item.unreadMessages ? 'bold' : 'normal',
                flexShrink: 1
              }}>{ item.lastMessage }</Text>
            </View>
          </View>
          <View style={styles.lineView} />
        </TouchableOpacity>
      )}
      keyExtractor={(item) => item._id.toString()}
      refreshing={isRefreshing}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={getConversations}
          colors={[colors.primary]}
        />
      }
    />
  ) : (
    <View style={{ alignSelf: 'center', flex: 1, alignItems: 'center' }}>
      <Image
        source={require('../../assets/icons/box.png')}
        style={styles.emptyImg}
      />
      <Text style={{ marginBottom: 'auto' }}>Looks empty right there !</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  conversationPicture: {
    borderWidth: 1,
    borderColor: colors.white,
    width: 50,
    height: 50,
    borderRadius: 50,
    marginHorizontal: 12,
    marginTop: 'auto',
    marginBottom: 'auto'
  },
  conversationView: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  lineView: {
    marginTop: 4,
    marginLeft: 24,
    backgroundColor: '#00000022',
    height: 1
  },
  unreadDot: {
    backgroundColor: colors.primary,
    height: 6,
    width: 6,
    borderRadius: 50,
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  emptyImg: {
    height: 100,
    width: 100,
    marginTop: 'auto',
    marginBottom: 12
  }
});

export default ConversationsComponent;
