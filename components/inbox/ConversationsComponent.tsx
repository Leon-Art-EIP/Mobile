//* Standard imports
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Text, Image, StyleSheet, ScrollView, TouchableOpacity, View } from 'react-native'

//* Local imports
import colors from '../../constants/colors';
import { MessageType } from '../../constants/conversations';
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


  // get conversations through back end
  const getConversations = () => {
    get(
      `/api/conversations/${context?.userId}`,
      context?.token,
      (res: any) => setConversations([
        ...(res.data['chats'] as ConversationType[])
      ]),
      (err: any) => console.error("Couldn't get conversations: ", err)
    );
  }


  useEffect(() => {
    // get conversations
    getConversations();

    /* // socket gestion */
    /* if (!SockHelper.isStarted()) { */
    /*   SockHelper.start(); */
    /*   SockHelper.on('msg-recieve', (msg: MessageType) => console.log({ ...msg })) */
    /* } */
    /**/
    //TODO implementing Sockets
  }, []);


  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
      { conversations.length > 0 ? conversations.map((conversation: ConversationType) => (
        <TouchableOpacity
          key={conversation['_id'].toString()}
          style={styles.conversationView}
          onPress={() => navigation?.navigate(
            'single_conversation',
            {
              name: conversation?.UserOneId === context?.userId ? conversation['UserTwoName'] : conversation['UserOneName'],
              // ids: conversation ID, your ID, the correspondant ID
              ids: [
                conversation['_id'],
                conversation['UserOneId'],
                conversation['UserTwoId']
              ]
            }
          )}
        >
          <View style={{ flexDirection: 'row', height: 60 }}>

            {/* Unread dot */}
            <View style={[
              styles.unreadDot,
              { backgroundColor: conversation.unreadMessages ? colors.primary : colors.white }
            ]} />

            <Image
              source={require('../../assets/images/user.png')}
              style={styles.conversationPicture}
            />
            <View style={{ marginTop: 'auto', marginBottom: 'auto' }}>
              <Title size={16}>{
                context?.userId === conversation['UserTwoId'] ? conversation['UserOneName'] : conversation['UserTwoName']
              }</Title>
              <Text numberOfLines={1} style={{
                fontWeight: conversation.unreadMessages ? 'bold' : 'normal',
                flexShrink: 1
              }}>{ conversation.lastMessage }</Text>
            </View>
          </View>
          <View style={styles.lineView} />
        </TouchableOpacity>
      )) : (
        <View style={{ alignSelf: 'center', flex: 1, alignItems: 'center' }}>
          <Image
            source={require('../../assets/icons/box.png')}
            style={styles.emptyImg}
          />
          <Text style={{ marginBottom: 'auto' }}>Looks empty right there !</Text>
        </View>
      ) }
    </ScrollView>
  )
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
