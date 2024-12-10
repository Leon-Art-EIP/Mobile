//* Standard imports
import { useIsFocused, useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { Text, Image, StyleSheet, ScrollView, TouchableOpacity, View, FlatList, RefreshControl, processColor, ToastAndroid } from 'react-native'

//* Local imports
import colors from '../../constants/colors';
import { get } from '../../constants/fetch';
import { cTextDark, mbAuto } from '../../constants/styles';
import { MainContext } from '../../context/MainContext';
import SockHelper from '../../helpers/SocketHelper';
import Title from '../text/Title';


const CONV_NOT_FOUND = "Error: couldn't find conversation to navigate to";


type ConversationType = {
  id: string;
  lastMessage: string;
  unreadMessages: boolean;
  UserOneId: string;
  UserOneName: string;
  UserOnePicture: string;
  UserTwoId: string;
  UserTwoName: string;
  UserTwoPicture: string;
  LastSenderId: string;
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
        console.log(res.data['chats']);
        setConversations([ ...(res.data['chats'] as ConversationType[]) ]);
        return setIsRefreshing(false);
      },
      (err: any) => console.error("Couldn't get conversations: ", err)
    );
  }


  const toggleRead = (id: string) => {
    const mapCallback = (conv: ConversationType) => {
      if (conv._id === id) {
        conv.unreadMessages = false;
      }
      return conv;
    }
    const new_conversations: ConversationType[] = conversations.map(mapCallback);
    return setConversations([ ...new_conversations ]);
  }


  const goToConversation = (convId: string) => {
    const conv = conversations.find((c: ConversationType) => c._id === convId);
    if (!conv) {
      ToastAndroid.show(CONV_NOT_FOUND, ToastAndroid.LONG);
      return console.error(CONV_NOT_FOUND);
    }

    const navObject = {
      name: conv?.UserOneId === context?.userId ?
        conv.UserTwoName : conv.UserOneName,
      ids: [
        conv._id,           // conversation ID
        conv.UserOneId,     // user ID
        conv.UserTwoId      // correspondant ID
      ]
    };

    toggleRead(convId);
    navigation?.navigate('single_conversation', navObject);
  }


  useEffect(() => {
    if (isFocused) {
      return getConversations();
    }
  }, [isFocused]);


  useEffect(() => {
    // Get conversations
    getConversations();

    // Enable sockets (for instant messages)
    if (!SockHelper.isStarted()) {
      SockHelper.start(process.env.REACT_APP_API_URL, true);
    }
    SockHelper.off('msg-recieve');
    SockHelper.on('msg-recieve', getConversations);
  }, []);


  return conversations && conversations.length !== 0 ? (
    <FlatList
      data={conversations}
      renderItem={({ item }) => (
        <TouchableOpacity
          key={item?.id?.toString() ?? (Math.random()).toString()}
          style={styles.conversationView}
          onPress={() => goToConversation(item._id)}
        >
          <View style={{ flexDirection: 'row', height: 60 }}>

            {/* Unread dot */}
            <View style={[
              styles.unreadDot,
              { backgroundColor: item.unreadMessages && item.LastSenderId !== context?.userId ? colors.primary : colors.white }
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
                fontWeight: item.unreadMessages && item.LastSenderId !== context?.userId ? 'bold' : 'normal',
                flexShrink: 1,
                color: colors.textDark
              }}>
                { item.lastMessage }
              </Text>
            </View>
          </View>
          <View style={styles.lineView} />
        </TouchableOpacity>
      )}
      keyExtractor={(item) => item?._id?.toString() ?? (Math.random()).toString()}
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
      <Text style={[mbAuto, cTextDark]}>
        C'est tout vide par ici !
      </Text>
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
